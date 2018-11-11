import React from 'react';
import Caret from './Caret';

class SelectItem extends React.Component{
    constructor(props){
        super(props);

        this.changeToComponent = this.changeToComponent.bind(this);
        this.changeToTicket = this.changeToTicket.bind(this);
        this.changeToProblemReport = this.changeToProblemReport.bind(this);
    }

     changeToTicket(type){
        this.props.changeType(1);
    }

    changeToComponent(type){
        this.props.changeType(2);
    }

    changeToProblemReport(type){
        this.props.changeType(3);
    }

    render(){
        return(
            <div class="btn-group w-100">
                <div type="button" class="btn dropdown-toggle w-100" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <div class="row">
                        <div class="col">
                            <span class="float-left">{this.props.type == 1 ? "Ticket": this.props.type == 2 ? "Component" : 
                        this.props.type == 3 ?"Problem report" : "Select"}</span></div>
                        <Caret/>
                    </div>
                </div>
                <div class="dropdown-menu w-100">
                    <a class="dropdown-item" href="#" onClick={this.changeToTicket}>Ticket</a>
                    <a class="dropdown-item" href="#" onClick={this.changeToComponent}>Component</a>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" href="#" onClick={this.changeToProblemReport}>Problem report</a>
                </div>
            </div>
        );
    }
}

export default SelectItem;