import React from 'react';
import DropdownSearch from './DropdownSearch';
import Dating from './Dating';
import axios from 'axios';
import { EROFS } from 'constants';

class ComponentSetup extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            projects: [],
            releases: [],
            disciplines: [],

            dueDate: new Date(),
            startDate: new Date(),
            projectName: '',
            projectId: '',
            releaseName: '',
            releaseId: '',
            description: '',
            disciplineId: '',
            disciplineName: '',

            projectError: '',
            releaseError: '',
        }

        this.setProject = this.setProject.bind(this);
        this.setDueDate = this.setDueDate.bind(this);
        this.setStartDate = this.setStartDate.bind(this);
        this.setDescription = this.setDescription.bind(this);
        this.setRelease = this.setRelease.bind(this);
        this.setDiscipline = this.setDiscipline.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentDidMount(){
        axios.get('/get-projects').then(response => {this.setState({projects: response.data});});
        axios.get('/get-releases').then(response => {this.setState({releases: response.data});})
        axios.get('/get-disciplines').then(response => {this.setState({disciplines: response.data});});
    }

    setDescription(event){this.setState({description: event.target.value}, () => {this.setState({descriptionWarning: ''});});}
    setProject(project){this.setState({projectName: project.value, projectId: project.key}, () => {this.setState({projectError: ''});});}
    setRelease(release){this.setState({releaseName: release.value, releaseId: release.key}, () => {this.setState({releaseError: ''});})}
    setDiscipline(discipline){this.setState({disciplineName: discipline.value, disciplineId: discipline.key});}
    setDueDate(date){this.setState({dueDate: date});}
    setStartDate(date){this.setState({startDate: date});}

    submit(event){
        event.preventDefault();
        if(this.props.name == undefined || this.props.name.length == 0){
            this.props.setError('Name is empty');
            return;
        }

        if(this.state.projectId == undefined || this.state.projectId.length == 0){
            this.setState({projectError: 'Project name or id is empty! Please select a project!'}); return;
        }
        if(this.state.releaseId == undefined || this.state.releaseId.length == 0){
            this.setState({releaseError: 'Please select a release'}); return;
        }

        axios.post('/add/component', {
            name: this.props.name,
            dueDate: this.state.dueDate.getTime(),
            startDate: this.state.startDate.getTime(),
            description: this.state.description,
            project: this.state.projectId,
            rel: this.state.releaseId,
            discipline: this.state.disciplineId,
        }).then(response => {
            if(response.status == 200){
                this.setState({
                    dueDate: new Date(),
                    startDate: new Date(),
                    projectName: '',
                    projectId: '',
                    releaseName: '',
                    releaseId: '',
                    description: '',
                    disciplineId: '',
                    disciplineName: '',
                    projectError: '',
                    releaseError: '',
                });
                this.props.resetName();
            }
        }).catch(error => {
            if(error.response == undefined){return;}
            this.props.setError(error.response.data.error);
        })
    }

    render(){
        return(
            <div class="component">
                <div class="row pb-3 pt-3 mb-2">
                    <div class="col-xl-3 pr-0 info mb-xl-0 mb-2">
                        <div class="row d-flex h-100">
                            <div class="col d-flex"><span class="align-self-center">Belongs to project</span></div>
                        </div>
                    </div>
                    <div class="col-xl-6">
                        <DropdownSearch list={this.state.projects} item={{value: this.state.projectName, key: this.state.projectId}} onClick={this.setProject} placeholder="Project name"/>
                        {
                            this.state.projectError != undefined && this.state.projectError.length > 0 ?
                                <div class="col-xl-12"><span class="error row">{this.state.projectError}</span></div>
                                :   
                                null
                        }
                    </div>
                </div>

                <div class="row pb-3 pt-3 mb-2">
                    <div class="col-xl-3 pr-0 info mb-xl-0 mb-2">
                        <div class="row d-flex h-100">
                            <div class="col d-flex"><span class="align-self-center">Description</span></div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group mb-0">
                            <textarea type="text" class="form-control" placeholder="Description" onChange={this.setDescription} value={this.state.description}/>
                        </div>
                        {
                            this.state.descriptionWarning != undefined && this.state.descriptionWarning.length > 0 ? 
                                <div class="col-xl-12"><span class="warning row">{this.state.descriptionWarning}</span></div>
                                :   
                                null
                        }
                    </div>
                </div>

                <div class="row pb-3 pt-3 mb-2">
                    <div class="col-xl-3 pr-0 info mb-xl-0 mb-2">
                        <div class="row d-flex h-100">
                            <div class="col d-flex"><span class="align-self-center">Release</span></div>
                        </div>
                    </div>
                    <div class="col-xl-6">
                        <DropdownSearch list={this.state.releases} item={{value: this.state.releaseName, key: this.state.releaseId}} onClick={this.setRelease} placeholder="Release" />
                        {
                            this.state.releaseError != undefined && this.state.releaseError.length > 0 ?
                            <div class="col-xl-12"><span class="error row">{this.state.releaseError}</span></div>
                            :   
                            null
                        }
                    </div>
                </div>

                <div class="row pb-3 pt-3 mb-2">
                    <div class="col-xl-3 pr-0 info mb-xl-0 mb-2">
                        <div class="row d-flex h-100">
                            <div class="col d-flex"><span class="align-self-center">Discipline</span></div>
                        </div>
                    </div>
                    <div class="col-xl-6">
                        <DropdownSearch list={this.state.disciplines} item={{value: this.state.disciplineName, key: this.state.disciplineId}} onClick={this.setDiscipline} placeholder="Discipline" />
                    </div>
                </div>

                <div class="row pb-3 pt-3 mb-2">
                    <div class="col-xl-3 pr-0 info mb-xl-0 mb-2">
                        <div class="row d-flex h-100">
                            <div class="col d-flex"><span class="align-self-center">Start date</span></div>
                        </div>
                    </div>
                    <div class="col-xl-9">
                        <div class="row">
                            <div class="col">
                                <Dating setDate={this.setStartDate} date={this.state.startDate}/>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row pb-3 pt-3 mb-2">
                    <div class="col-xl-3 pr-0 info mb-xl-0 mb-2">
                        <div class="row d-flex h-100">
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

                <div class="no-back row mb-2 pt-3 justify-content-center">
    
                    <div class="col-xl-12 d-flex justify-content-center">                       
                        <button class="submit btn" onClick={this.submit}>Submit</button> 
                    </div> 
                    
                </div>
            </div>
        );
    }
}

export default ComponentSetup;