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
            showDesc: false,
        }

        this.toggle = this.toggle.bind(this);
        this.moveTicketForward = this.moveTicketForward.bind(this);
        this.moveTicketBackward = this.moveTicketBackward.bind(this);
        this.pushTicket = this.pushTicket.bind(this);
        this.removeTicket = this.removeTicket.bind(this);
        this.toggleDesc = this.toggleDesc.bind(this);
    }

    componentDidMount(){
        axios.get('/get-tickets').then(response => {
            let tickets = response.data.tickets;
            if(tickets.length > 1){tickets = sortTickets(tickets);}
            console.log(tickets);
            this.setState( {
                ticketsBacklog: this.sortTickets(tickets.filter(item => (item.component == this.props.id && item.lane == 'backlog'))),
                ticketsProgress: this.sortTickets(tickets.filter(item => (item.component == this.props.id && item.lane == 'in_progress'))),
                ticketsDone: this.sortTickets(tickets.filter(item => (item.component == this.props.id && item.lane == 'done'))),
                ticketsClosed: this.sortTickets(tickets.filter(item => (item.component == this.props.id && item.lane == 'closed'))),
            });
        });
    }

    toggle(){this.setState({flip: !this.state.flip});}
    toggleDesc(){this.setState({showDesc: !this.state.showDesc});}

    moveTicketForward(ticket, fromToolbar){
        if(fromToolbar){
            this.removeTicket(ticket, ticket.lane);
            if(ticket.lane == 'backlog'){ticket.lane = 'in_progress';}
            else if(ticket.lane == 'in_progress'){ticket.lane = 'done';}
            else if(ticket.lane == 'done'){ticket.lane = 'closed';}
            this.pushTicket(ticket);
        }
        axios.post('/change-lane', {id: ticket.id, lane: ticket.lane});
    }

    moveTicketBackward(ticket){
        this.removeTicket(ticket, ticket.lane);

        if(ticket.lane == 'in_progress'){ticket.lane = 'backlog';}
        else if(ticket.lane == 'done'){ticket.lane = 'in_progress';}
        this.pushTicket(ticket);
        axios.post('/change-lane', {id: ticket.id, lane: ticket.lane});
    }

    sortTickets(tickets){return tickets.sort((first, second) => { return first.id - second.id; });}

    pushTicket(ticket){
        if(ticket.lane == 'backlog'){
            this.setState({ticketsBacklog: update(this.state.ticketsBacklog, {$push: [ticket]})});
        }
        else if(ticket.lane == 'in_progress'){
            this.setState({ticketsProgress: update(this.state.ticketsProgress, {$push: [ticket]})});
        }
        else if (ticket.lane == 'done'){
            this.setState({ticketsDone: update(this.state.ticketsDone, {$push: [ticket]})});
        }
        else if(ticket.lane == 'closed'){
            this.setState({ticketsClosed: update(this.state.ticketsClosed, {$push: [ticket]})});
        }
    }

    removeTicket(ticket, lane){
        if(lane == 'backlog'){
            this.setState({ticketsBacklog: update(this.state.ticketsBacklog, {$splice: [[this.state.ticketsBacklog.indexOf(ticket), 1]]})});
        }
        else if(lane == 'in_progress'){
            this.setState({ticketsProgress: update(this.state.ticketsProgress, {$splice: [[this.state.ticketsProgress.indexOf(ticket), 1]]})});
        }
        else if (lane == 'done'){
            this.setState({ticketsDone: update(this.state.ticketsDone, {$splice: [[this.state.ticketsDone.indexOf(ticket), 1]]})});
        }
        else if(lane == 'closed'){
            this.setState({ticketsClosed: update(this.state.ticketsClosed, {$splice: [[this.state.ticketsClosed.indexOf(ticket), 1]]})});
        }
    }

    render(){
        return(
            this.state.ticketsBacklog.length > 0 || this.state.ticketsProgress.length > 0 || this.state.ticketsDone.length > 0 || this.state.ticketsClosed.length > 0 ?
                <div class="section col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mt-2">
                    <div class="row">
                        <div class="section-head col-xl-12 py-2">
                            <div class="col d-flex flex-row">
                                <div class="d-flex flex-row">
                                    <div class="toggle d-flex mr-1" onClick={this.toggle} title='Collapse component'>
                                        <img src={!this.state.flip ? "./images/close.svg" : "./images/show.svg"} class="d-block mx-auto"/>
                                    </div>
                                    <div class="toggle d-flex" onClick={this.toggleDesc} title='Show description'>
                                        <img src="./images/descplus.svg" class="d-block mx-auto"/>
                                    </div>
                                </div>
                                <div>
                                    <div class="col">{this.props.name}</div>
                                    <div class={this.state.showDesc ? "comp-desc col-12 d-flex flex-row" : "comp-desc col-12 d-flex flex-row hide"}>
                                        <div>Description:</div>
                                        <div class="col">{this.props.description}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class={!this.state.flip ? "section-body col" : "section-body col reduce"}>
                            <div class="row">
                                {/* BACKLOG */}
                                <div class={'column col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12 d-flex flex-column px-0'} >
                                    <div class="column-name w-100">BACKLOG</div>
                                    <Lane 
                                    items={this.state.ticketsBacklog} 
                                    lane={'backlog'} 
                                    comp={this.props.id} 
                                    push={this.pushTicket} 
                                    sort={this.sortLane}
                                    remove={this.removeTicket} 
                                    changeLaneF={this.moveTicketForward} 
                                    changeLaneB={this.moveTicketBackward}/>
                                </div>
                                {/* IN PROGRESS */}
                                <div class={'column col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12 d-flex flex-column px-0'} >
                                    <div class="column-name w-100">IN PROGRESS (Limit - {this.state.wip})</div>
                                    <Lane 
                                    items={this.state.ticketsProgress} 
                                    lane={'in_progress'} 
                                    comp={this.props.id} 
                                    push={this.pushTicket} 
                                    sort={this.sortLane}
                                    remove={this.removeTicket} 
                                    changeLaneF={this.moveTicketForward} 
                                    changeLaneB={this.moveTicketBackward}
                                    wip={this.state.wip}/>
                                </div>

                                {/* DONE */}
                                <div class={'column col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12 d-flex flex-column px-0'} >
                                    <div class="column-name w-100">DONE</div>
                                    <Lane 
                                    items={this.state.ticketsDone} 
                                    lane={'done'} 
                                    comp={this.props.id} 
                                    push={this.pushTicket} 
                                    sort={this.sortLane}
                                    remove={this.removeTicket} 
                                    changeLaneF={this.moveTicketForward} 
                                    changeLaneB={this.moveTicketBackward}/>
                                </div>
                                {/* CLOSED */}
                                <div class={'column col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12 d-flex flex-column px-0'} >
                                    <div class="column-name w-100">CLOSED</div>
                                    <Lane 
                                    items={this.state.ticketsClosed} 
                                    lane={'closed'} 
                                    comp={this.props.id} 
                                    push={this.pushTicket} 
                                    sort={this.sortLane}
                                    remove={this.removeTicket} 
                                    changeLaneF={this.moveTicketForward} 
                                    changeLaneB={this.moveTicketBackward}/>
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