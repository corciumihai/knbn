import React from 'react';
import axios from 'axios';
import update from 'react-addons-update';
import Dating from './Dating';
import TextArea from './TextArea';
import DropdownSearch from './DropdownSearch';
import Reporter from './Reporter';
import Assignee from './Assignee';
import ReactDom from 'react-dom';
import crypto from 'crypto';
import { throws } from 'assert';
import dateformat from 'dateformat';

class TicketSetup extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            users: [],
            components: [],
            names: [],
            tickets: [],
            releases: [],
            filteredUsers: [],
            searchName: '',
            filteredComponents: [],
            searchCompName: '',
            searchedTicketName: '',
            reporter: {},
            assignee: {},
            component: {},
            blockedTicket: {},
            blockingTicket: {},
            category: {},
            categories: [],
            searchedCategory: '',
            filteredCategories: [],
            dueDate: new Date(),
            startDate: new Date(),
            ticketNumber: 0,
            estimation: 0,
            description: '',
            priority: "low",
            release: {},
            filteredReleases: [],
            searchedRelease: '',
            
            componentError: '',
            dateError: '',
            estimateError: '',
            releaseError: '',

            loadingUsers: true,
            loadingComponents: true,
            loadingDisciplines: true,
            loadingTickets: true,
        }

        this.setReporter = this.setReporter.bind(this);
        this.setAssignee = this.setAssignee.bind(this);
        this.setComponent = this.setComponent.bind(this);
        this.setBlockedTicket = this.setBlockedTicket.bind(this);
        this.setBlockingTicket = this.setBlockingTicket.bind(this);
        this.setCategory = this.setCategory.bind(this);
        this.setDueDate = this.setDueDate.bind(this);
        this.setStartDate = this.setStartDate.bind(this);
        this.setEstimation = this.setEstimation.bind(this);
        this.setDescription = this.setDescription.bind(this);
        this.fetchComponents = this.fetchComponents.bind(this);
        this.fetchCategories = this.fetchCategories.bind(this);
        this.fetchTickets = this.fetchTickets.bind(this);
        this.setPriority = this.setPriority.bind(this);
        this.submit = this.submit.bind(this);
        this.setRelease = this.setRelease.bind(this);
        this.fetchReleases = this.fetchReleases.bind(this);
        this.fetchUsers = this.fetchUsers.bind(this);
        this.selfAssignReporter = this.selfAssignReporter.bind(this);
        this.selfAssignAssignee = this.selfAssignAssignee.bind(this);
        this.search = this.search.bind(this);
        this.searchCompName = this.searchCompName.bind(this);
        this.searchTicketName = this.searchTicketName.bind(this);
        this.searchCategory = this.searchCategory.bind(this);
        this.decreaseMonth = this.decreaseMonth.bind(this);
        this.increaseMonth = this.increaseMonth.bind(this);
        this.changeDueDate = this.changeDueDate.bind(this);
        this.translateDay = this.translateDay.bind(this);
        this.searchRelease = this.searchRelease.bind(this);
    }

    searchRelease(event){
        if(event.target.value.length > 0){
            this.setState({filteredReleases: this.state.releases.filter(release => {return String(release.name).toLowerCase().includes(String(event.target.value).toLowerCase())}), searchedRelease: event.target.value});
        }
        else{
            this.setState({filteredReleases: this.state.releases, searchedRelease: event.target.value});
        }
           
    }

    searchCategory(event){
        if(event.target.value.length > 0){
            this.setState({filteredCategories: this.state.categories.filter(category => {return String(category.name).toLowerCase().includes(String(event.target.value).toLowerCase())}), searchedCategory: event.target.value});
        }
        else{
            this.setState({filteredCategories: this.state.tickets, searchedCategory: event.target.value});
        }
    }
    searchTicketName(event){
        if(event.target.value.length > 0){
            this.setState({filteredTickets: this.state.tickets.filter(ticket => {return String(ticket.name).toLowerCase().includes(String(event.target.value).toLowerCase())}), searchedTicketName: event.target.value});
        }
        else{
            this.setState({filteredTickets: this.state.tickets, searchedTicketName: event.target.value});
        }
    }
    searchCompName(event){
        if(event.target.value.length > 0){
            this.setState({filteredComponents: this.state.components.filter(comp => {return String(comp.name).toLowerCase().includes(String(event.target.value).toLowerCase())}), searchCompName: event.target.value});
        }
        else{
            this.setState({filteredComponents: this.state.components, searchCompName: event.target.value});
        }
    }
    search(event){
        if(event.target.value.length > 0){
            this.setState({filteredUsers: this.state.users.filter(user => {return String(user.name).toLowerCase().includes(String(event.target.value).toLowerCase())}), searchName: event.target.value});
        }
        else{
            this.setState({filteredUsers: this.state.users, searchName: event.target.value});
        }
    }   
    selfAssignReporter(){axios.get('/current-user').then(response => {
        if(response.data.success == true){this.setReporter({email:response.data.email, name: response.data.name})}
        else{console.log('Error at self assign');}
    });}
    selfAssignAssignee(){axios.get('/current-user').then(response => {
        if(response.data.success == true){this.setAssignee({email:response.data.email, name: response.data.name})}
        else{console.log('Error at self assign');}
    });}
    setReporter(user){this.setState({reporter: user});}
    setAssignee(user){this.setState({assignee: user});}
    setComponent(component){this.setState({component: component});}
    setBlockedTicket(ticket){this.setState({blockedTicket: ticket});}
    setBlockingTicket(ticket){this.setState({blockingTicket: ticket});}
    setCategory(category){this.setState({category: category});}
    setDueDate(date){this.setState({dueDate: date, dateError: ''});}
    setStartDate(date){this.setState({startDate: date, dateError: ''});}
    setDescription(event){this.setState({description: event.target.value});}
    setPriority(prio){this.setState({priority: prio})};
    setRelease(release){this.setState({release: release});}

    fetchComponents(){axios.get('/get-components').then(response => {this.setState({components: response.data, filteredComponents: response.data});});}
    fetchTickets(){axios.get('/get-tickets').then(response => {this.setState({tickets: response.data, filteredTickets: response.data});});}
    fetchCategories(){axios.get('/get-categories').then(response => {this.setState({categories: response.data, filteredCategories: response.data})});}
    fetchReleases(){axios.get('/get-releases').then(response => {this.setState({releases: response.data, filteredReleases: response.data});});}
    fetchUsers(){axios.get('/users/get-users').then(response => {this.setState({users: response.data, filteredUsers: response.data})})}
    componentDidMount(){
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
        if(this.state.componentId == undefined || this.state.componentId.length == 0){this.setState({componentError: 'Please select a component'}); return;}
        if(this.state.reporterEmail == undefined || this.state.reporterEmail.length == 0){this.setState({reporterError: 'Please select a reporter'}); return;}
        if(this.state.assigneeEmail == undefined || this.state.assigneeEmail.length == 0){this.setState({assigneeError: 'Please select an assignee'}); return;}
        if(this.state.startDate.getTime() > this.state.dueDate.getTime()){this.setState({dateError: 'Start date cannot be higher than due date'}); return;}

        let date = new Date().getTime();

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
            logged: 0,
            priority: this.state.priority,
            rel: this.state.releaseId,
            lane: 0,
            lastModified: date,
            created: date,
            isReport: 0,
            steps: '',
            observedBehaviour: '',
            expectedBehaviour: '',
        }).then(response => {
            if(response.status == 200){this.resetState()}
        }).catch(error => {
            if(error.response == undefined){return;}
            this.props.setError(error.response.data.error);
        });
    }

    hashUser(user){
        var hash;
        var md5 = crypto.createHash('md5');
        hash = md5.update(String(user.email).toLowerCase().trim()).digest('hex');
        return hash;
    }

    changeDueDate(day){
        console.log(day);
        const currentDate = new Date();
        const nextDate = new Date(this.state.dueDate.getFullYear(), this.state.dueDate.getMonth(), day, 23);

        console.log(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDay(), 23));
        console.log(nextDate);

        if(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDay()).getTime() <= nextDate.getTime()){
            this.setState({dueDate: nextDate});
        }
    }

    increaseMonth(){this.setState({dueDate: new Date(this.state.dueDate.setMonth(this.state.dueDate.getMonth() + 1))});}
    decreaseMonth(){this.setState({dueDate: new Date(this.state.dueDate.setMonth(this.state.dueDate.getMonth() - 1))});}
    translateDay(day){
        switch(day){
            case 0: return "Monday"; break;
            case 1: return "Tuesday"; break;
            case 2: return "Wednesday"; break;
            case 3: return "Thursday"; break;
            case 4: return "Friday"; break;
            case 5: return "Saturday"; break;
            case 6: return "Sunday"; break;
            default:break;
        }
    }

    render(){
        
        return(
            <div class="ticket container-fluid mt-3 col-xl-4 offset-xl-4">
                <div class="ticket-section px-2 mb-2">
                    <div class="row">
                        <div class="label col-xs-12 col-sm-12 d-flex">Ticket name</div>
                        <div class="form-group col-xl-12 py-2">
                            <input type="text" class="ticket-text-area form-control" placeholder="Item name" onChange={this.setName} value={this.state.name}/>
                        </div>
                    </div>
                </div>
                <div class="ticket-section px-2 mb-2">
                    <div class="row">
                        <div class="label col-xs-12 col-sm-12 d-flex">Priority</div>
                        <div class="dropdown py-2 col-xl-6 offset-xl-3">
                            <button class="ticket-dropdown-btn btn btn-secondary dropdown-toggle w-100" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <div class="row">
                                    <div class="ml-3"><img class="mx-auto my-auto" src={this.state.priority == "low" ? "./images/low.svg" : this.state.priority == "medium" ? "./images/neuter.svg" : "./images/high.svg"}/></div>
                                    <div class="col dropdown-text text-left text-truncate">{this.state.priority == "low" ? "Lowest" : this.state.priority == "medium" ? "Medium" : "Highest"}</div>
                                    <div class="mr-3 d-flex"><img class="dropdown-arrow mx-auto align-self-center" src="./images/arrow-down.svg"></img></div>
                                </div>
                            </button>
                            <div class="ticket-dropdown-menu dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                                <a class="ticket-dropdown-item dropdown-item" href="#" onClick={() => {this.setPriority("high")}}><img src="./images/high.svg" />Highest</a>
                                <a class="ticket-dropdown-item dropdown-item" href="#" onClick={() => {this.setPriority("medium")}}><img src="./images/neuter.svg" />Medium</a>
                                <a class="ticket-dropdown-item dropdown-item" href="#" onClick={() => {this.setPriority("low")}}><img src="./images/low.svg" />Lowest</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ticket-section px-2 mb-2">
                    <div class="row">
                        <div class="label col-xs-12 col-sm-12 d-flex">
                            <div class="flex-grow-1">Assignee</div>
                            <a class="ml-auto" href="#" onClick={this.selfAssignAssignee}>Assign to me</a>
                        </div>
                        <div class="dropdown py-2 col-xl-6 offset-xl-3">
                            <button class="ticket-dropdown-btn btn btn-secondary dropdown-toggle w-100 text-left" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                            onClick={this.fetchUsers}>
                                <div class="row">
                                    <div class="ml-3"><img class="mini-profile-pic mx-auto my-auto" src={'https://www.gravatar.com/avatar/' + this.hashUser(this.state.assignee)}/></div>
                                    <div class="col dropdown-text text-left flex-grow-1 text-truncate">{this.state.assignee == undefined || this.state.assignee.name == undefined || this.state.assignee.name.length == 0 ? "No user assigned" : this.state.assignee.name}</div>
                                    <div class="mr-3 d-flex"><img class="dropdown-arrow mx-auto align-self-center" src="./images/arrow-down.svg"></img></div>
                                </div>
                            </button>
                            <div class="ticket-dropdown-menu dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                                <input type="text" class="search-box ticket-text-area form-control" placeholder="Search name" onChange={this.search} value={this.state.searchName}/>
                                {this.state.filteredUsers == undefined || this.state.filteredUsers.length == 0 ?
                                    <a class="ticket-dropdown-item dropdown-item text-truncate" href="#">No users</a> 
                                    :
                                    this.state.filteredUsers.map(user => <a class="ticket-dropdown-item dropdown-item text-truncate" href="#" key={user.email} onClick={() => {this.setAssignee(user);}}><img class="mini-profile-pic mr-2" src={'https://www.gravatar.com/avatar/' + this.hashUser(user)}/>{user.name}</a>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ticket-section px-2 mb-2">
                    <div class="row">
                        <div class="label col-xs-12 col-sm-12">Description</div>
                        <div class="form-group py-2 col-xs-12 col-sm-12">
                            <textarea type="text" class="ticket-text-area form-control" placeholder="Description" onChange={this.setDescription} value={this.state.description}/>
                        </div>
                    </div>
                </div> 
                <div class="ticket-section px-2 mb-2">
                    <div class="row">
                        <div class="label col-xs-12 col-sm-12 d-flex">
                            <div class="flex-grow-1">Attach to component</div>
                        </div>
                        <div class="dropdown py-2 col-xl-6 offset-xl-3">
                            <button class="ticket-dropdown-btn btn btn-secondary dropdown-toggle w-100" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                            onClick={this.fetchComponents}>
                                <div class="row">
                                    {/* <div class="ml-3"><img class="mx-auto my-auto" src="./images/comp.svg"/></div> */}
                                    <div class="col dropdown-text text-left flex-grow-1 text-truncate">{this.state.component == undefined || this.state.component.name == undefined || this.state.component.name.length == 0 ? "No component attached" : this.state.component.name}</div>
                                    <div class="mr-3 d-flex"><img class="dropdown-arrow mx-auto align-self-center" src="./images/arrow-down.svg"></img></div>
                                </div>
                            </button>
                            <div class="ticket-dropdown-menu dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                                <input type="text" class="search-box ticket-text-area form-control" placeholder="Search component name" onChange={this.searchCompName} value={this.state.searchCompName}/>
                                {this.state.filteredComponents == undefined || this.state.filteredComponents.length == 0 ?
                                    <a class="ticket-dropdown-item dropdown-item text-truncate" href="#">No components</a> 
                                    :
                                    this.state.filteredComponents.map(component => <a class="ticket-dropdown-item dropdown-item text-truncate" href="#" title={component.name} key={component.id} onClick={() => {this.setComponent(component);}}>{component.name}</a>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ticket-section px-2 mb-2">
                    <div class="row">
                        <div class="label col-xl-12 d-flex">
                            <div class="flex-grow-1">Blocks following ticket</div>
                        </div>
                        <div class="dropdown col-xl-6 offset-xl-3 py-2">
                            <button class="ticket-dropdown-btn btn btn-secondary dropdown-toggle w-100" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                            onClick={this.fetchTickets}>
                                <div class="row">
                                    {/* <div class="ml-3"><img class="mini-profile-pic mx-auto my-auto" src="./images/blocking.svg"/></div> */}
                                    <div class="col dropdown-text text-left flex-grow-1 text-truncate">{this.state.blockedTicket == undefined || this.state.blockedTicket.name == undefined || this.state.blockedTicket.name.length == 0 ? "No blocked ticket" : this.state.blockedTicket.name}</div>
                                    <div class="mr-3 d-flex"><img class="dropdown-arrow mx-auto align-self-center" src="./images/arrow-down.svg"></img></div>
                                </div>
                            </button>
                            <div class="ticket-dropdown-menu dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                                <input type="text" class="search-box ticket-text-area form-control" placeholder="Search ticket name" onChange={this.searchTicketName} value={this.state.searchedTicketName}/>
                                {this.state.filteredTickets == undefined || this.state.filteredTickets.length == 0 ?
                                    <a class="ticket-dropdown-item dropdown-item" href="#">No tickets</a> 
                                    :
                                    this.state.filteredTickets.map(ticket => <a class="ticket-dropdown-item dropdown-item" href="#" key={"blocked" + ticket.id} onClick={() => {this.setBlockedTicket(ticket);}}>{ticket.name}</a>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ticket-section px-2 mb-2">
                    <div class="row">
                        <div class="label col-xs-12 col-sm-12 d-flex">
                            <div class="flex-grow-1">Blocked by following ticket</div>
                        </div>
                        <div class="dropdown col-xl-6 offset-xl-3 py-2">
                            <button class="ticket-dropdown-btn btn btn-secondary dropdown-toggle w-100" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                            onClick={this.fetchTickets}>
                                <div class="row">
                                    {/* <div class="ml-3"><img class="mini-profile-pic mx-auto my-auto" src={'https://www.gravatar.com/avatar/' + this.hashUser(this.state.assignee)}/></div> */}
                                    <div class="col dropdown-text text-left flex-grow-1 text-truncate">{this.state.blockingTicket == undefined || this.state.blockingTicket.name == undefined || this.state.blockingTicket.name.length == 0 ? "No blocking ticket" : this.state.blockingTicket.name}</div>
                                    <div class="mr-3 d-flex"><img class="dropdown-arrow mx-auto align-self-center" src="./images/arrow-down.svg"></img></div>
                                </div>
                            </button>
                            <div class="ticket-dropdown-menu dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                                <input type="text" class="search-box ticket-text-area form-control" placeholder="Search ticket name" onChange={this.searchTicketName} value={this.state.searchedTicketName}/>
                                {this.state.filteredTickets == undefined || this.state.filteredTickets.length == 0 ?
                                    <a class="ticket-dropdown-item dropdown-item" href="#">No tickets</a> 
                                    :
                                    this.state.filteredTickets.map(ticket => <a class="ticket-dropdown-item dropdown-item" href="#" key={"blocking" + ticket.id} onClick={() => {this.setBlockingTicket(ticket);}}>{ticket.name}</a>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ticket-section px-2 mb-2">
                    <div class="row">
                        <div class="label col-xs-12 col-sm-12 d-flex">
                            <div class="flex-grow-1">Category</div>
                        </div>
                        <div class="dropdown col-xl-6 offset-xl-3 py-2">
                            <button class="ticket-dropdown-btn btn btn-secondary dropdown-toggle w-100" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                            onClick={this.fetchCategories}>
                                <div class="row">
                                    {/* <div class="ml-3"><img class="mini-profile-pic mx-auto my-auto" src={'https://www.gravatar.com/avatar/' + this.hashUser(this.state.assignee)}/></div> */}
                                    <div class="col dropdown-text text-left flex-grow-1 text-truncate">{this.state.category == undefined || this.state.category.name == undefined || this.state.category.name.length == 0 ? "No attached category" : this.state.category.name}</div>
                                    <div class="mr-3 d-flex"><img class="dropdown-arrow mx-auto align-self-center" src="./images/arrow-down.svg"></img></div>
                                </div>
                            </button>
                            <div class="ticket-dropdown-menu dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                                <input type="text" class="search-box ticket-text-area form-control" placeholder="Search category name" onChange={this.searchCategory} value={this.state.searchedCategory}/>
                                {this.state.filteredCategories == undefined || this.state.filteredCategories.length == 0 ?
                                    <a class="ticket-dropdown-item dropdown-item" href="#">No categories</a> 
                                    :
                                    this.state.filteredCategories.map(ticket => <a class="ticket-dropdown-item dropdown-item" href="#" key={"blocking" + ticket.id} onClick={() => {this.setCategory(ticket);}}>{ticket.name}</a>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ticket-section px-2 mb-2">
                    <div class="row">
                        <div class="label col-xs-12 col-sm-12 d-flex">
                            <div class="flex-grow-1">Release</div>
                        </div>
                        <div class="dropdown col-xl-6 offset-xl-3 py-2">
                            <button class="ticket-dropdown-btn btn btn-secondary dropdown-toggle w-100" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                            onClick={this.fetchReleases}>
                                <div class="row">
                                    {/* <div class="ml-3"><img class="mini-profile-pic mx-auto my-auto" src={'https://www.gravatar.com/avatar/' + this.hashUser(this.state.assignee)}/></div> */}
                                    <div class="col dropdown-text text-left flex-grow-1 text-truncate">{this.state.release == undefined || this.state.release.name == undefined || this.state.release.name.length == 0 ? "No attached release" : this.state.release.name}</div>
                                    <div class="mr-3 d-flex"><img class="dropdown-arrow mx-auto align-self-center" src="./images/arrow-down.svg"></img></div>
                                </div>
                            </button>
                            <div class="ticket-dropdown-menu dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                                <input type="text" class="search-box ticket-text-area form-control" placeholder="Search category name" onChange={this.searchRelease} value={this.state.searchRelease}/>
                                {this.state.filteredReleases == undefined || this.state.filteredReleases.length == 0 ?
                                    <a class="ticket-dropdown-item dropdown-item" href="#">No categories</a> 
                                    :
                                    this.state.filteredReleases.map(release => <a class="ticket-dropdown-item dropdown-item" href="#" key={"blocking" + release.id} onClick={() => {this.setRelease(release);}}>{release.name}</a>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ticket-section px-2 mb-2">
                    <div class="row">
                        <div class="label col-xl-12 col-xs-12 col-sm-12">Estimation</div>
                        <div class="form-group col-xl-12 py-2 col-xs-12 col-sm-12">
                            <input type="text" class="ticket-text-area form-control" placeholder="Estimation" onChange={this.setEstimation} value={this.state.estimation}/>
                        </div>
                    </div>
                </div>
                <div class="ticket-section px-2 mb-2">
                    <div class="row">
                        <div class="label col-xs-12 col-sm-12 d-flex">
                            <div class="flex-grow-1">Due date</div>
                        </div>
                        <div class="col-xl-6 offset-xl-3 col px-3 py-2">
                            <button class="ticket-dropdown-btn btn btn-secondary w-100" data-toggle="dropdown">{dateformat(this.state.dueDate, 'dddd \u00B7 dd \u00B7 mmmm \u00B7 yyyy')}</button>
                            <div class="ticket-dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                                <div class="calendar input-group">
                                    <div class="input-group-prepend">
                                        <button class="date-btn btn px-3 py-1 h-100" type="button" id="button-addon1" onClick={this.decreaseMonth}><img class="mx-auto" src="./images/go-left.svg"></img></button>
                                    </div>
                                    <div class="date-display mx-auto"><span class="align-middle">{dateformat(this.state.dueDate, 'mmmm \u00B7 yyyy')}</span></div>
                                    <div class="input-group-append">
                                        <button class="date-btn btn px-3 py-1 h-100" type="button" id="button-addon1" onClick={this.increaseMonth}><img class="mx-auto" src="./images/go-right.svg"></img></button>
                                    </div>
                                </div>
                                <div class="date-days d-flex flex-wrap">
                                    {[...new Array(new Date(this.state.dueDate.getFullYear(), this.state.dueDate.getMonth() + 1, 0).getDate()).keys()].map(day => {
                                        if( this.state.dueDate.getFullYear() == new Date().getFullYear() && 
                                            this.state.dueDate.getMonth() == new Date().getMonth() && 
                                            day + 1 == new Date().getDate()){
                                                return <button 
                                                        class={"day-btn current-day btn px-0 py-0 mx-1 mt-1"} 
                                                        key={day} 
                                                        onClick={()=>{this.changeDueDate(day + 1)}} 
                                                        title={this.translateDay(new Date(this.state.dueDate.getFullYear(), this.state.dueDate.getMonth(), day).getDay())}>{day + 1}</button>
                                            }
                                            else{
                                                return <button 
                                                        class={new Date(this.state.dueDate.getFullYear(), this.state.dueDate.getMonth(), day + 1, 0).getTime() >= new Date().getTime() ? "day-btn btn px-0 py-0 mx-1 mt-1" : "day-btn btn px-0 py-0 mx-1 mt-1 disabled"} 
                                                        key={day} 
                                                        onClick={()=>{this.changeDueDate(day + 1)}} 
                                                        title={this.translateDay(new Date(this.state.dueDate.getFullYear(), this.state.dueDate.getMonth(), day + 1).getDay())}>{day + 1}</button>
                                            }
                                        
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="d-flex flex-row justify-content-center mb-3">
                    <button class="ticket-dropdown-btn btn btn-primary mr-2">Submit ticket</button>
                    <button class="ticket-dropdown-btn btn btn-primary">Reset values</button>
                </div>
            </div>
        );
    }
}

ReactDom.render(<TicketSetup/>, document.getElementById('create-ticket'));

export default TicketSetup;