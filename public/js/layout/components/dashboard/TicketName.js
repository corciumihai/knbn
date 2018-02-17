import React from 'react';

class TicketName extends React.Component{
    constructor(props){
        super(props);
        
    }

    render(){
        return(
            <div class="row">
                <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 modal-label">
                    <span class="align-middle">Ticket name</span>
                </div>
                <div class="form-group col">
                    <input type="text" class="form-control modal-input" placeholder="Enter card name" onBlur={this.props.onChange} defaultValue={this.props.value} />
                </div>
            </div>
        );
    }
}

export default TicketName;