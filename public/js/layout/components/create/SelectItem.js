import React from 'react';
import Caret from './Caret';

class SelectItem extends React.Component{
    constructor(props){
        super(props);

        this.changeToTask = this.changeToTask.bind(this);
        this.changeToComponent = this.changeToComponent.bind(this);
        this.changeToTicket = this.changeToTicket.bind(this);
        this.changeToProblemReport = this.changeToProblemReport.bind(this);
    }

    changeToTask(type){
       this.props.changeType(1);
    }

     changeToTicket(type){
        this.props.changeType(2);
    }

    changeToComponent(type){
        this.props.changeType(3);
    }

    changeToProblemReport(type){
        this.props.changeType(4);
    }

    render(){
        return(
            <div class="btn-group w-100">
                <div type="button" class="btn dropdown-toggle w-100" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <div class="row">
                        <div class="col">
                            <img src={"./images/" + (this.props.type == 1 ? "task.svg" : this.props.type == 2 ? "ticket.svg" : this.props.type == 3 ? "component.svg" : "report.svg")} 
                                class="mx-auto d-block float-left ml-1"/>
                            <span class="float-left">{this.props.type == 1 ? "Task": this.props.type == 2 ? "Ticket" : 
                        this.props.type == 3 ? "Component" : "Problem report"}</span></div>
                        <Caret/>
                    </div>
                </div>
                <div class="dropdown-menu w-100">
                    <a class="dropdown-item" href="#" onClick={this.changeToTask}><img src="./images/task.svg" class="mx-auto d-block float-left ml-1"/>Task</a>
                    <a class="dropdown-item" href="#" onClick={this.changeToTicket}><img src="./images/ticket.svg" class="mx-auto d-block float-left ml-1"/>Ticket</a>
                    <a class="dropdown-item" href="#" onClick={this.changeToComponent}><img src="./images/component.svg" class="mx-auto d-block float-left ml-1"/>Component</a>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" href="#" onClick={this.changeToProblemReport}><img src="./images/report.svg" class="mx-auto d-block float-left ml-1"/>Problem report</a>
                </div>
            </div>
        );
    }
}

export default SelectItem;