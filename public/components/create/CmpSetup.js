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
import SubmitButton from './SubmitButton';
import CancelButton from './CancelButton';
import Success from '../messages/Success';

class CmpSetup extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            name: '',
            users: [],
            releases: [],
            assignee: {},
            category: {},
            categories: [],
            description: '',
            priority: {},
            release: {},
            nameError: '',
            project: {},
            projectNameError: '',
            projects: [],
            filteredReleases: []
        }

        this.setAssignee = this.setAssignee.bind(this);
        this.setCategory = this.setCategory.bind(this);
        this.setDescription = this.setDescription.bind(this);
        this.fetchCategories = this.fetchCategories.bind(this);
        this.setPriority = this.setPriority.bind(this);
        this.submitComponent = this.submitComponent.bind(this);
        this.setRelease = this.setRelease.bind(this);
        this.fetchReleases = this.fetchReleases.bind(this);
        this.setName = this.setName.bind(this);
        this.setProject = this.setProject.bind(this);
        this.verify = this.verify.bind(this);
        this.fetchProjects = this.fetchProjects.bind(this);
        this.resetError = this.resetError.bind(this);
    }

    setName(value){this.setState({name: value}, this.resetError);}

    setAssignee(user){this.setState({assignee: user}, this.resetError)}

    setCategory(category){this.setState({category: category}, this.resetError);}

    setDescription(value){this.setState({description: value}, this.resetError);}

    setPriority(prio){this.setState({priority: prio}, this.resetError)};

    setRelease(release){this.setState({release: release}, this.resetError);}
    
    setProject(project){
        this.setState({project: project}, () => {
            this.state.project.id ? 
            this.setState({filteredReleases: this.state.releases.filter(item => {return item.project == this.state.project.id}, this.resetError)})
            :
            this.setState({filteredReleases: this.state.releases})
        });
    }

    fetchTickets(){
        axios.get('/get-tickets')
        .then(response => {
            this.setState({
                tickets: response.data.tickets, 
                filteredTickets: response.data.tickets
            });
        });
    }

    fetchCategories(){
        axios.get('/get-categories')
        .then(response => {
            this.setState({
                categories: response.data, 
                filteredCategories: response.data
            });
        });
    }

    fetchReleases(){
        axios.get('/get-releases')
        .then(response => {
            this.setState({
                releases: response.data, 
                filteredReleases: response.data
            })
        })
    }

    fetchProjects(){axios.get('/get-projects').then(response => {this.setState({projects: response.data})})}

    setEstimation(value){
        this.setState({estimation: value}, this.resetError);
    }

    componentWillMount(){
        this.fetchReleases();
        this.fetchCategories();
        this.fetchProjects();

        this.setState({priority: this.props.priorities[0]});
    }

    componentWillReceiveProps(nextProps, nextState){
        this.setState({priority: nextProps.priorities[0]});
    }

    verify(callback){
        if(this.state.name == undefined || this.state.name.length == 0){
            this.setState({error: 'Introdu numele componentei'});
        }

        else if(this.state.project.name == undefined || this.state.project.name.length == 0){
            this.setState({error: 'Introdu o referință pentru proiect'});
        }

        else if(this.state.release.project != this.state.project.id){
            this.setState({error: "Versiunea nu există pentru proiectul selectat"})
        }
        
        else{
            callback();
        }
    }

    resetState(){
        this.setState({
            name: '',
            assignee: {},
            component: {},
            category: {},
            estimation: 0,
            description: '',
            priority: this.props.priorities[0],
            release: {},
            nameError: '',
            project: {}
        })
    }

    resetError(){
        this.setState({error: ''});
    }

    submitComponent(event){
        event.preventDefault();

        this.verify(() => {
            axios.post('/component/add-component', {
                name: this.state.name,
                owner: this.state.assignee.email,
                category: this.state.category.id,
                description: this.state.description,
                priority: this.state.priority.dbName,
                releaseID: this.state.release.id,
                startDate: new Date().getTime(),
                project: this.state.project.id
            }).then(response => {
                if(response.status == 200){
                    this.setState({success: 'Componentă adăugată cu succes'}, this.resetState);
                }
            });
        })
    }

    render(){
        return(
            <div class={"container-fluid knbn-bg-transparent knbn-transition pb-3 knbn-container" + (this.props.themeToggled ? " knbn-dark-bg-1x" : " knbn-snow-bg-1x")}>
                <Menu/>
            
                <div class="row mt-3 knbn-mandatory-margin">
                    <div class="col-xl-4 offset-xl-4">
                        <div class="row">
                            <Header3>Creator Componentă</Header3>
                        </div>
                        {
                            this.state.projects.length == 0 ? 
                            <div class="row">
                                <Header2>Niciun proiect configurat</Header2>
                                <div class={"col knbn-font-small" + (this.props.themeToggled ? " knbn-dark-color-3x" : " knbn-snow-color-3x")}>Înainte de a adăuga o componentă, creați un proiect</div>
                            </div>
                            :
                            <div class="row">
                                <div class="col-xl-12">
                                    <InputField 
                                        label="Nume"
                                        value={this.state.name}
                                        description="Numele tichetului înregistrat în baza de date"
                                        action={this.setName}
                                    />
                                    <SelectionField
                                        label="Atașează proiect"
                                        action={this.setProject}
                                        description="Project to be attached to"
                                        items={this.state.projects}
                                        currentItem={this.state.project}
                                    />

                                    <PriorityField
                                        description="Prioritatea componentei"
                                        items={this.props.priorities}
                                        action={this.setPriority}
                                        value={this.state.priority}
                                    />

                                    <UserField
                                        user={this.state.assignee}
                                        action={this.setAssignee}
                                        label="Proprietarul curent al componentei"
                                    />

                                    <TextAreaField
                                        label="Descriere"
                                        action={this.setDescription}
                                        value={this.state.description}
                                        description="Descrierea componentei"
                                    />

                                    <SelectionField
                                        label="Atașează versiune"
                                        action={this.setRelease}
                                        description="Versiune la care se atașează componenta"
                                        value={this.state.release.name}
                                        items={this.state.filteredReleases}
                                        currentItem={this.state.release}
                                    />
                                    
                                    <SelectionField
                                        label="Atașează categorie"
                                        action={this.setCategory}
                                        description="Categoria componentei"
                                        value={this.state.category.name}
                                        items={this.state.categories}
                                        currentItem={this.state.category}
                                    />  
                                    
                                    <Error>{this.state.error}</Error>
                                    <Success>{this.state.success}</Success>

                                    <div class="d-flex flex-row justify-content-center mb-3 ">
                                        <SubmitButton action={this.submitComponent}>Adaugă componentă</SubmitButton>
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
        priorities: state.priorities
    }
}

export default connect(mapStateToProps)(CmpSetup);