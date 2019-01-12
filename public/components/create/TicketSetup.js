import React from 'react';
import axios from 'axios';
import InputField from './InputField';
import PriorityField from './PriorityField';
import UserField from './UserField';
import TextAreaField from './TextAreaField';
import SelectionField from './SelectionField';
import { connect } from 'react-redux';
import Error from './Error';
import Header3 from '../editor/Header3';

class TicketSetup extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            name: '',
            users: [],
            components: [],
            tickets: [],
            releases: [],
            reporter: {},
            assignee: {},
            component: {},
            blockedTicket: {},
            blockingTicket: {},
            category: {},
            categories: [],
            dueDate: new Date(),
            estimation: 0,
            description: '',
            priority: {},
            release: {},
            project: {},

            nameError: '',
            projectError: ''
        }

        this.setAssignee = this.setAssignee.bind(this);
        this.setComponent = this.setComponent.bind(this);
        this.setBlockedTicket = this.setBlockedTicket.bind(this);
        this.setBlockingTicket = this.setBlockingTicket.bind(this);
        this.setCategory = this.setCategory.bind(this);
        this.setEstimation = this.setEstimation.bind(this);
        this.setDescription = this.setDescription.bind(this);
        this.fetchComponents = this.fetchComponents.bind(this);
        this.fetchCategories = this.fetchCategories.bind(this);
        this.fetchTickets = this.fetchTickets.bind(this);
        this.setPriority = this.setPriority.bind(this);
        this.submitTicket = this.submitTicket.bind(this);
        this.setRelease = this.setRelease.bind(this);
        this.fetchReleases = this.fetchReleases.bind(this);
        this.setName = this.setName.bind(this);
        this.verify = this.verify.bind(this);
        this.setProject = this.setProject.bind(this);
        this.resetState = this.resetState.bind(this);
    }

    setName(value){
        this.setState({name: value, nameError: ''});
    }

    setAssignee(user){this.setState({assignee: user})}

    setComponent(component){this.setState({component: component, componentError: ''});}

    setBlockedTicket(ticket){this.setState({blockedTicket: ticket});}

    setBlockingTicket(ticket){this.setState({blockingTicket: ticket});}

    setCategory(category){this.setState({category: category});}

    setDescription(value){this.setState({description: value});}

    setPriority(prio){this.setState({priority: prio})};

    setRelease(release){this.setState({release: release});}

    fetchComponents(){axios.get('/get-components/').then(response => {this.setState({components: response.data})});}

    fetchTickets(){axios.get('/get-tickets').then(response => {this.setState({tickets: response.data.tickets, filteredTickets: response.data.tickets});});}

    fetchCategories(){axios.get('/get-categories').then(response => {this.setState({categories: response.data, filteredCategories: response.data})});}

    fetchReleases(){axios.get('/get-releases').then(response => {this.setState({releases: response.data})})}
    
    fetchProject(){axios.get('/get-projects').then(response => {this.setState({projects: response.data})})}

    setEstimation(value){
        this.setState({estimation: value});
    }

    setProject(value){
        this.setState({project: value});
    }

    componentWillMount(){
        this.fetchComponents();
        this.fetchReleases();
        this.fetchTickets();
        this.fetchCategories();
        this.fetchProject();

        this.setState({priority: this.props.priorities[0]});
    }

    componentWillReceiveProps(nextProps, nextState){
        this.setState({priority: nextProps.priorities[0]});
    }

    verify(){
        // check name not empty
        if(this.state.name == undefined || this.state.name.length == 0){
            this.setState({nameError: 'Enter a ticket name'});
            return false;
        }
        // check if attached to a project
        if(this.state.project.id == undefined || this.state.project.id.length == 0 || this.state.project.id <= 0 ){
            this.setState({projectError: 'Select a project reference'});
            return false;
        }

        if(this.state.component.id == undefined || this.state.component.id.length == 0 || this.state.component.id <= 0 ){
            this.setState({componentError: 'Select a component reference'});
            return false;
        }

        return true;
    }

    resetState(){
        this.setState({
            name: '',
            assignee: {},
            component: {},
            blockedTicket: {},
            blockingTicket: {},
            category: {},
            dueDate: new Date(),
            estimation: 0,
            description: '',
            priority: this.props.priorities[0],
            release: {},
            nameError: '',
            projectError: '',
            componentError: '',
            project: {}
        })
    }

    submitTicket(event){
        event.preventDefault();

        if(this.verify() == true){
            axios.post('/add-ticket', {
                name: this.state.name,
                assignee: this.state.assignee.email,
                component: this.state.component.id,
                blockedTicket: this.state.blockedTicket.id,
                blockingTicket: this.state.blockingTicket.id,
                category: this.state.category.id,
                estimation: parseInt(this.state.estimation),
                description: this.state.description,
                priority: this.state.priority.dbName,
                releaseID: this.state.release.id,
                dueDate: new Date().getTime(),
                startDate: new Date().getTime(),
                project: this.state.project.id,
                lane: 'backlog',
            }).then(response => {
                if(response.data.success == true){
                    this.resetState();
                }
            });
        }
    }

    render(){
        return(
            <div class="container-fluid mt-3 col-xl-4 col-sm-8 offset-sm-2 offset-xl-4 col-md-6 offset-md-3 px-2">
                <Header3>Ticket Creator</Header3>

                <Error>{this.state.nameError}</Error>
                <InputField 
                    label="Name"
                    value={this.state.name}
                    description="Name of the ticket"
                    action={this.setName}
                />

                <Error>{this.state.projectError}</Error>
                <SelectionField
                    label="Attach project"
                    action={this.setProject}
                    description="Project to be attached to"
                    value={this.state.project.name}
                    items={this.state.projects}
                    currentItem={this.state.project}
                />

                <Error>{this.state.componentError}</Error>
                <SelectionField
                    label="Attach component"
                    action={this.setComponent}
                    description="Component to be attached to"
                    value={this.state.component.name}
                    items={this.state.components}
                    currentItem={this.state.component}
                />

                <PriorityField
                    description="Priority of ticket"
                    items={this.props.priorities}
                    action={this.setPriority}
                    value={this.state.priority}
                />

                <UserField
                    user={this.state.assignee}
                    action={this.setAssignee}
                    label="The current owner of the ticket"
                />

                <TextAreaField
                    label="Description"
                    action={this.setDescription}
                    value={this.state.description}
                    description="Description of the ticket"
                />

                <SelectionField
                    label="Attach release"
                    action={this.setRelease}
                    description="Release to be attached to"
                    value={this.state.release.name}
                    items={this.state.releases}
                    currentItem={this.state.release}
                />

                <SelectionField
                    label="Blocks ticket"
                    action={this.setBlockedTicket}
                    description="Ticket blocked by this current ticket"
                    value={this.state.blockedTicket.name}
                    items={this.state.tickets}
                    currentItem={this.state.blockedTicket}
                />  

                <SelectionField
                    label="Blocked by ticket"
                    action={this.setBlockingTicket}
                    description="Ticket that blocks this current ticket"
                    value={this.state.blockingTicket.name}
                    items={this.state.tickets}
                    currentItem={this.state.blockingTicket}
                />  
                
                <SelectionField
                    label="Attach category"
                    action={this.setCategory}
                    description="Category"
                    value={this.state.category.name}
                    items={this.state.categories}
                    currentItem={this.state.category}
                />  

                <InputField 
                    label="Estimated work hours"
                    value={this.state.estimation}
                    description="Estimated work in hours"
                    action={this.setEstimation}
                />
                
                {/* <div class="ticket-section mb-2 d-flex">
                    <Toggler classToToggle=".knbn-to-collapse"/>
                    <div class="w-100">
                        <Label label='Due date'/>
                        <DatePicker changeDate={this.changeDueDate}/>
                    </div>
                </div> */}

                <div class="d-flex flex-row justify-content-center mb-3 ">
                    <button class="ticket-dropdown-btn btn btn-primary mr-2" onClick={this.submitTicket}>Submit ticket</button>
                    <button class="ticket-dropdown-btn btn btn-primary" onClick={this.resetState}>Cancel</button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
        priorities: state.priorities
    }
}

export default connect(mapStateToProps)(TicketSetup);