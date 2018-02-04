import React from 'react';

class TicketId extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            ticketID: undefined, 
        }
    }

    generateTicketID(){
        //generate ticket id based on id of the project id/name
    }

    render(){
        return(
            <div class="form-group row">
                    <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 modal-label">
                        <span class="align-middle">Ticket ID</span>
                    </div>
                    <div class="col-xl-9 col-lg-9 col-md-9 col-sm-9 col-12">
                        <input type="text" class="form-control modal-input" placeholder="Enter card id" onChange={this.props.onChange}/>
                        <div class="col"><span class="small-muted">This value is generated using project name and current ticket number</span></div>
                    </div>
                    
                </div>
        );
    }
}

export default TicketId;