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

    setAssignee(user){
        this.setState({assignee: user})
    }

    setComponent(component){
        this.setState({component: component, componentError: ''});
    }

    setBlockedTicket(ticket){
        this.setState({blockedTicket: ticket});
    }

    setBlockingTicket(ticket){
        this.setState({blockingTicket: ticket});
    }

    setCategory(category){
        this.setState({category: category});
    }

    setDescription(value){
        this.setState({description: value});
    }

    setPriority(prio){
        this.setState({priority: prio})
    };

    setRelease(release){
        this.setState({release: release});
    }

    fetchComponents(){
        axios.get('/get-components/')
        .then(response => {this.setState({components: response.data})});
    }

    fetchTickets(){
        axios.get('/get-tickets')
        .then(response => {
            this.setState({tickets: response.data.tickets, filteredTickets: response.data.tickets});
        });
    }

    fetchCategories(){
        axios.get('/get-categories')
        .then(response => {
            this.setState({categories: response.data, filteredCategories: response.data})
        });
    }   

    fetchReleases(){
        axios.get('/get-releases')
        .then(response => {this.setState({releases: response.data})})
    }
    
    fetchProject(){
        axios.get('/get-projects')
        .then(response => {this.setState({projects: response.data})})
    }

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
        if(this.state.name == undefined || this.state.name.length == 0){
            this.setState({nameError: 'Introdu numele tichetului'});
            return false;
        }

        if(this.state.project.id == undefined || this.state.project.id.length == 0 || this.state.project.id <= 0 ){
            this.setState({projectError: 'Selectează referința unui proiect'});
            return false;
        }

        if(this.state.component.id == undefined || this.state.component.id.length == 0 || this.state.component.id <= 0 ){
            this.setState({componentError: 'Selectează referința unei componente'});
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
                <Header3>Creator tichet</Header3>

                <Error>{this.state.nameError}</Error>
                <InputField 
                    label="Nume"
                    value={this.state.name}
                    description="Numele tichetului"
                    action={this.setName}
                />

                <Error>{this.state.projectError}</Error>
                <SelectionField
                    label="Atașează proiect"
                    action={this.setProject}
                    description="Proiect la care tichetul va fi atașat"
                    value={this.state.project.name}
                    items={this.state.projects}
                    currentItem={this.state.project}
                    imgSrc='./images/project.svg'
                />

                <Error>{this.state.componentError}</Error>
                <SelectionField
                    label="Atașează componentă"
                    action={this.setComponent}
                    description="Componentă la care tichetul va fi atașat"
                    value={this.state.component.name}
                    items={this.state.components}
                    currentItem={this.state.component}
                />

                <PriorityField
                    description="Prioritatea tichetului"
                    items={this.props.priorities}
                    action={this.setPriority}
                    value={this.state.priority}
                />

                <UserField
                    user={this.state.assignee}
                    action={this.setAssignee}
                    label="Proprietarul tichetului"
                />

                <TextAreaField
                    label="Descriere"
                    action={this.setDescription}
                    value={this.state.description}
                    description="Descrierea tichetului"
                />

                <SelectionField
                    label="Atașează versiune"
                    action={this.setRelease}
                    description="Versiune la care tichetul va fi atașat"
                    value={this.state.release.name}
                    items={this.state.releases}
                    currentItem={this.state.release}
                />

                <SelectionField
                    label="Tichet blocat"
                    action={this.setBlockedTicket}
                    description="Tichetul blocat de crearea tichetului curent"
                    value={this.state.blockedTicket.name}
                    items={this.state.tickets}
                    currentItem={this.state.blockedTicket}
                />  

                <SelectionField
                    label="Blocat de ticheet"
                    action={this.setBlockingTicket}
                    description="Tichetul care blochează tichetul curent"
                    value={this.state.blockingTicket.name}
                    items={this.state.tickets}
                    currentItem={this.state.blockingTicket}
                />  
                
                <SelectionField
                    label="Atașează categorie"
                    action={this.setCategory}
                    description="Categoria tichetului"
                    value={this.state.category.name}
                    items={this.state.categories}
                    currentItem={this.state.category}
                />  

                <InputField 
                    label="Ore de muncă estimate"
                    value={this.state.estimation}
                    description="Efort estimat în ore"
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
                    <button class={"ticket-dropdown-btn btn btn-primary mr-2 knbn-border" + (this.props.themeToggled ? " knbn-dark-bg-2x knbn-dark-color-2x knbn-dark-border-2x" : " knbn-snow-bg-2x knbn-snow-color-2x knbn-snow-border-2x")} onClick={this.submitTicket}>Adaugă tichet</button>
                    <button class={"ticket-dropdown-btn btn btn-primary" + (this.props.themeToggled ? " knbn-dark-bg-2x knbn-dark-color-2x knbn-dark-border-2x" : " knbn-snow-bg-2x knbn-snow-color-2x knbn-snow-border-2x")} onClick={this.resetState}>Anulează</button>
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