import React from 'react';
import DropdownSearch from './DropdownSearch';
import axios from 'axios';
import update from 'react-addons-update';


class TicketSetup extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            users: [],
            components: [],
            names: [],
            tickets: [],


            reporter: {value: '', key: ''},
            assignee: {value: '', key: ''},
            component: {value: '', key: ''},
        }

        this.changeReporter = this.changeReporter.bind(this);
        this.changeAssignee = this.changeAssignee.bind(this);
        this.changeComponent = this.changeComponent.bind(this);
    }

    changeReporter(user){
        this.setState({reporter: user});
    }

    changeAssignee(user){
        this.setState({assignee: user});
    }

    changeComponent(){
        console.log('component changed');
    }


    componentDidMount(){
        let index = 0;
        axios.get('/users/get-users').then(response => {
            this.setState({
                users: response.data,
            }, () => {
                let names = [];
                this.state.users.forEach(element => {names.push({value: element.name, key: element.email});});
                this.setState({names: names});
            });
        });
    }

    render(){
        return(
            <div class="ticket">
                <div class="row mb-2">
                    <div class="col-xl-2 info">Belongs to</div>
                    <div class="col mb-3">
                        <DropdownSearch list={this.state.components} item={this.state.component} change={this.changeComponent} placeholder="Component name"/>
                    </div>
                </div>

                <div class="row mb-2">
                    <div class="col-xl-2 info">Reporter</div>
                    <div class="col-xl-4">
                        <DropdownSearch list={this.state.names} item={this.state.reporter} change={this.changeReporter} placeholder="Reporter"/>
                    </div>
                    <div class="col-xl-2 info">Assignee</div>
                    <div class="col-xl-4">
                        <DropdownSearch list={this.state.names} item={this.state.assignee} change={this.changeAssignee} placeholder="Assignee" size={"col-xl-4"}/>
                    </div>
                    <div class="col mb-2 assign-to"><a href="#">Assign to me</a></div>
                </div>

                <div class="row mb-2">
                    <div class="col-xl-2 info">Labels</div>
                    <div class="col">
                        <div class="form-group">
                            <input type="text" class="form-control" placeholder="Label name"/>
                        </div>
                    </div>
                </div>

                <div class="row mb-2">
                    <div class="col-xl-2 info">Description</div>
                    <div class="col">
                        <div class="form-group">
                            <textarea type="text" class="form-control" placeholder="Description"/>
                        </div>
                    </div>
                </div>

                <div class="row mb-2">
                    <div class="col-xl-2 info">Blocks</div>
                    <div class="col-xl-4 mb-3">
                        {/* <DropdownSearch list={this.state.names} placeholder="Blocked ticket" size={"col-xl-4"}/> */}
                    </div>

                    <div class="col-xl-2 info">Blocked by</div>
                    <div class="col-xl-4 mb-3">
                        {/* <DropdownSearch list={this.state.names} placeholder="Blocking ticket" size={"col-xl-4"}/> */}
                    </div>
                </div>
            </div>
        );
    }
}

export default TicketSetup;