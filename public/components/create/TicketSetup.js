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
import Header2 from '../editor/Header2';
import Menu from '../Menu';
import LoadingScreen from '../LoadingScreen';

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
            projects: [],

            nameError: '',
            projectError: '',

            loadingProjects: true,
            loadingReleases: true,
            loadingTickets: true,
            loadingCategories: true,
            loadingComponents: true
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
        this.fetchProjects = this.fetchProjects.bind(this);
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
        .then(response => {this.setState({components: response.data, loadingComponents: false})});
    }

    fetchTickets(){
        axios.get('/get-tickets')
        .then(response => {
            this.setState({tickets: response.data.tickets, filteredTickets: response.data.tickets, loadingTickets: false});
        });
    }

    fetchCategories(){
        axios.get('/get-categories')
        .then(response => {
            this.setState({categories: response.data, filteredCategories: response.data, loadingCategories: false})
        });
    }   

    fetchReleases(){
        axios.get('/get-releases')
        .then(response => {this.setState({releases: response.data, loadingReleases: false})})
    }
    
    fetchProjects(){
        axios.get('/get-projects')
        .then(response => {this.setState({projects: response.data, loadingProjects: false})})
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
        this.fetchProjects();

        this.setState({priority: this.props.priorities[0], loading: false});
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
            this.state.loadingCategories || this.state.loadingComponents || this.state.loadingProjects || this.state.loadingReleases 
            // || this.state.loadingTickets 
            ? 
            <LoadingScreen/>
            :
            <div class={"container-fluid knbn-bg-transparent knbn-transition pb-3 knbn-container" + (this.props.themeToggled ? " knbn-dark-bg-1x" : " knbn-snow-bg-1x")}>
                <Menu/>

                <div class="row mt-3">
                    <div class="col-xl-4 offset-xl-4">
                        <div class="row">
                            <Header3>Creator tichet</Header3>
                        </div>

                        {
                        this.state.projects.length == 0 ? 
                        <div class="row">
                            <Header2>Niciun proiect configurat</Header2>
                            <div class={"knbn-font-small" + (this.props.themeToggled ? " knbn-dark-color-3x" : " knbn-snow-color-3x")}>Înainte de a adăuga un tichet, creați un proiect, și apoi cel puțin o componentă</div>
                        </div>
                        :
                        this.state.components.length == 0 ? 
                        <div class="row">
                            <Header2>Nicio componentă creată</Header2>
                            <div class={"knbn-font-small" + (this.props.themeToggled ? " knbn-dark-color-3x" : " knbn-snow-color-3x")}>Înainte de a adăuga un tichet, creați o componentă</div>
                        </div>
                        :
                        <div class="row">
                            <div class="col-xl-12">
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
                                    description="Proiectul la care tichetul va fi atașat"
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
                                    label="Blocat de tichet"
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
                        </div>
                        }   
                    </div>
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