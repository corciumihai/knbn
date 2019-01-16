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
            projectNameError: ''
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
    }

    setName(value){this.setState({name: value, nameError: ''});}

    setAssignee(user){this.setState({assignee: user})}

    setCategory(category){this.setState({category: category});}

    setDescription(value){this.setState({description: value});}

    setPriority(prio){this.setState({priority: prio})};

    setRelease(release){this.setState({release: release});}
    
    setProject(project){this.setState({project: project, projectNameError: ''})}

    fetchTickets(){axios.get('/get-tickets').then(response => {this.setState({tickets: response.data.tickets, filteredTickets: response.data.tickets});});}

    fetchCategories(){axios.get('/get-categories').then(response => {this.setState({categories: response.data, filteredCategories: response.data})});}

    fetchReleases(){axios.get('/get-releases').then(response => {this.setState({releases: response.data})})}

    fetchProjects(){axios.get('/get-projects').then(response => {this.setState({projects: response.data})})}

    setEstimation(value){
        this.setState({estimation: value});
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

    verify(){
        if(this.state.name == undefined || this.state.name.length == 0){
            this.setState({nameError: 'Enter a ticket name'});
            return false;
        }

        if(this.state.project.name == undefined || this.state.project.name.length == 0){
            this.setState({projectNameError: 'Enter a project reference'});
            return false;
        }

        return true;
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

    submitComponent(event){
        event.preventDefault();

        if(this.verify() == true){
            axios.post('/add-cmp', {
                name: this.state.name,
                owner: this.state.assignee.email,
                category: this.state.category.id,
                description: this.state.description,
                priority: this.state.priority.dbName,
                releaseID: this.state.release.id,
                startDate: new Date().getTime(),
                project: this.state.project.id
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
                <Header3>Creator Componentă</Header3>

                <Error>{this.state.nameError}</Error>
                <InputField 
                    label="Nume"
                    value={this.state.name}
                    description="Numele tichetului înregistrat în baza de date"
                    action={this.setName}
                />
                <Error>{this.state.projectNameError}</Error>
                <SelectionField
                    label="Atașează proiect"
                    action={this.setProject}
                    description="Project to be attached to"
                    value={this.state.project.name}
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
                    items={this.state.releases}
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

                <div class="d-flex flex-row justify-content-center mb-3 ">
                    <button class={"ticket-dropdown-btn btn btn-primary mr-2 knbn-border" + (this.props.themeToggled ? " knbn-dark-bg-2x knbn-dark-color-2x knbn-dark-border-2x" : " knbn-snow-bg-2x knbn-snow-color-2x knbn-snow-border-2x")} onClick={this.submitComponent}>Adaugă componentă</button>
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

export default connect(mapStateToProps)(CmpSetup);