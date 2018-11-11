import React from 'react';
import Lane from './Lane';
import axios from 'axios';
import update from 'react-addons-update';

class Component extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            flip: false,
            ticketsBacklog: [],
            ticketsProgress: [],
            ticketsDone: [],
            ticketsClosed: [],
            wip: this.props.wip,
        }

        this.toggle = this.toggle.bind(this);
        this.changeTicketLaneForward = this.changeTicketLaneForward.bind(this);
        this.changeTicketLaneBackward = this.changeTicketLaneBackward.bind(this);
        this.pushTicket = this.pushTicket.bind(this);
        this.removeTicket = this.removeTicket.bind(this);
        this.sortLane = this.sortLane.bind(this);
    }

    componentWillMount(){
        axios.get('/get-tickets-dash', {params: {component: this.props.id}}).then(response => {
            let tickets = response.data.tickets;
            this.setState( {
                ticketsBacklog: this.sortTickets(tickets.filter(item => item.lane == 0)),
                ticketsProgress: this.sortTickets(tickets.filter(item => item.lane == 1)),
                ticketsDone: this.sortTickets(tickets.filter(item => item.lane == 2)),
                ticketsClosed: this.sortTickets(tickets.filter(item => item.lane == 3)),
                shortName: response.data.shortName,
            });
        });
    }

    toggle(){
        this.setState({flip: !this.state.flip});
    }

    changeTicketLaneForward(ticket, fromToolbar){
        if(fromToolbar){
            if(ticket.lane == 0){ 
                this.removeTicket(ticket, ticket.lane);
                ticket.lane = 1;
                this.pushTicket(ticket);
                
            }
            else if(ticket.lane == 1){
                this.removeTicket(ticket, ticket.lane);
                ticket.lane = 2;
                this.pushTicket(ticket);
            }
            else if(ticket.lane == 2){
                this.removeTicket(ticket, ticket.lane);
                ticket.lane = 3;
                this.pushTicket(ticket);
            }
        }

        axios.post('/change-lane', {id: ticket.id, lane: ticket.lane});
    }

    changeTicketLaneBackward(ticket){
        if(ticket.lane == 1){
            this.removeTicket(ticket, ticket.lane);
            ticket.lane = 0;
            this.pushTicket(ticket);
        }
        else if(ticket.lane == 2){
            this.removeTicket(ticket, ticket.lane);
            ticket.lane = 1;
            this.pushTicket(ticket);
        }
        else if(ticket.lane == 3){
            //do nothing
        }

        axios.post('/change-lane', {id: ticket.id, lane: ticket.lane});
    }

    sortTickets(tickets){
        return tickets.sort((first, second) => { return first.id - second.id; });
    }

    sortLane(lane){
        if(lane == 0){
            this.setState({ticketsBacklog: this.state.ticketsBacklog.sort((first, second) => { return first.id - second.id; })});
        }
        else if(lane == 1){
            this.setState({ticketsProgress: this.state.ticketsProgress.sort((first, second) => { return first.id - second.id; })});
        }
        else if (lane == 2){
            this.setState({ticketsDone: this.state.ticketsDone.sort((first, second) => { return first.id - second.id; })});
        }
        else if(lane == 3){
            this.setState({ticketsClosed: this.state.ticketsClosed.sort((first, second) => { return first.id - second.id; })});
        }
        else{
            return;
        }
    }

    pushTicket(ticket){
        // console.log(ticket);
        if(ticket.lane == 0){
            this.setState({ticketsBacklog: update(this.state.ticketsBacklog, {$push: [ticket]})}, () => {
                this.sortLane(0)
            });
        }
        else if(ticket.lane == 1){
            this.setState({ticketsProgress: update(this.state.ticketsProgress, {$push: [ticket]})}, () => {
                this.sortLane(1)
            });
        }
        else if (ticket.lane == 2){
            this.setState({ticketsDone: update(this.state.ticketsDone, {$push: [ticket]})}, () => {
                this.sortLane(2);
            });
        }
        else if(ticket.lane == 3){
            this.setState({ticketsClosed: update(this.state.ticketsClosed, {$push: [ticket]})}, () => {
                this.sortLane(3)
            });
        }
        else{
            return;
        }
    }

    removeTicket(ticket, lane){
        if(lane == 0){
            this.setState({ticketsBacklog: update(this.state.ticketsBacklog, {$splice: [[this.state.ticketsBacklog.indexOf(ticket), 1]]})}, () => {
                this.sortLane(0)
            });
        }
        else if(lane == 1){
            this.setState({ticketsProgress: update(this.state.ticketsProgress, {$splice: [[this.state.ticketsProgress.indexOf(ticket), 1]]})}, () => {
                this.sortLane(1)
            });
        }
        else if (lane == 2){
            this.setState({ticketsDone: update(this.state.ticketsDone, {$splice: [[this.state.ticketsDone.indexOf(ticket), 1]]})}, () => {
                this.sortLane(2)
            });
        }
        else if(lane == 3){
            this.setState({ticketsClosed: update(this.state.ticketsClosed, {$splice: [[this.state.ticketsClosed.indexOf(ticket), 1]]})}, () => {
                this.sortLane(3)
            });
        }
        else{
            return;
        }
    }

    setTicket(ticket){
        this.setState({ticket: ticket});
    }

    saveTicket(){
        console.log('saved');
    }

    render(){
        return(
            this.state.ticketsBacklog.length > 0 || this.state.ticketsProgress.length > 0 || this.state.ticketsDone.length > 0 || this.state.ticketsClosed.length > 0 ?
                <div class="row">
                    <div class="section col-xl-10 col-lg-10 col-md-10 col-sm-10 col-12 offset-xl-1 offset-lg-1 offset-md-1 offset-sm-1 mt-2">
                        <div class="row">
                            <div class="section-head col-xl-12 py-2">
                                <div class="row">
                                    <div class="px-3"><div class="toggle d-flex" onClick={this.toggle}>
                                        <img src={!this.state.flip ? "./images/close.svg" : "./images/show.svg"} class="d-block mx-auto"/></div></div> 
                                    <div class="col">{this.props.name}</div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class={"section-body col" + (this.state.flip ? " reduce" : "")}>
                                <div class="row">
                                    {/* BACKLOG */}
                                    <div class={'column col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12 border-L border-r'} >
                                        <div class="row">
                                            <div class="column-name col">BACKLOG
                                            </div>
                                        </div>
                                        <div class="row h-100">
                                            <Lane items={this.state.ticketsBacklog} lane={0} 
                                                comp={this.props.id} push={this.pushTicket} sort={this.sortLane}
                                                remove={this.removeTicket} changeLaneF={this.changeTicketLaneForward} changeLaneB={this.changeTicketLaneBackward}
                                                shortName = {this.state.shortName}/>
                                        </div>
                                    </div>
                                    {/* IN PROGRESS */}
                                    <div class={'column col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12 border-r'} >
                                        <div class="row">
                                            <div class="column-name col">IN PROGRESS (WIP={this.state.wip})</div>
                                        </div>
                                        <div class="row h-100">
                                            <Lane items={this.state.ticketsProgress} lane={1} 
                                                comp={this.props.id} push={this.pushTicket} sort={this.sortLane}
                                                remove={this.removeTicket} changeLaneF={this.changeTicketLaneForward} changeLaneB={this.changeTicketLaneBackward}
                                                shortName = {this.state.shortName} wip={this.state.wip}/>
                                        </div>
                                    </div>

                                    {/* DONE */}
                                    <div class={'column col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12 border-r'} >
                                        <div class="row">
                                            <div class="column-name col">DONE
                                            </div>
                                        </div>
                                        <div class="row h-100">
                                            <Lane items={this.state.ticketsDone} lane={2} 
                                                comp={this.props.id} push={this.pushTicket} sort={this.sortLane}
                                                remove={this.removeTicket} changeLaneF={this.changeTicketLaneForward} changeLaneB={this.changeTicketLaneBackward}
                                                shortName = {this.state.shortName}/>
                                        </div>
                                    </div>
                                    {/* CLOSED */}

                                    <div class={'column col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12 border-R'} >
                                        <div class="row">
                                            <div class="column-name col">CLOSED
                                            </div>
                                        </div>
                                        <div class="row h-100">
                                            <Lane items={this.state.ticketsClosed} lane={3} 
                                                comp={this.props.id} push={this.pushTicket} sort={this.sortLane}
                                                remove={this.removeTicket} changeLaneF={this.changeTicketLaneForward} changeLaneB={this.changeTicketLaneBackward}
                                                shortName = {this.state.shortName}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : null
        );
    }
}

export default Component;