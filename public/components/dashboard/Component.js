import React from 'react';
import Lane from './Lane';
import axios from 'axios';
import update from 'react-addons-update';
import ReactQuill from 'react-quill';

class Component extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            flip: false,
            ticketsBacklog: [],
            ticketsProgress: [],
            ticketsDone: [],
            ticketsClosed: [],
            wip: this.props.data.wip,
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
            // if(tickets.length > 1){tickets = sortTickets(tickets);}
            console.log(tickets);
            this.setState({
                ticketsBacklog: this.sortTickets(tickets.filter(item => (item.component == this.props.data.id && item.lane == 'backlog'))),
                ticketsProgress: this.sortTickets(tickets.filter(item => (item.component == this.props.data.id && item.lane == 'in_progress'))),
                ticketsDone: this.sortTickets(tickets.filter(item => (item.component == this.props.data.id && item.lane == 'done'))),
                ticketsClosed: this.sortTickets(tickets.filter(item => (item.component == this.props.data.id && item.lane == 'closed'))),
            }, () => {
                console.log(this.state);
            });
        });
    }

    toggle(){this.setState({flip: !this.state.flip});}
    toggleDesc(){this.setState({showDesc: !this.state.showDesc});}

    moveTicketForward(ticket, fromToolbar){
        if(fromToolbar){
            if(ticket.lane == 'backlog'){this.removeTicket(ticket, ticket.lane); ticket.lane = 'in_progress'; this.pushTicket(ticket);}
            else if(ticket.lane == 'in_progress'){this.removeTicket(ticket, ticket.lane); ticket.lane = 'done'; this.pushTicket(ticket);}
            else if(ticket.lane == 'done'){this.removeTicket(ticket, ticket.lane); ticket.lane = 'closed'; this.pushTicket(ticket);}
        }
        axios.post('/change-lane', {id: ticket.id, lane: ticket.lane});
    }

    moveTicketBackward(ticket){
        if(ticket.lane == 'in_progress'){this.removeTicket(ticket, ticket.lane); ticket.lane = 'backlog'; this.pushTicket(ticket);}
        else if(ticket.lane == 'done'){this.removeTicket(ticket, ticket.lane); ticket.lane = 'in_progress'; this.pushTicket(ticket);}
        axios.post('/change-lane', {id: ticket.id, lane: ticket.lane});
    }

    sortTickets(tickets){return tickets.sort((first, second) => { return first.id - second.id; });}

    pushTicket(ticket){
        console.log(ticket);
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
            <div class="section w-100 px-4 mt-2">
                <div class="row">
                    <div class="section-head col-xl-12 py-2">
                        <div class="row">
                            <div class="d-flex flex-row">
                                <div class="toggle d-flex mr-1" onClick={this.toggle} title='Collapse component'>
                                    <img src={!this.state.flip ? "./images/close.svg" : "./images/show.svg"} class="d-block mx-auto"/>
                                </div>
                                <div class="toggle d-flex" onClick={this.toggleDesc} title='Show description'>
                                    <img src="./images/descplus.svg" class="d-block mx-auto"/>
                                </div>
                            </div>
                            <div class="col">
                                <div class="row">
                                    <div class="col-12">
                                        <div class="row">
                                            <div class="col">{this.props.data.name}</div>
                                            <div class="knbn-days-left">2 days remaining</div>
                                        </div>
                                    </div>
                                    <div class={this.state.showDesc ? "comp-desc col-12" : "comp-desc col-12 hide"}>{this.props.data.description}</div>
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="knbn-comp-progress progress w-100 mb-1" title="Progress"> 
                        <div class="knbn-comp-progress-bar progress-bar" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style={{width: '33.90%'}}></div>
                    </div>
                </div>
                {this.state.ticketsBacklog.length > 0 || this.state.ticketsProgress.length > 0 || this.state.ticketsDone.length > 0 || this.state.ticketsClosed.length > 0 ?
                <div class="row">
                    <div class={!this.state.flip ? "section-body col" : "section-body col reduce"}>
                        <div class="row">
                            {/* BACKLOG */}
                            <div class={'column col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12 d-flex flex-column px-0'} >
                                <div class="column-name w-100">BACKLOG</div>
                                <Lane 
                                items={this.state.ticketsBacklog} 
                                lane={'backlog'} 
                                comp={this.props.data.id} 
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
                                comp={this.props.data.id} 
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
                                comp={this.props.data.id} 
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
                                comp={this.props.data.id} 
                                push={this.pushTicket} 
                                sort={this.sortLane}
                                remove={this.removeTicket} 
                                changeLaneF={this.moveTicketForward} 
                                changeLaneB={this.moveTicketBackward}/>
                            </div>
                        </div>
                    </div>
                </div>
                : null}
            </div>
        );
    }
}

export default Component;