import React from 'react';
import Lane from './Lane';
import axios from 'axios';
import update from 'react-addons-update';

class Column extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            tickets: [],
            users: [],
            loading: true,
        }

        this.pushTicket = this.pushTicket.bind(this);
        this.removeTicket = this.removeTicket.bind(this);
        this.sortTickets = this.sortTickets.bind(this);
    }

    // fetch tickets that belong on the backlog
    componentWillMount(){
        // console.log(this.props.lane)
        axios.get('/get-tickets-dash', {params: {lane: this.props.lane, component: this.props.compId}}).then(response => {
            // tickets = response.data;
            this.setState( {tickets: response.data, loading: false});
            
        });
    }

    sortTickets(){
        this.setState({tickets: update(this.state.tickets, {$set: this.state.tickets.sort((first, second) => { return first.id - second.id; })})});
    }

    pushTicket(ticket){
        this.setState({tickets: update(this.state.tickets, {$push: [ticket]})});
    }

    removeTicket(ticket){
        this.setState({tickets: update(this.state.tickets, {$splice: [[this.state.tickets.indexOf(ticket), 1]]})});
    }

    render(){
        return(
            <div class={'column col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12 '  + (this.props.lane > 0 && this.props.lane < 3 ? 'border-r': this.props.lane == 0 ? 'border-L border-r' : 'border-R')} >
                <div class="row">
                    <div class="column-name col">{this.props.name}
                    </div>
                </div>
                <div class="row">
                    <Lane items={this.state.tickets} lane={this.props.lane} comp={this.props.compId} push={this.pushTicket} remove={this.removeTicket} sort={this.sortTickets}/>
                </div>
            </div>
        );
    }
}

export default Column;