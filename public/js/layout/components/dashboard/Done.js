import React from 'react';
import Lane from './Lane';
import axios from 'axios';
import update from 'react-addons-update';

class Done extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            tickets: [],
            loading: true,
        }

        this.pushTicket = this.pushTicket.bind(this);
        this.removeTicket = this.removeTicket.bind(this);
    }

    pushTicket(ticket){
        this.setState({tickets: update(this.state.tickets, {$push: [ticket]})});
    }

    removeTicket(ticket){
        this.setState({tickets: update(this.state.tickets, {$splice: [[this.state.tickets.indexOf(ticket), 1]]})});
    }

    render(){
        return(
            <div class="column col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12" >
                <div class="row">
                    <div class="column-name col mt-1">DONE
                    </div>
                </div>
                <div class="row parent">
                    <Lane items={this.state.tickets} lane={2} push={this.pushTicket} remove={this.removeTicket}/>
                </div>
            </div>
        );
    }
}

export default Done;