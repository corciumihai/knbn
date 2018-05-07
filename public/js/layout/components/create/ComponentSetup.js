import React from 'react';
import DropdownSearch from './DropdownSearch';
import Dating from './Dating';
import axios from 'axios';

class ComponentSetup extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            projects: [],

            dueDate: new Date(),
            startDate: new Date(),
            projectName: undefined,
            projectId: undefined,
            description: undefined,

            projectError: undefined,
            descriptionWarning: undefined,

            hasWarning: false,
            hasError: false,
        }

        this.setProject = this.setProject.bind(this);
        this.setDueDate = this.setDueDate.bind(this);
        this.setStartDate = this.setStartDate.bind(this);
        this.setDescription = this.setDescription.bind(this);
        this.checkValues = this.checkValues.bind(this);
        this.submit = this.submit.bind(this);
    }

    setDescription(event){
        let text = event.target.value;

        this.setState({description: text}, () => {
            this.setState({descriptionWarning: '', hasWarning: false});
        });
    }

    setProject(project){
        this.setState({projectName: project.value, projectId: project.key}, () => {
            this.setState({projectError: ''});
        });
    }

    componentDidMount(){
        axios.get('/get-projects').then(response => {
            this.setState({projects: response.data});
        });
    }

    setDueDate(date){
        this.setState({dueDate: date});
    }

    setStartDate(date){
        this.setState({startDate: date});
    }

    checkValues(event){
        // console.log('click');
        event.preventDefault();
        if(this.props.name == undefined || this.props.name.length == 0){
            this.props.setError('Name is empty');
            return;
        }

        if(this.state.projectName == undefined || this.state.projectId == undefined || this.state.projectName.length == 0 || this.state.projectId.length == 0){
            this.setState({projectError: 'Project name or id is empty! Please select a project!'});
            return;
        }

        if(this.state.description == undefined || this.state.description.length == 0){
            this.setState({descriptionWarning: 'Description is empty! Having a description is optional'}, () => {
                this.setState({hasWarning: true});
            });
            return;
        }

        return true;

    }

    submit(){
        console.log('Submitted');
    }

    render(){
        return(
            <div class="component">
                <div class="row pb-3 pt-3 mb-2">
                    <div class="col-xl-2 info">Belongs to (*)</div>
                    <div class="col">
                        <DropdownSearch list={this.state.projects} item={{value: this.state.projectName, key: this.state.projectId}} change={this.setProject} placeholder="Project name"/>
                        {
                            this.state.projectError != undefined && this.state.projectError.length > 0 ?
                                <div class="col-xl-12"><span class="error row">{this.state.projectError}</span></div>
                                :   
                                null
                        }
                    </div>
                </div>

                <div class="row pb-3 pt-3 mb-2">
                    <div class="col-xl-2 info">Description</div>
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
                    <div class="col-xl-2 info">Labels</div>
                    <div class="col">
                        <div class="form-group mb-0">
                            <input type="text" class="form-control" placeholder="Label name"/>
                        </div>
                    </div>
                </div>

                <div class="row pb-3 pt-3 mb-2">
                    <div class="col-xl-2 info">Due date (*)</div>
                    <div class="col-xl-10">
                        <div class="row">
                            <Dating setDate={this.setDueDate} dueDate={this.state.dueDate}/>
                        </div>
                    </div>
                </div>

                <div class="row pb-3 pt-3 mb-2">
                    <div class="col-xl-2 info">Start date (*)</div>
                    <div class="col-xl-10">
                        <div class="row">
                            <Dating setDate={this.setStartDate} dueDate={this.state.startDate}/>
                        </div>
                    </div>
                </div>

                <div class="no-back row mb-2 pt-3 justify-content-center">
                    {
                        this.state.hasWarning ? 
                            <div class="col-12 d-flex justify-content-center">
                                <div class="row">
                                    <span class="optional col-xl-12 mb-2">This component has one or more optional fields incomplete. Proceed?</span>
                                    <div class="col-xl-12 d-flex justify-content-center">
                                        <button class="submit btn" onClick={this.submit}>Submit</button> 
                                    </div>
                                </div>
                            </div>
                            :     
                            <div class="col-xl-12 d-flex justify-content-center">                       
                                <button class="submit btn" onClick={this.checkValues}>Submit</button> 
                            </div> 
                    }
                </div>
            </div>
        );
    }
}

export default ComponentSetup;