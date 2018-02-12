import React from 'react';
import axios from 'axios';

class TicketId extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="row">
                <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 modal-label">
                    <span class="align-middle">Ticket ID</span>
                </div>
                {
                    <div class="form-group col">
                        {
                            this.props.isLoading ? 
                                <input type="text" class="form-control modal-input" readOnly value={"Loading ticket id..."}/>
                                :
                                <input type="text" class="form-control modal-input" readOnly value={this.props.id}/>
                        }
                        <div class="col"><span class="small-muted">Generated using last ticket number</span></div>
                    </div>
                }
            </div>
        );
    }
}

export default TicketId;