import React from 'react';
import DropdownSearch from './DropdownSearch';
import axios from 'axios';
import update from 'react-addons-update';
import Dating from './Dating';
import Priority from './Priority';
import TextArea from './TextArea';
import Users from './Users';
import User from './User';

class ProblemReport extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            users: [],
            components: [],
            names: [],
            tickets: [],
            disciplines: [],
            testSteps: [],

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
        this.fetchComponents = this.fetchComponents.bind(this);
        this.fetchDisciplines = this.fetchDisciplines.bind(this);
        this.fetchTickets = this.fetchTickets.bind(this);
        this.fetchUsers = this.fetchUsers.bind(this);
        this.resetComponents = this.resetComponents.bind(this);
        this.resetDisciplines = this.resetDisciplines.bind(this);
        this.resetTickets = this.resetTickets.bind(this);
        this.resetUsers = this.resetUsers.bind(this);
        this.setTestStep = this.setTestStep.bind(this);
        this.setPriority = this.setPriority.bind(this);
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

    fetchUsers(){axios.get('/users/get-users').then(response => {this.setState({users: response.data, loadingUsers: false});});}
    fetchComponents(){axios.get('/get-components').then(response => {this.setState({components: response.data, loadingComponents: false});});}
    fetchTickets(){axios.get('/get-tickets').then(response => {this.setState({tickets: response.data, ticketNumber: response.data.count + 1, loadingTickets: false});});}
    fetchDisciplines(){axios.get('/get-disciplines').then(response => {this.setState({disciplines: response.data, loadingDisciplines: false});});}

    resetUsers(){this.setState({users: [], loadingUsers: true}, () => {console.log('reset')});}
    resetComponents(){this.setState({components: [], loadingComponents: true});}
    resetTickets(){this.setState({tickets: [], ticketNumber: 0, loadingTickets: true});}
    resetDisciplines(){this.setState({disciplines: [], loadingDisciplines: true});}

    resetState(){
        this.props.resetName();
        this.setState({users: [],
            components: [],
            names: [],
            tickets: [],
            disciplines: [],
            testSteps: [],

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

            loadingUsers: true,
            loadingComponents: true,
            loadingDisciplines: true,
            loadingTickets: true,
        });
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
                {/* <div class="row mb-2 pt-3 pb-3">
                    <div class="col-xl-3 pr-0 info mb-xl-0 mb-2">
                        <div class="row d-flex h-100">
                            <div class="warning ml-3 align-self-center" title="This is a mandatory field"><img src="./images/warning.svg" class="d-block mx-auto"/></div>
                            <div class="col d-flex"><span class="align-self-center">Belongs to component</span></div>
                        </div>
                    </div>
                    <div class="col-xl-6">
                        <div class="row">
                            <div class="col-xl-12">
                                <DropdownSearch list={this.state.components} item={{value: this.state.componentName, key: this.state.componentId}} 
                                    fetch={this.fetchComponents} onClick={this.setComponent} loading={this.state.loadingComponents} reset={this.resetComponents} placeholder="Component name"/>
                            </div>
                        {
                            this.state.componentError != undefined && this.state.componentError.length > 0 ?
                                <div class="col-xl-12"><span class="error">{this.state.componentError}</span></div>
                                :   
                                null
                        }
                        </div>
                    </div>
                </div> */}

                <Users fetch={this.fetchUsers} users={this.state.users}>
                    <User users={this.state.users} name={this.state.reporterName} id={this.state.reporterEmail} fetch={this.fetchUsers} set={this.changeReporter}
                        loading={this.state.loadingUsers} error={this.state.reporterError} title="Reporter" key={1}/>

                    <User users={this.state.users} name={this.state.assigneeName} id={this.state.assigneeEmail} fetch={this.fetchUsers} set={this.changeAssignee}
                        loading={this.state.loadingUsers} error={this.state.assigneeError} title="Assignee" key={2}/>
                </Users>

                <Priority set={this.setPriority} item={this.state.priority}/>

                <TextArea set={this.setTestStep} value={this.state.testStep} placeholder={"Test step"} title={"Testing steps"} mandatory={true} error={this.state.testStepError}/>
                <TextArea set={this.setExpectedBehaviour} value={this.state.expectedBehaviour} placeholder={"Expected behaviour"} title={"Expected behaviour"} mandatory={true} error={this.state.expectedBehaviourError}/>
                <TextArea set={this.setObservedBehaviour} value={this.state.observedBehaviour} placeholder={"Observed behaviour"} title={"Observed behaviour"} mandatory={true} error={this.state.observedBehaviourError}/>

                {/* <div class="row mb-2 pt-3 pb-3">
                    <div class="col-xl-3 pr-0 info mb-xl-0 mb-2">
                        <div class="row d-flex h-100">
                            <div class="warning ml-3 align-self-center" title="This is a mandatory field"><img src="./images/warning.svg" class="d-block mx-auto"/></div>
                            <div class="col d-flex"><span class="align-self-center">Description</span></div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group mb-0">
                            <textarea type="text" class="form-control" onChange={this.setDescription} value={this.state.description} placeholder="Description"/>
                        </div>
                    </div>
                </div> */}

                <div class="row mb-2 pt-3 pb-3">
                    <div class="col-xl-3 pr-0 info mb-xl-0 mb-2">
                        <div class="row d-flex h-100">
                            {/* <div class="warning ml-3 align-self-center" title="This is a mandatory field"><img src="./images/warning.svg" class="d-block mx-auto"/></div> */}
                            <div class="col d-flex"><span class="align-self-center">Blocks ticket</span></div>
                        </div>
                    </div>
                    <div class="col-xl-3 pb-xl-0 pb-2">
                        <DropdownSearch list={this.state.tickets} item={{value: this.state.blockedTicketName, key: this.state.blockedTicketId}} 
                            fetch={this.fetchTickets} onClick={this.setBlockedTicket} reset={this.resetTickets} placeholder="Blocked ticket"/>
                    </div>

                    <div class="col-xl-3 pr-0 info mb-xl-0 mb-2">
                        <div class="row d-flex h-100">
                            {/* <div class="warning ml-3 align-self-center" title="This is a mandatory field"><img src="./images/warning.svg" class="d-block mx-auto"/></div> */}
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
                            {/* <div class="warning ml-3 align-self-center" title="This is a mandatory field"><img src="./images/warning.svg" class="d-block mx-auto"/></div> */}
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