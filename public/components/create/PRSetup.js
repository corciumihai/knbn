import React from 'react';
import axios from 'axios';
import InputField from './InputField';
import PriorityField from './PriorityField';
import UserField from './UserField';
import TextAreaField from './TextAreaField';
import SelectionField from './SelectionField';
import { connect } from 'react-redux';
import Error from './Error';
import Header2 from '../editor/Header2';
import Header3 from '../editor/Header3';
import Menu from '../Menu';
import SubmitButton from './SubmitButton';
import CancelButton from './CancelButton';
import Success from '../messages/Success';

class PRSetup extends React.Component{
    
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
            testSteps: '',
            expectedBehavior: '',
            observedBehavior: '',
            priority: {},
            release: {},
            projects: [],
            project: {},
            error: '',
        }

        this.setAssignee = this.setAssignee.bind(this);
        this.setComponent = this.setComponent.bind(this);
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
        this.setTestSteps = this.setTestSteps.bind(this);
        this.setObservedBehavior = this.setObservedBehavior.bind(this);
        this.setExpectedBehavior = this.setExpectedBehavior.bind(this);
        this.fetchProjects = this.fetchProjects.bind(this);
        this.setProject = this.setProject.bind(this);
        this.resetError = this.resetError.bind(this);
    }

    setName(value){
        this.setState({name: value}, this.resetError);
    }
    
    resetError(){
        this.setState({error: ''});
    }

    setAssignee(user){this.setState({assignee: user}, this.resetError)}

    setComponent(component){this.setState({component: component}, this.resetError);}

    setCategory(category){this.setState({category: category}, this.resetError);}

    setDescription(value){this.setState({description: value}, this.resetError);}

    setPriority(prio){this.setState({priority: prio}, this.resetError)};

    setRelease(release){this.setState({release: release}, this.resetError);}

    fetchComponents(){axios.get('/get-components').then(response => {this.setState({components: response.data})});}

    fetchTickets(){axios.get('/get-tickets').then(response => {this.setState({tickets: response.data.tickets, filteredTickets: response.data.tickets});});}

    fetchCategories(){axios.get('/get-categories').then(response => {this.setState({categories: response.data, filteredCategories: response.data})});}

    fetchReleases(){axios.get('/get-releases').then(response => {this.setState({releases: response.data})})}

    fetchProjects(){
        axios.get('/get-projects')
        .then(response => {this.setState({projects: response.data})})
    }

    setEstimation(value){this.setState({estimation: value}, this.resetError);}

    setTestSteps(value){this.setState({testSteps: value}, this.resetError)}

    setExpectedBehavior(value){this.setState({expectedBehavior: value}, this.resetError)}

    setObservedBehavior(value){this.setState({observedBehavior: value}, this.resetError)}

    setProject(value){
        this.setState({project: value}, this.resetError);
    }

    componentWillMount(){
        this.fetchComponents();
        this.fetchReleases();
        this.fetchTickets();
        this.fetchCategories();
        this.fetchProjects();

        this.setState({priority: this.props.priorities[2]});
    }

    verify(){
        if(this.state.name == undefined || this.state.name.length == 0){
            this.setState({error: 'Introdu numele tichetului'});
            return false;
        }

        if(this.state.project.id == undefined || this.state.project.id.length == 0 || this.state.project.id <= 0 ){
            this.setState({error: 'Selectează referința unui proiect'});
            return false;
        }

        // check if attached to a component
        if(this.state.component.id == undefined || this.state.component.id.length == 0 || this.state.component.id <= 0 ){
            this.setState({error: 'Selectează o referință a unei componente'});
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
            testSteps: '',
            expectedBehavior: '',
            observedBehavior: '',
            priority: this.props.priorities[2],
            release: {},
            project: {},
            error: ''
        })
    }

    submitTicket(event){
        event.preventDefault();

        if(this.verify() == true){
            axios.post('/reports/add-report', {
                name: this.state.name,
                assignee: this.state.assignee.email,
                component: this.state.component.id,
                blockedTicket: this.state.blockedTicket.id,
                blockingTicket: this.state.blockingTicket.id,
                category: this.state.category.id,
                estimation: parseInt(this.state.estimation),
                description: this.state.description,
                reporter: this.state.reporter.email ? this.state.reporter.email : this.props.currentUser,
                testSteps: this.state.testSteps,
                expected: this.state.expectedBehavior,
                observed: this.state.observedBehavior,
                priority: this.state.priority.dbName,
                releaseID: this.state.release.id,
                dueDate: new Date(),
                testSteps: this.state.testSteps,
                startDate: new Date(),
                lane: 'backlog',
                project: this.state.project.id
            }).then(response => {
                console.log(response)
                if(response.status == 200){
                    this.setState({success: true}, this.resetState);
                }
            })
            .catch(error => {
                this.setState({error: error.response.data.error});
            })
        }
    }

    render(){
        return(
            <div class={"container-fluid knbn-bg-transparent knbn-transition pb-3 knbn-container" + (this.props.themeToggled ? " knbn-dark-bg-1x" : " knbn-snow-bg-1x")}>
                <Menu/>
                <div class="row mt-3 knbn-mandatory-margin">
                    <div class="col-xl-4 offset-xl-4">
                        <div class="row">
                            <Header3>Creator raport problemă</Header3>
                        </div>
                    {
                        this.state.projects.length == 0 ? 
                        <div class="row">
                            <Header2>Niciun proiect configurat</Header2>
                            <div class={"col knbn-font-small" + (this.props.themeToggled ? " knbn-dark-color-3x" : " knbn-snow-color-3x")}>Înainte de a adăuga un tichet, creați un proiect, și apoi cel puțin o componentă</div>
                        </div>
                        :
                        this.state.components.length == 0 ? 
                        <div class="row">
                            <Header2>Nicio componentă creată</Header2>
                            <div class={"col knbn-font-small" + (this.props.themeToggled ? " knbn-dark-color-3x" : " knbn-snow-color-3x")}>Înainte de a adăuga un tichet, creați o componentă</div>
                        </div>
                        :
                        <div class="row">
                            <div class="col-xl-12">
                                <InputField 
                                    label="Nume"
                                    value={this.state.name}
                                    description="Numele tichetului"
                                    action={this.setName}
                                />

                                <SelectionField
                                    label="Atașează proiect"
                                    action={this.setProject}
                                    description="Proiect la care tichetul va fi atașat"
                                    value={this.state.project.name}
                                    items={this.state.projects}
                                    currentItem={this.state.project}
                                    imgSrc='./images/project.svg'
                                />

                                <SelectionField
                                    label="Atașează componentă"
                                    action={this.setComponent}
                                    description="Componenta la care tichetul va fi atașat"
                                    value={this.state.component.name}
                                    items={this.state.components}
                                    currentItem={this.state.component}
                                />

                                <PriorityField
                                    description="Prioritatea raportului de problemă"
                                    items={this.props.priorities}
                                    action={this.setPriority}
                                    value={this.state.priority}
                                />

                                <UserField
                                    user={this.state.assignee}
                                    action={this.setAssignee}
                                    label="Prioritatea raportului de problemă"
                                />

                                <TextAreaField
                                    label="Descriere"
                                    action={this.setDescription}
                                    value={this.state.description}
                                    description="Descrierea raportului de problemă"
                                />

                                <TextAreaField
                                    label="Pași de testare"
                                    action={this.setTestSteps}
                                    value={this.state.testSteps}
                                    description="Pașii de testare pentru a reproduce problema"
                                />

                                <TextAreaField
                                    label="Comportament așteptat"
                                    action={this.setExpectedBehavior}
                                    value={this.state.expectedBehavior}
                                    description="Comportamentul așteptat la aplicarea pașilor de testare"
                                />
                                
                                <TextAreaField
                                    label="Comportament observat"
                                    action={this.setObservedBehavior}
                                    value={this.state.observedBehavior}
                                    description="Comportamentul observat la aplicarea pașilor de testare"
                                />

                                <SelectionField
                                    label="Atașează versiune"
                                    action={this.setRelease}
                                    description="Versiune la care raportul de problemă va fi atașat"
                                    value={this.state.release.name}
                                    items={this.state.releases}
                                    currentItem={this.state.release}
                                />
                                
                                <SelectionField
                                    label="Atașează categorie"
                                    action={this.setCategory}
                                    description="Categoria care va fi atașată la raportul de problemă"
                                    value={this.state.category.name}
                                    items={this.state.categories}
                                    currentItem={this.state.category}
                                />  

                                <InputField 
                                    label="Ore de lucru estimate"
                                    value={this.state.estimation}
                                    description="Efortul de muncă estimat in ore"
                                    action={this.setEstimation}
                                />
                                
                                {/* <div class="ticket-section mb-2 d-flex">
                                    <Toggler classToToggle=".knbn-to-collapse"/>
                                    <div class="w-100">
                                        <Label label='Due date'/>
                                        <DatePicker changeDate={this.changeDueDate}/>
                                    </div>
                                </div> */}

                                <Error>{this.state.error}</Error>
                                {
                                    this.state.success ? 
                                    <Success>Raport de problemă adăugat cu succes</Success>
                                    :null
                                }

                                <div class="d-flex flex-row justify-content-center mb-3 ">
                                    <SubmitButton action={this.submitTicket}>Adaugă problemă</SubmitButton>
                                    <CancelButton action={this.resetState}>Anulează</CancelButton>
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
        priorities: state.priorities,
        currentReporter: state.currentReporter
    }
}

export default connect(mapStateToProps)(PRSetup);