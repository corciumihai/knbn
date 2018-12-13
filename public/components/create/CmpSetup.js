import React from 'react';
import axios from 'axios';
import ReactDom from 'react-dom';
import crypto from 'crypto';
import DatePicker from './DatePicker';
import Label from './Label';
import ReactQuill from 'react-quill';
import Toggler from './Toggler';

class CmpSetup extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name: '',
            users: [],
            projects: [],
            releases: [],
            filteredUsers: [],
            searchName: '',
            filteredProjects: [],
            assignee: {},
            project: {},
            category: {},
            categories: [],
            searchedCategory: '',
            filteredCategories: [],
            dueDate: new Date(),
            estimation: 0,
            description: '',
            priority: "high",
            release: {},
            filteredReleases: [],
            searchedRelease: '',
        }

        this.setAssignee = this.setAssignee.bind(this);
        this.setProject = this.setProject.bind(this);
        this.setCategory = this.setCategory.bind(this);
        this.setDueDate = this.setDueDate.bind(this);
        this.setDescription = this.setDescription.bind(this);
        this.fetchProjects = this.fetchProjects.bind(this);
        this.fetchCategories = this.fetchCategories.bind(this);
        this.setPriority = this.setPriority.bind(this);
        this.submitComp = this.submitComp.bind(this);
        this.setRelease = this.setRelease.bind(this);
        this.fetchReleases = this.fetchReleases.bind(this);
        this.fetchUsers = this.fetchUsers.bind(this);
        this.selfAssignAssignee = this.selfAssignAssignee.bind(this);
        this.searchCompName = this.searchCompName.bind(this);
        this.searchTicketName = this.searchTicketName.bind(this);
        this.searchCategory = this.searchCategory.bind(this);
        this.decreaseMonth = this.decreaseMonth.bind(this);
        this.increaseMonth = this.increaseMonth.bind(this);
        this.changeDueDate = this.changeDueDate.bind(this);
        this.searchRelease = this.searchRelease.bind(this);
        this.setName = this.setName.bind(this);
        this.search = this.search.bind(this);
    }

    setName(event){this.setState({name: event.target.value, nameError: ''});}
    searchRelease(event){
        if(event.target.value.length > 0){this.setState({filteredReleases: this.state.releases.filter(release => {return String(release.name).toLowerCase().includes(String(event.target.value).toLowerCase())}), searchedRelease: event.target.value});}
        else{this.setState({filteredReleases: this.state.releases, searchedRelease: event.target.value});}
    }
    searchCategory(event){
        if(event.target.value.length > 0){this.setState({filteredCategories: this.state.categories.filter(category => {return String(category.name).toLowerCase().includes(String(event.target.value).toLowerCase())}), searchedCategory: event.target.value});}
        else{this.setState({filteredCategories: this.state.tickets, searchedCategory: event.target.value});}
    }
    searchTicketName(event){
        if(event.target.value.length > 0){this.setState({filteredTickets: this.state.tickets.filter(ticket => {return String(ticket.name).toLowerCase().includes(String(event.target.value).toLowerCase())}), searchedTicketName: event.target.value});}
        else{this.setState({filteredTickets: this.state.tickets, searchedTicketName: event.target.value});}
    }
    searchCompName(event){
        if(event.target.value.length > 0){this.setState({filteredComponents: this.state.components.filter(comp => {return String(comp.name).toLowerCase().includes(String(event.target.value).toLowerCase())}), searchCompName: event.target.value});}
        else{this.setState({filteredComponents: this.state.components, searchCompName: event.target.value});}
    }
    search(event){
        if(event.target.value.length > 0){this.setState({filteredUsers: this.state.users.filter(user => {return String(user.name).toLowerCase().includes(String(event.target.value).toLowerCase())}), searchName: event.target.value});}
        else{this.setState({filteredUsers: this.state.users, searchName: event.target.value});}
    }   
    selfAssignAssignee(){axios.get('/current-user').then(response => {
        if(response.data.success == true){this.setAssignee({email:response.data.email, name: response.data.name})}
        else{console.log('Error at self assign');}
    });}
    setAssignee(user){this.setState({assignee: user, assigneeError: ''});}
    setProject(project){this.setState({project: project});}
    setCategory(category){this.setState({category: category});}
    setDueDate(date){this.setState({dueDate: date, dateError: ''});}
    setDescription(value){this.setState({description: value});}
    setPriority(prio){this.setState({priority: prio})};
    setRelease(release){this.setState({release: release});}
    fetchProjects(){axios.get('/get-projects').then(response => {this.setState({projects: response.data, filteredProjects: response.data});});}
    fetchCategories(){axios.get('/get-categories').then(response => {this.setState({categories: response.data, filteredCategories: response.data})});}
    fetchReleases(){axios.get('/get-releases').then(response => {this.setState({releases: response.data, filteredReleases: response.data});});}
    fetchUsers(){axios.get('/users/get-users').then(response => {this.setState({users: response.data, filteredUsers: response.data})})}
    
    submitComp(event){
        event.preventDefault();
        // TODO make required checks before submiting
        if(this.state.name == undefined || this.state.name.length == 0) {this.setState({nameError: 'Please insert a ticket name'}); return}
        if(this.state.assignee == undefined || this.state.assignee.email == undefined || this.state.assignee.name == undefined || this.state.assignee.email.length == 0 || this.state.assignee.name.length == 0){this.setState({assigneeError: 'Please choose an assignee'}); return;}
        
        axios.post('/add-cmp', {
            name: this.state.name,
            assignee: this.state.assignee.email,
            project: this.state.project.id,
            category: this.state.category.id,
            description: this.state.description.length > 0 ? this.state.description : undefined,
            priority: this.state.priority,
            releaseID: this.state.release.id,
            dueDate: this.state.dueDate.getTime(),
            // POST SUBMIT DATA
            startDate: new Date().getTime(),
        }).then(response => {
            if(response.data.success == false){
                
            }
        });
    }
    hashUser(user){
        var hash; var md5 = crypto.createHash('md5');
        hash = md5.update(String(user.email).toLowerCase().trim()).digest('hex');
        return hash;
    }
    changeDueDate(day){
        const currentDate = new Date();
        const nextDate = new Date(this.state.dueDate.getFullYear(), this.state.dueDate.getMonth(), day, 23);

        if(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDay()).getTime() <= nextDate.getTime()){
            this.setState({dueDate: nextDate});
        }
    }
    increaseMonth(){this.setState({dueDate: new Date(this.state.dueDate.setMonth(this.state.dueDate.getMonth() + 1))});}
    decreaseMonth(){this.setState({dueDate: new Date(this.state.dueDate.setMonth(this.state.dueDate.getMonth() - 1))});}

    render(){
        var formats = [
            'header',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent',
            'link', 'image'
        ]

        return(
            <div class="ticket container-fluid mt-3 col-xl-4 col-sm-8 offset-sm-2 offset-xl-4 col-md-6 offset-md-3 px-1">
                <div class="ticket-section mb-2 d-flex">
                    <Toggler classToToggle=".knbn-to-collapse"/>
                    <div class="w-100">
                        <div class="label col-xs-12 col-sm-12 d-flex">Component name</div>
                        {this.state.nameError == undefined || this.state.nameError.length == 0 ? null: <div class="col-12"><div class="error-label w-100">{this.state.nameError}</div></div>}
                        <div class="form-group knbn-to-collapse col-xl-12 py-2">
                            <input type="text" class="ticket-text-area form-control" placeholder="Component name" onChange={this.setName} value={this.state.name}/>
                        </div>
                    </div>
                </div>
                <div class="ticket-section mb-2 d-flex">
                    <Toggler classToToggle=".knbn-to-collapse"/>
                    <div class="w-100">
                        <div class="label col-xs-12 col-sm-12 d-flex">Priority</div>
                        <div class="knbn-to-collapse dropdown py-2 col-xl-8 offset-xl-2">
                            <button class="ticket-dropdown-btn btn btn-secondary dropdown-toggle w-100" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <div class="row">
                                    <div class="ml-3"><img class="mx-auto my-auto" src={this.state.priority == "low" ? "./images/low.svg" : this.state.priority == "medium" ? "./images/neuter.svg" : "./images/high.svg"}/></div>
                                    <div class="col dropdown-text text-left text-truncate">{this.state.priority == "low" ? "Lowest" : this.state.priority == "medium" ? "Medium" : "Highest"}</div>
                                    <div class="mr-3 d-flex"><img class="dropdown-arrow mx-auto align-self-center" src="./images/arrow-down.svg"></img></div>
                                </div>
                            </button>
                            <div class="ticket-dropdown-menu dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                                <a class="ticket-dropdown-item dropdown-item" href="#" onClick={(event) => {event.preventDefault(); this.setPriority("high")}}><img src="./images/high.svg" />Highest</a>
                                <a class="ticket-dropdown-item dropdown-item" href="#" onClick={(event) => {event.preventDefault(); this.setPriority("medium")}}><img src="./images/neuter.svg" />Medium</a>
                                <a class="ticket-dropdown-item dropdown-item" href="#" onClick={(event) => {event.preventDefault(); this.setPriority("low")}}><img src="./images/low.svg" />Lowest</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ticket-section mb-2 d-flex">
                    <Toggler classToToggle=".knbn-to-collapse"/>
                    <div class="w-100">
                        <div class="label col-xs-12 col-sm-12 d-flex">
                            <div class="flex-grow-1">Owner</div>
                            <a class="ml-auto" href="#" onClick={this.selfAssignAssignee}>Assign to me</a>
                        </div>
                        {this.state.assigneeError == undefined || this.state.assigneeError.length == 0 ? null: <div class="col-12"><div class="error-label w-100">{this.state.assigneeError}</div></div>}
                        <div class="knbn-to-collapse dropdown py-2 col-xl-8 offset-xl-2">
                            <button class="ticket-dropdown-btn btn btn-secondary dropdown-toggle w-100 text-left" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                            onClick={this.fetchUsers}>
                                <div class="row">
                                    <div class="ml-3"><img class="mini-profile-pic mx-auto my-auto" src={'https://www.gravatar.com/avatar/' + this.hashUser(this.state.assignee)}/></div>
                                    <div class="col dropdown-text text-left flex-grow-1 text-truncate">{this.state.assignee == undefined || this.state.assignee.name == undefined || this.state.assignee.name.length == 0 ? "No user assigned" : this.state.assignee.name}</div>
                                    <div class="mr-3 d-flex"><img class="dropdown-arrow mx-auto align-self-center" src="./images/arrow-down.svg"></img></div>
                                </div>
                            </button>
                            <div class="ticket-dropdown-menu dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                                <div class="col"><input type="text" class="search-box ticket-text-area form-control mb-2" placeholder="Search name" onChange={this.search} value={this.state.searchName}/></div>
                                {this.state.filteredUsers == undefined || this.state.filteredUsers.length == 0 ?
                                    <a class="ticket-dropdown-item dropdown-item text-truncate" href="#">No users</a> 
                                    :
                                    this.state.filteredUsers.map(user => <a class="ticket-dropdown-item dropdown-item text-truncate" href="#" key={user.email} onClick={(event) => {event.preventDefault(); this.setAssignee(user);}}><img class="mini-profile-pic mr-2" src={'https://www.gravatar.com/avatar/' + this.hashUser(user)}/>{user.name}</a>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ticket-section mb-2 d-flex">
                    <Toggler classToToggle=".knbn-to-collapse"/>
                    <div class="w-100">
                        <Label label='Description'/>
                        <div class="knbn-to-collapse knbn-text-editor w-100 col-12 mb-2">
                            <ReactQuill value={this.state.description} onChange={this.setDescription}/>
                        </div>
                    </div>
                </div> 
                <div class="ticket-section mb-2 d-flex">
                    <Toggler classToToggle=".knbn-to-collapse"/>
                    <div class="w-100">
                        <div class="label col-xs-12 col-sm-12 d-flex">
                            <div class="flex-grow-1">Attach to project</div>
                        </div>
                        <div class="knbn-to-collapse dropdown py-2 col-xl-8 offset-xl-2">
                            <button class="ticket-dropdown-btn btn btn-secondary dropdown-toggle w-100" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                            onClick={this.fetchProjects}>
                                <div class="row">
                                    <div class="ml-3"><img class="mx-auto my-auto" src="./images/comp.svg"/></div>
                                    <div class="col dropdown-text text-left flex-grow-1 text-truncate">{this.state.project == undefined || this.state.project.name == undefined || this.state.project.name.length == 0 ? "No project attached" : this.state.project.name}</div>
                                    <div class="mr-3 d-flex"><img class="dropdown-arrow mx-auto align-self-center" src="./images/arrow-down.svg"></img></div>
                                </div>
                            </button>
                            <div class="ticket-dropdown-menu dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                                <div class="col"><input type="text" class="search-box ticket-text-area form-control mb-2" placeholder="Search name" onChange={this.search} value={this.state.searchName}/></div>
                                {this.state.filteredProjects == undefined || this.state.filteredProjects.length == 0 ?
                                    <a class="ticket-dropdown-item dropdown-item text-truncate" href="#">No projects available</a> 
                                    :
                                    this.state.filteredProjects.map(project => <a class="ticket-dropdown-item dropdown-item text-truncate" href="#" title={project.name} key={project.id} onClick={(event) => {event.preventDefault(); this.setProject(project);}}>{project.name}</a>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="ticket-section mb-2 d-flex">
                    <Toggler classToToggle=".knbn-to-collapse"/>
                    <div class="w-100">
                        <div class="label col-xs-12 col-sm-12 d-flex">
                            <div class="flex-grow-1">Category</div>
                        </div>
                        <div class="knbn-to-collapse dropdown col-xl-8 offset-xl-2 py-2">
                            <button class="ticket-dropdown-btn btn btn-secondary dropdown-toggle w-100" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                            onClick={this.fetchCategories}>
                                <div class="row">
                                    <div class="ml-3"><img class="mx-auto my-auto" src="./images/category.svg"/></div>
                                    <div class="col dropdown-text text-left flex-grow-1 text-truncate">{this.state.category == undefined || this.state.category.name == undefined || this.state.category.name.length == 0 ? "No attached category" : this.state.category.name}</div>
                                    <div class="mr-3 d-flex"><img class="dropdown-arrow mx-auto align-self-center" src="./images/arrow-down.svg"></img></div>
                                </div>
                            </button>
                            <div class="ticket-dropdown-menu dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                                <div class="col"><input type="text" class="search-box ticket-text-area form-control mb-2" placeholder="Search category name" onChange={this.searchCategory} value={this.state.searchedCategory}/></div>
                                {this.state.filteredCategories == undefined || this.state.filteredCategories.length == 0 ?
                                    <a class="ticket-dropdown-item dropdown-item" href="#">No categories</a> 
                                    :
                                    this.state.filteredCategories.map(ticket => <a class="ticket-dropdown-item dropdown-item" href="#" key={"blocking" + ticket.id} onClick={(event) => {event.preventDefault(); this.setCategory(ticket);}}>{ticket.name}</a>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ticket-section mb-2 d-flex">
                    <Toggler classToToggle=".knbn-to-collapse"/>
                    <div class="w-100">
                        <div class="label col-xs-12 col-sm-12 d-flex">
                            <div class="flex-grow-1">Release</div>
                        </div>
                        <div class="knbn-to-collapse dropdown col-xl-8 offset-xl-2 py-2">
                            <button class="ticket-dropdown-btn btn btn-secondary dropdown-toggle w-100" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                            onClick={this.fetchReleases}>
                                <div class="row">
                                    <div class="ml-3"><img class="mx-auto my-auto" src="./images/release.svg"/></div>
                                    <div class="col dropdown-text text-left flex-grow-1 text-truncate">{this.state.release == undefined || this.state.release.name == undefined || this.state.release.name.length == 0 ? "No attached release" : this.state.release.name}</div>
                                    <div class="mr-3 d-flex"><img class="dropdown-arrow mx-auto align-self-center" src="./images/arrow-down.svg"></img></div>
                                </div>
                            </button>
                            <div class="ticket-dropdown-menu dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                                <div class="col"><input type="text" class="search-box ticket-text-area form-control mb-2" placeholder="Search category name" onChange={this.searchRelease} value={this.state.searchRelease}/></div>
                                {this.state.filteredReleases == undefined || this.state.filteredReleases.length == 0 ?
                                    <a class="ticket-dropdown-item dropdown-item" href="#">No categories</a> 
                                    :
                                    this.state.filteredReleases.map(release => <a class="ticket-dropdown-item dropdown-item" href="#" key={"blocking" + release.id} onClick={(event) => {event.preventDefault(); this.setRelease(release);}}>{release.name}</a>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ticket-section mb-2 d-flex">
                    <Toggler classToToggle=".knbn-to-collapse"/>
                    <div class="w-100">
                        <Label label='Due date'/>
                        <DatePicker changeDate={this.changeDueDate}/>
                    </div>
                </div>
                <div class="d-flex flex-row justify-content-center mb-3 ">
                    <button class="ticket-dropdown-btn btn btn-primary mr-2" onClick={this.submitComp}>Submit component</button>
                    <button class="ticket-dropdown-btn btn btn-primary">Cancel</button>
                </div>
            </div>
        );
    }
}

ReactDom.render(<CmpSetup/>, document.getElementById('create-ticket'));

export default CmpSetup;