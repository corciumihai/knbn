import React from 'react';
import Caret from './Caret';

class SelectItem extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            toggle: false,
        }

        this.changeToTask = this.changeToTask.bind(this);
        this.changeToComponent = this.changeToComponent.bind(this);
        this.changeToTicket = this.changeToTicket.bind(this);
        this.toggle = this.toggle.bind(this);
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
    
    toggle(){
        console.log('click');
        this.setState({toggle: !this.state.toggle}, () => {
            console.log(this.state.toggle);
        });
    }

    render(){
        return(
            <div class="btn-group w-100" onClick={this.toggle} onBlur={this.toggle}>
                <div type="button" class="btn dropdown-toggle w-100" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <div class="row">
                        <div class="col"><span class="float-left">{this.props.type == 0 ? "Item" : this.props.type == 1 ? "Task": this.props.type == 2 ? "Ticket" : "Component"}</span></div>
                        <Caret toggle={this.state.toggle}/>
                    </div>
                </div>
                <div class="dropdown-menu w-100">
                    <a class="dropdown-item" href="#" onClick={this.changeToTask}>Task</a>
                    <a class="dropdown-item" href="#" onClick={this.changeToTicket}>Ticket</a>
                    <a class="dropdown-item" href="#" onClick={this.changeToComponent}>Component</a>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" href="#" onClick={this.changeToTicket}>Problem report</a>
                </div>
            </div>
        );
    }
}

export default SelectItem;