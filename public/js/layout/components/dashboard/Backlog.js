import React from 'react';
import Lane from './Lane';
import axios from 'axios';
import update from 'react-addons-update';

class Backlog extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            tickets: [],
            loading: true,
        }

        this.pushTicket = this.pushTicket.bind(this);
        this.removeTicket = this.removeTicket.bind(this);
    }

    // fetch tickets that belong on the backlog
    componentWillMount(){
        axios.get('/get-tickets-dash').then(response => {
            this.setState( {tickets: response.data, loading: false} );});
    }

    pushTicket(ticket){
        this.setState({tickets: update(this.state.tickets, {$push: [ticket]})});
    }

    removeTicket(ticket){
        this.setState({tickets: update(this.state.tickets, {$splice: [[this.state.tickets.indexOf(ticket), 1]]})});
    }

    render(){
        return(
            <div class="column border-r col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12" >
                <div class="row">
                    <div class="column-name col">BACKLOG
                    </div>
                </div>
                <div class="row d-flex h-100">
                    <Lane items={this.state.tickets} lane={0} push={this.pushTicket} remove={this.removeTicket}/>
                </div>
            </div>
        );
    }
}

export default Backlog;