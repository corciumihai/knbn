import React from 'react';
import axios from 'axios';
import InputField from './InputField';
import PriorityField from './PriorityField';
import UserField from './UserField';
import TextAreaField from './TextAreaField';
import SelectionField from './SelectionField';
import { connect } from 'react-redux';
import Header2 from '../editor/Header2';
import Header3 from '../editor/Header3';
import Menu from '../Menu';
import SubmitButton from './SubmitButton';
import CancelButton from './CancelButton';
import Success from '../messages/Success';
import DismissableError from '../messages/DismissableError';
import DatePicker from './DatePicker';
import dateformat from 'dateformat';
import Label from '../editor/Label';
import Small from '../editor/Small';

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
        this.setPriority = this.setPriority.bind(this);
        this.submitTicket = this.submitTicket.bind(this);
        this.setRelease = this.setRelease.bind(this);
        this.setName = this.setName.bind(this);
        this.verify = this.verify.bind(this);
        this.setProject = this.setProject.bind(this);
        this.setDueDate = this.setDueDate.bind(this);
        this.filterProjectDependencies = this.filterProjectDependencies.bind(this);
    }

    componentDidMount(){
        axios.all([
            axios.get('/component/get'),
            axios.get('/tickets/get'),
            axios.get('category/multi/get'),
            axios.get('release/multi/get'),
            axios.get('/project/getall')
        ])
        .then(axios.spread(
            (components, tickets, categories, releases, projects) => {
                if(components.status == 200 && tickets.status == 200 && releases.status == 200 && projects.status == 200){
                    this.setState({
                        components: components.data, filteredComponents: components.data,
                        tickets: tickets.data, filteredTickets: tickets.data,
                        categories: categories.data, filteredCategories: categories.data,
                        releases: releases.data, filteredReleases: releases.data,
                        projects: projects.data,
                        priority: this.props.priorities[0]
                    })
                }
            }
        ))
        .catch(error => {
            this.setState({error: error.response.data.error})
        })
    }

    filterProjectDependencies(){
        if(this.state.project.id){
            this.setState({
                filteredComponents: this.state.components.filter(item => item.project == this.state.project.id),
                filteredCategories: this.state.categories.filter(item => item.project == this.state.project.id),
                filteredReleases: this.state.releases.filter(item => item.project == this.state.project.id),
                filteredTickets: this.state.tickets.filter(item => item.project == this.state.project.id)
            })
        }
        else{
            this.setState({
                filteredComponents: this.state.components,
                filteredCategories: this.state.categories,
                filteredReleases: this.state.releases,
                filteredTickets: this.state.tickets
            })
        }
    }

    setName(value){
        this.setState({name: value});
    }

    setAssignee(user){
        this.setState({assignee: user})
    }

    setProject(project){
        this.setState({project: project}, () => {
            this.filterProjectDependencies();

            if(!project.id){
                this.setComponent({});
                this.setCategory({});
                this.setRelease({});
            }
        });
    }

    setComponent(component){
        this.setState({component: component}, () => {
            if(component.project){
                this.setState({component: component}, this.setProject(this.state.projects.find(item => item.id == component.project)));
            }
        });
    }

    setCategory(category){
        this.setState({category: category}, () => {
            if(category.project){
                this.setProject(this.state.projects.find(item => item.id == category.project));
            }
        });
    }

    setRelease(release){
        this.setState({release: release}, () => {
            if(release.project){
                this.setProject(this.state.projects.find(item => item.id == release.project));
            }
        });
    }

    setDescription(value){
        this.setState({description: value});
    }

    setPriority(prio){
        this.setState({priority: prio})
    }

    setEstimation(value){
        this.setState({estimation: value});
    }

    setDueDate(date){
        this.setState({dueDate: date});
    }

    verify(callback){
        if(this.state.name == undefined || this.state.name.length == 0){
            this.setState({error: 'Introdu numele tichetului'});
        }

        else if(this.state.project.id == undefined || this.state.project.id.length == 0 || this.state.project.id <= 0 ){
            this.setState({error: 'Selectează referința unui proiect'});
        }

        else if(this.state.component.id == undefined || this.state.component.id.length == 0 || this.state.component.id <= 0 ){
            this.setState({error: 'Selectează o referință a unui modul'});
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
            dueDate: new Date(),
            estimation: 0,
            description: '',
            testSteps: '',
            expectedBehavior: '',
            observedBehavior: '',
            priority: this.props.priorities[0],
            release: {},
            project: {},
            error: ''
        })
    }

    submitTicket(event){
        event.preventDefault();

        this.verify(() => {
            axios.post('/ticket/add', {
                name: this.state.name,
                assignee: this.state.assignee.email ? this.state.assignee.email : this.props.currentUser,
                component: this.state.component.id,
                category: this.state.category.id,
                estimation: parseInt(this.state.estimation),
                description: this.state.description,
                reporter: this.state.reporter.email ? this.state.reporter.email : this.props.currentUser,
                priority: this.state.priority.dbName,
                releaseID: this.state.release.id,
                dueDate: new Date(dateformat(this.state.dueDate, 'yyyy-mm-dd')),
                startDate: new Date(),
                lane: 'backlog',
                project: this.state.project.id
            }).then(response => {
                if(response.status == 200){
                    this.setState({success: true}, this.resetState);
                }
            })
            .catch(error => {
                this.setState({error: error.response.data.error});
            })
        })
    }

    render(){
        return(
            <div class={"container-fluid knbn-bg-transparent knbn-transition pb-3 knbn-container" + (this.props.themeToggled ? " knbn-dark-bg-1x" : " knbn-snow-bg-1x")}>
                <Menu/>
                <div class="row mt-3 knbn-mandatory-margin">
                    <div class="col-xl-4 offset-xl-4">
                    {
                        this.state.projects.length == 0 ? 
                        <div class="row">
                            <Header2>Niciun proiect configurat</Header2>
                            <div class={"col knbn-font-small" + (this.props.themeToggled ? " knbn-dark-color-3x" : " knbn-snow-color-3x")}>Înainte de a adăuga un tichet, creați un proiect, și apoi cel puțin un modul</div>
                        </div>
                        :
                        this.state.components.length == 0 ? 
                        <div class="row">
                            <Header2>Nici un modul creat</Header2>
                            <div class={"col knbn-font-small" + (this.props.themeToggled ? " knbn-dark-color-3x" : " knbn-snow-color-3x")}>Înainte de a adăuga un tichet, creați un modul</div>
                        </div>
                        :
                        <div class="row">
                            <div class="col-xl-12">
                                <Header3>Creator Tichet</Header3>

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
                                    imgSrc={this.props.themeToggled ? "./images/project.svg" : "./images/bProject.svg"}
                                />

                                <SelectionField
                                    label="Atașează modul"
                                    action={this.setComponent}
                                    description="Modulul la care tichetul va fi atașat"
                                    value={this.state.component.name}
                                    items={this.state.filteredComponents}
                                    imgSrc={"./images/module.svg"}
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
                                    label="Asignatul sarcinii"
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
                                    items={this.state.filteredReleases}
                                    imgSrc={this.props.themeToggled ? "./images/release.svg" : "./images/bRelease.svg"}
                                    currentItem={this.state.release}
                                />
                                
                                <SelectionField
                                    label="Atașează categorie"
                                    action={this.setCategory}
                                    description="Categoria care va fi atașat tichetul"
                                    value={this.state.category.name}
                                    items={this.state.filteredCategories}
                                    imgSrc={this.props.themeToggled ? "./images/category.svg" : "./images/bCategory.svg"}
                                    currentItem={this.state.category}
                                />  

                                <InputField 
                                    label="Ore de lucru estimate"
                                    value={this.state.estimation}
                                    description="Efortul de muncă estimat in ore"
                                    action={this.setEstimation}
                                />
                                
                                <div class="ticket-section mb-3">
                                    <Label label="Data limită"></Label>
                                    <div class="d-flex">
                                        <div class="mx-auto">
                                            <DatePicker action={this.setDueDate} date={this.state.dueDate}/>
                                        </div>
                                    </div>
                                    
                                    <Small>Ziua limită propusă pentru tichet</Small>
                                </div>

                                {/* <Success>Raport de problemă adăugat cu succes</Success> */}
                                <div class="col">
                                    <DismissableError dismiss={() => {this.setState({error: ''})}}>{this.state.error}</DismissableError>
                                </div>
                                
                                <div class="d-flex flex-row justify-content-center mb-3 ">
                                    <SubmitButton action={this.submitTicket}>Adaugă tichet</SubmitButton>
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
        currentUser: state.currentUser
    }
}

export default connect(mapStateToProps)(TicketSetup);