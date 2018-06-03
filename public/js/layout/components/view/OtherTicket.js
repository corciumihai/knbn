import React from 'react';
import axios from 'axios';

class OtherTicket extends React.Component{
    constructor(props){
        super(props);

        this.state = {tickets: []};
        this.setTicket = this.setTicket.bind(this);
    }

    componentWillMount(){
        axios.get('/get-tickets').then(response => { this.setState({tickets: response.data}); });
    }

    setTicket(ticket, event){
        event.preventDefault();
        this.props.set(ticket);
    }

    render(){
        console.log(this.props.ticket);
        let none = this.setTicket.bind(this, {key: 0, value: "None"});
        return(
            <div class="col ticket-data modifiable py-1">
                <div class="row" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    { this.props.ticket != undefined && this.props.ticket.value != undefined && this.props.ticket.value.length > 0 ? <div class="edit-field ml-1" title="Release"><img src="/images/ticketer.svg" class="d-block mx-auto"/></div> 
                    : <div class="edit-field ml-1" title="Release"><img src="/images/ticketer.svg" class="d-block mx-auto"/></div>}
                    <div class="col text-truncate"> { this.props.ticket != undefined && this.props.ticket.value != undefined && this.props.ticket.value.length > 0 ? this.props.ticket.value : "Select ticket" }</div>
                    <div class="edit-field mr-1 float-right"><img src="/images/arr-dwn.svg" class="d-block mx-auto"/></div>
                </div>
                <div class="dropdown-menu tag w-100 modifiable">
                    <a class="dropdown-item" key={"none"} href="#" onClick={none}>None</a>
                {
                    this.state.tickets.length > 0 ?
                        this.state.tickets.map(ticket => {
                            let bound = this.setTicket.bind(this, ticket);
                            return <a class="dropdown-item text-truncate" key={ticket.key} href="#" onClick={bound}>{ticket.value}</a>
                        })
                    :
                    "No tickets were found"
                }
                </div>
            </div>
        );
    }
}

export default OtherTicket;