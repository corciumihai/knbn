import React from 'react';
import DropdownSearch from './DropdownSearch';
import axios from 'axios';
import update from 'react-addons-update';
import Dating from './Dating';


class TicketSetup extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            users: [],
            components: [],
            names: [],
            tickets: [],
            disciplines: [],

            reporterName: '',
            reporterEmail: '',
            assigneeName: '',
            assigneeEmail: '',
            componentName: '',
            componentId: '',
            blockedTicketId: '',
            blockedTicketName: '',
            blockingTicketId: '',
            blockingTicketName: '',
            disciplineName: '',
            disciplineId: '',
            dueDate: new Date(),
            startDate: new Date(),
            ticketNumber: 0,
            estimation: 0,
            description: '',

            componentError: '',
            dateError: '',
            estimateError: '',
        }

        this.changeReporter = this.changeReporter.bind(this);
        this.changeAssignee = this.changeAssignee.bind(this);
        this.setComponent = this.setComponent.bind(this);
        this.setBlockedTicket = this.setBlockedTicket.bind(this);
        this.setBlockingTicket = this.setBlockingTicket.bind(this);
        this.setDiscipline = this.setDiscipline.bind(this);
        this.setDueDate = this.setDueDate.bind(this);
        this.setStartDate = this.setStartDate.bind(this);
        this.setEstimation = this.setEstimation.bind(this);
        this.setDescription = this.setDescription.bind(this);
        this.submit = this.submit.bind(this);
    }

    changeReporter(user){this.setState({reporterName: user.value, reporterEmail: user.key, reporterError: ''});}
    changeAssignee(user){this.setState({assigneeName: user.value, assigneeEmail: user.key, assigneeError: ''});}
    setComponent(component){this.setState({componentName: component.value, componentId: component.key, componentError: ''});}
    setBlockedTicket(ticket){this.setState({blockedTicketId: ticket.key, blockedTicketName: ticket.value});}
    setBlockingTicket(ticket){this.setState({blockingTicketId: ticket.key, blockingTicketName: ticket.value});}
    setDiscipline(discipline){this.setState({disciplineName: discipline.value, disciplineId: discipline.key});}
    setDueDate(date){this.setState({dueDate: date, dateError: ''});}
    setStartDate(date){this.setState({startDate: date, dateError: ''});}
    setDescription(event){this.setState({description: event.target.value});}

    setEstimation(event){
        let value = event.target.value;
        if(value.length > 0){
            if(isNaN(value)){this.setState({estimateError: 'What are you trying to input is not a number'}); return;}
        }
        this.setState({estimation: value, estimateError: ''});
    }

    componentDidMount(){
        axios.get('/users/get-users').then(response => {this.setState({users: response.data});});
        axios.get('/get-components').then(response => {this.setState({components: response.data});});
        axios.get('/get-tickets').then(response => {this.setState({tickets: response.data, ticketNumber: response.data.count + 1});});
        axios.get('/get-disciplines').then(response => {this.setState({disciplines: response.data});});
    }

    submit(event){
        event.preventDefault();
        if(this.props.name == undefined || this.props.name.length == 0){this.props.setError('Name is empty'); return;}
        if(this.state.componentId == undefined || this.state.componentId.length == 0){this.setState({componentError: 'Please select a component'}); return;}
        if(this.state.reporterEmail == undefined || this.state.reporterEmail.length == 0){this.setState({reporterError: 'Please select a reporter'}); return;}
        if(this.state.assigneeEmail == undefined || this.state.assigneeEmail.length == 0){this.setState({assigneeError: 'Please select an assignee'}); return;}
        if(this.state.startDate.getTime() > this.state.dueDate.getTime()){this.setState({dateError: 'Start date cannot be higher than due date'}); return;}

        axios.post('/add/ticket', {
            name: this.props.name,
            reporter: this.state.reporterEmail,
            assignee: this.state.assigneeEmail,
            dueDate: this.state.dueDate.getTime(),
            startDate: this.state.startDate.getTime(),
            component: this.state.componentId,
            blocked: this.state.blockedTicketId,
            blocking: this.state.blockingTicketId,
            discipline: this.state.disciplineId,
            description: this.state.description,
            estimation: this.state.estimation,
        }).then(response => {
            if(response.status == 200){
                this.setState({
                    reporterName: '',
                    reporterEmail: '',
                    assigneeName: '',
                    assigneeEmail: '',
                    componentName: '',
                    componentId: '',
                    blockedTicketId: '',
                    blockedTicketName: '',
                    blockingTicketId: '',
                    blockingTicketName: '',
                    disciplineName: '',
                    disciplineId: '',
                    dueDate: new Date(),
                    startDate: new Date(),
                    componentError: '',
                    dateError: '',
                    estimateError: '',
                    description: ''
                });
            }
        }).catch(error => {
            if(error.response == undefined){return;}
            this.props.setError(error.response.data.error);
        });
    }

    render(){
        return(
            <div class="ticket">
                <div class="row mb-2 pt-3 pb-3">
                    <div class="col-xl-2 info"><span>Belongs to component</span></div>
                    <div class="col-xl-6">
                        <div class="row">
                            <div class="col-xl-12">
                                <DropdownSearch list={this.state.components} item={{value: this.state.componentName, key: this.state.componentId}} onClick={this.setComponent} important={true} placeholder="Component name"/>
                            </div>
                        {
                            this.state.componentError != undefined && this.state.componentError.length > 0 ?
                                <div class="col-xl-12"><span class="error">{this.state.componentError}</span></div>
                                :   
                                null
                        }
                        </div>
                    </div>
                </div>

                <div class="row mb-2 pt-3 pb-3">
                    <div class="col-xl-2 info">Reporter</div>
                    <div class="col-xl-4 pb-xl-0 pb-2">
                        <div class="row">
                            <div class="col-xl-12">
                                <DropdownSearch list={this.state.users} item={{value: this.state.reporterName, key: this.state.reporterEmail}} onClick={this.changeReporter} important={true} placeholder="Reporter"/>
                            </div>
                        {
                            this.state.reporterError != undefined && this.state.reporterError.length > 0 ?
                                <div class="col-xl-12"><span class="error">{this.state.reporterError}</span></div>
                                :   
                                null
                        }
                        </div>
                    </div>
                    <div class="col-xl-2 info">Assignee</div>
                    <div class="col-xl-4">
                        <div class="row">
                            <div class="col-xl-12">
                                <DropdownSearch list={this.state.users} item={{value: this.state.assigneeName, key: this.state.assigneeEmail}} onClick={this.changeAssignee} important={true} placeholder="Assignee"/>
                            </div>
                        {
                            this.state.assigneeError != undefined && this.state.assigneeError.length > 0 ?
                                <div class="col-xl-12"><span class="error">{this.state.assigneeError}</span></div>
                                :   
                                null
                        }
                        </div>
                    </div>
                    <div class="col"><a class="assign-to mt-1 pb-1 pl-2 pr-2" href="#">Assign to me</a></div>
                </div>

                <div class="row mb-2 pt-3 pb-3">
                    <div class="col-xl-2 info">Description</div>
                    <div class="col">
                        <div class="form-group mb-0">
                            <textarea type="text" class="form-control" onChange={this.setDescription} value={this.state.description} placeholder="Description"/>
                        </div>
                    </div>
                </div>

                <div class="row mb-2 pt-3 pb-3">
                    <div class="col-xl-2 info">Blocks ticket</div>
                    <div class="col-xl-4 pb-xl-0 pb-2">
                        <DropdownSearch list={this.state.tickets} item={{value: this.state.blockedTicketName, key: this.state.blockedTicketId}} onClick={this.setBlockedTicket} placeholder="Blocked ticket"/>
                    </div>

                    <div class="col-xl-2 info">Blocked by ticket</div>
                    <div class="col-xl-4">
                        <DropdownSearch list={this.state.tickets} item={{value: this.state.blockingTicketName, key: this.state.blockingTicketId}} onClick={this.setBlockingTicket} placeholder="Blocking ticket"/>
                    </div>
                </div>

                <div class="row mb-2 pt-3 pb-3">
                    <div class="col-xl-2 info">Discipline</div>
                    <div class="col-xl-6">
                        <DropdownSearch list={this.state.disciplines} item={{value: this.state.disciplineName, key: this.state.disciplineId}} onClick={this.setDiscipline} placeholder="Discipline" />
                    </div>
                </div>

                <div class="row pb-3 pt-3 mb-2">
                    <div class="col-xl-2 info">Start date</div>
                    <div class="col-xl-10">
                        <div class="row">
                            <Dating setDate={this.setStartDate} date={this.state.startDate}/>
                            {
                                this.state.dateError != undefined && this.state.dateError.length > 0 ?
                                    <div class="col-xl-12"><span class="error">{this.state.dateError}</span></div>
                                    :   
                                    null
                            }
                        </div>
                    </div>
                </div>

                <div class="row pb-3 pt-3 mb-2">
                    <div class="col-xl-2 info">Due date</div>
                    <div class="col-xl-10">
                        <div class="row">
                            <Dating setDate={this.setDueDate} date={this.state.dueDate}/>
                        </div>
                    </div>
                </div>

                <div class="row mb-2 pt-3 pb-3">
                    <div class="col-xl-2 info">Effort estimation</div>
                    <div class="col-xl-6">
                        <div class="row">
                            <div class="col d-flex flex-row">
                                <input type="text" class="form-control col" onChange={this.setEstimation} value={this.state.estimation}/><div class="pl-1"><span class="info">hours</span></div>
                            </div>
                            {
                                this.state.estimateError != undefined && this.state.estimateError.length > 0 ?
                                    <div class="col-xl-12"><span class="error">{this.state.estimateError}</span></div>
                                    :   
                                    null
                            }
                        </div>
                    </div>
                </div>

                <div class="no-back row mb-2 pt-3 justify-content-center">
                    <div class="col-xl-12 d-flex justify-content-center">                       
                        <button class="submit btn" onClick={this.submit}>Submit</button> 
                    </div> 
                </div>
            </div>
        );
    }
}

export default TicketSetup;