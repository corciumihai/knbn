import React from 'react';
import DropdownSearch from './DropdownSearch';
import axios from 'axios';
import update from 'react-addons-update';
import Dating from './Dating';
import Priority from './Priority';
import TextArea from './TextArea';
import Reporter from './Reporter';
import Assignee from './Assignee';

class ProblemReport extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            users: [],
            tickets: [],
            disciplines: [],

            reporterName: '',
            reporterEmail: '',
            assigneeName: '',
            assigneeEmail: '',
            componentName: '',
            priority: 3,
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
            testStep: '',
            expectedBehaviour: '',
            observedBehaviour: '',

            componentError: '',
            dateError: '',
            estimateError: '',
            reporterError: '',
            assigneeError: '',
            testStepError: '',
            observedBehaviourError: '',
            expectedBehaviourError: '',

            loadingUsers: true,
            loadingComponents: true,
            loadingDisciplines: true,
            loadingTickets: true,
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
        // this.fetchComponents = this.fetchComponents.bind(this);
        this.fetchDisciplines = this.fetchDisciplines.bind(this);
        this.fetchTickets = this.fetchTickets.bind(this);
        this.fetchUsers = this.fetchUsers.bind(this);
        this.setTestStep = this.setTestStep.bind(this);
        this.setPriority = this.setPriority.bind(this);
        this.resetState = this.resetState.bind(this);
        this.setExpectedBehaviour = this.setExpectedBehaviour.bind(this);
        this.setObservedBehaviour = this.setObservedBehaviour.bind(this);
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
    setTestStep(value){this.setState({testStep: value, testStepError: ''});}
    setPriority(prio){this.setState({priority: prio});}
    setExpectedBehaviour(value){this.setState({expectedBehaviour: value, expectedBehaviourError: ''});}
    setObservedBehaviour(value){this.setState({observedBehaviour: value, observedBehaviourError: ''});}

    fetchUsers(){if(this.state.users.length == 0){axios.get('/users/get-users').then(response => {this.setState({users: response.data, loadingUsers: false});});}}
    fetchTickets(){if(this.state.tickets.length == 0){axios.get('/get-tickets').then(response => {this.setState({tickets: response.data, ticketNumber: response.data.count + 1, loadingTickets: false});});}}
    fetchDisciplines(){if(this.state.disciplines.length == 0){axios.get('/get-disciplines').then(response => {this.setState({disciplines: response.data, loadingDisciplines: false});});}}

    resetState(){
        this.setState({
            reporterName: '',
            reporterEmail: '',
            assigneeName: '',
            assigneeEmail: '',
            componentName: '',
            priority: 3,
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
            testStep: '',
            expectedBehaviour: '',
            observedBehaviour: '',

            componentError: '',
            dateError: '',
            estimateError: '',
            reporterError: '',
            assigneeError: '',
            testStepError: '',
            observedBehaviourError: '',
            expectedBehaviourError: ''
        }, this.props.resetName);
    }

    setEstimation(event){
        let value = event.target.value;
        if(value.length > 0){
            if(isNaN(value)){this.setState({estimateError: 'What are you trying to input is not a number'}); return;}
        }
        this.setState({estimation: value, estimateError: ''});
    }

    submit(event){
        event.preventDefault();
        if(this.props.name == undefined || this.props.name.length == 0){this.props.setError('Name is empty'); return;}
        if(this.state.reporterEmail == undefined || this.state.reporterEmail.length == 0){this.setState({reporterError: 'Please select a reporter'}); return;}
        if(this.state.assigneeEmail == undefined || this.state.assigneeEmail.length == 0){this.setState({assigneeError: 'Please select an assignee'}); return;}
        if(this.state.testStep == undefined || this.state.testStep.length == 0){this.setState({testStepError: 'Empty testing steps! Please add at least one step'}); return;}
        if(this.state.expectedBehaviour == undefined || this.state.expectedBehaviour.length == 0){this.setState({expectedBehaviourError: 'Please fill the expected behaviour'}); return;}
        if(this.state.observedBehaviour == undefined || this.state.observedBehaviour.length == 0){this.setState({observedBehaviourError: 'Please fill the observed behaviour'}); return;}
        if(this.state.startDate.getTime() > this.state.dueDate.getTime()){this.setState({dateError: 'Start date cannot be higher than due date'}); return;}

        axios.post('/add/report', {
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
            steps: this.state.testStep,
            observedBehaviour: this.state.observedBehaviour,
            expectedBehaviour: this.state.expectedBehaviour,
            priority: this.state.priority
        }).then(response => {
            if(response.status == 200){this.resetState()}
        }).catch(error => {
            if(error.response == undefined){return;}
            this.props.setError(error.response.data.error);
        });
    }

    render(){
        return(
            <div class="ticket">
                <div class="row mb-2 pt-3 pb-3">
                    <div class="col-xl-6 my-2">
                        <div class="row">
                            <div class="col-xl-5 pr-0 info mb-xl-0 mb-2">
                                <div class="row d-flex h-100">
                                    <div class="warning ml-3 align-self-center" title="This is a mandatory field"><img src="./images/warning.svg" class="d-block mx-auto"/></div>
                                    <div class="col d-flex"><span class="align-self-center">Reporter</span></div>
                                </div>
                            </div>
                            <div class="col-xl-7 pb-xl-0 pb-2">
                                <Reporter users={this.state.users} name={this.state.reporterName} id={this.state.reporterEmail} fetch={this.fetchUsers} set={this.changeReporter}
                                    loading={this.state.loadingUsers} error={this.state.reporterError}/>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-6 my-2">
                        <div class="row">
                            <div class="col-xl-5 pr-0 info mb-xl-0 mb-2">
                                <div class="row d-flex h-100">
                                    <div class="warning ml-3 align-self-center" title="This is a mandatory field"><img src="./images/warning.svg" class="d-block mx-auto"/></div>
                                    <div class="col d-flex"><span class="align-self-center">Assignee</span></div>
                                </div>
                            </div>
                            <div class="col-xl-7 pb-xl-0 pb-2">
                                <Assignee users={this.state.users} name={this.state.assigneeName} id={this.state.assigneeEmail} fetch={this.fetchUsers} set={this.changeAssignee}
                                    loading={this.state.loadingUsers} error={this.state.assigneeError}/>
                            </div>
                        </div>
                        <div class="row"><div class="col"><a class="assign-to mt-1 pb-1 pl-2 pr-2" href="#">Assign to me</a></div></div>
                    </div>
                </div> 

                <Priority set={this.setPriority} item={this.state.priority}/>

                <div class="row mb-2 pt-3 pb-3">
                    <div class="col-xl-3 pr-0 info mb-xl-0 mb-2">
                        <span class="align-self-center">Testing steps</span>
                    </div>
                    <TextArea set={this.setTestStep} value={this.state.testStep} placeholder={"Test step"} error={this.state.testStepError}/>
                </div>
                <div class="row mb-2 pt-3 pb-3">
                    <div class="col-xl-3 pr-0 info mb-xl-0 mb-2">
                        <span class="align-self-center">Expected behaviour</span>
                    </div>
                    <TextArea set={this.setExpectedBehaviour} value={this.state.expectedBehaviour} placeholder={"Expected behaviour"} error={this.state.expectedBehaviourError}/>
                </div>
                <div class="row mb-2 pt-3 pb-3">
                    <div class="col-xl-3 pr-0 info mb-xl-0 mb-2">
                        <span class="align-self-center">Observed behaviour</span>
                    </div>
                    <TextArea set={this.setObservedBehaviour} value={this.state.observedBehaviour} placeholder={"Observed behaviour"} error={this.state.observedBehaviourError}/>
                </div>

                <div class="row mb-2 pt-3 pb-3">
                    <div class="col-xl-3 pr-0 info mb-xl-0 mb-2">
                        <div class="row d-flex h-100">
                            <div class="col d-flex"><span class="align-self-center">Blocks ticket</span></div>
                        </div>
                    </div>
                    <div class="col-xl-3 pb-xl-0 pb-2">
                        <DropdownSearch list={this.state.tickets} item={{value: this.state.blockedTicketName, key: this.state.blockedTicketId}} 
                            fetch={this.fetchTickets} onClick={this.setBlockedTicket} reset={this.resetTickets} placeholder="Blocked ticket"/>
                    </div>

                    <div class="col-xl-3 pr-0 info mb-xl-0 mb-2">
                        <div class="row d-flex h-100">
                            <div class="col d-flex"><span class="align-self-center">Blocked ticket</span></div>
                        </div>
                    </div>
                    <div class="col-xl-3">
                        <DropdownSearch list={this.state.tickets} item={{value: this.state.blockingTicketName, key: this.state.blockingTicketId}} 
                            fetch={this.fetchTickets} onClick={this.setBlockingTicket} reset={this.resetTickets} placeholder="Blocking ticket"/>
                    </div>
                </div>

                <div class="row mb-2 pt-3 pb-3">
                    <div class="col-xl-3 pr-0 info mb-xl-0 mb-2">
                        <div class="row d-flex h-100">
                            <div class="warning ml-3 align-self-center" title="This is a mandatory field"><img src="./images/warning.svg" class="d-block mx-auto"/></div>
                            <div class="col d-flex"><span class="align-self-center">Discipline</span></div>
                        </div>
                    </div>
                    <div class="col-xl-6">
                        <DropdownSearch list={this.state.disciplines} item={{value: this.state.disciplineName, key: this.state.disciplineId}} 
                            fetch={this.fetchDisciplines} onClick={this.setDiscipline} reset={this.resetDisciplines} placeholder="Discipline" />
                    </div>
                </div>

                <div class="row pb-3 pt-3 mb-2">
                    <div class="col-xl-3 pr-0 info mb-xl-0 mb-2">
                        <div class="row d-flex h-100">
                            <div class="warning ml-3 align-self-center" title="This is a mandatory field"><img src="./images/warning.svg" class="d-block mx-auto"/></div>
                            <div class="col d-flex"><span class="align-self-center">Start date</span></div>
                        </div>
                    </div>
                    <div class="col-xl-9">
                        <div class="row">
                            <div class="col">
                                <Dating setDate={this.setStartDate} date={this.state.startDate}/>
                            </div>
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
                    <div class="col-xl-3 pr-0 info mb-xl-0 mb-2">
                        <div class="row d-flex h-100">
                            <div class="warning ml-3 align-self-center" title="This is a mandatory field"><img src="./images/warning.svg" class="d-block mx-auto"/></div>
                            <div class="col d-flex"><span class="align-self-center">Due date</span></div>
                        </div>
                    </div>
                    <div class="col-xl-9">
                        <div class="row">
                            <div class="col">
                                <Dating setDate={this.setDueDate} date={this.state.dueDate}/>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row mb-2 pt-3 pb-3">
                    <div class="col-xl-3 pr-0 info mb-xl-0 mb-2">
                        <div class="row d-flex h-100">
                            <div class="col d-flex"><span class="align-self-center">Estimation</span></div>
                        </div>
                    </div>
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

export default ProblemReport;