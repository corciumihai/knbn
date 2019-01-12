import React from 'react';
import axios from 'axios';
import InputField from './InputField';
import TextAreaField from './TextAreaField';
import { connect } from 'react-redux';
import Error from './Error';
import Header3 from '../editor/Header3';

class ProjectSetup extends React.Component{
    render(){
        return(
            <div class="container-fluid mt-auto mb-auto col-xl-4 col-sm-8 offset-sm-2 offset-xl-4 col-md-6 offset-md-3 px-2">
                <Header3>Project Creator</Header3>

                <Error>{this.state.nameError}</Error>
                <InputField 
                    label="Name"
                    value={this.state.name}
                    description="Name of the ticket"
                    action={this.setName}
                />

                <TextAreaField
                    label="Description"
                    action={this.setDescription}
                    value={this.state.description}
                    description="Description of the ticket"
                />

                <div class="d-flex flex-row justify-content-center mb-3 ">
                    <button class="ticket-dropdown-btn btn btn-primary mr-2" onClick={this.submitProject}>Add new project</button>
                    <button class="ticket-dropdown-btn btn btn-primary" onClick={this.resetState}>Cancel</button>
                </div>
            </div>
        );
    }

    constructor(props){
        super(props);

        this.state = {
            projectNames: [],
            name: '',
            description: '',
            nameError: '',
        }

        this.setDescription = this.setDescription.bind(this);
        this.submitProject = this.submitProject.bind(this);
        this.setName = this.setName.bind(this);
        this.verify = this.verify.bind(this);
        this.getProjects = this.getProjects.bind(this);
    }

    componentWillMount(){
        this.getProjects();
    }

    setName(value){this.setState({name: value, nameError: ''});}
    setDescription(value){this.setState({description: value});}

    getProjects(){
        axios.get('/get-projects').then(response => {
            this.setState({projectNames: Array.from(response.data, item => item.name.toLowerCase())});
        })
    }

    verify(){
        if(this.state.name == undefined || this.state.name.length == 0){
            this.setState({nameError: 'Enter a project name'});
            return false;
        }

        if(this.state.projectNames.includes(this.state.name.toLowerCase())){
            this.setState({nameError: 'This project name already exists. Please choose another one!'});
            return false;
        }

        return true;
    }

    resetState(){
        this.setState({
            name: '',
            description: '',
            nameError: '',
        })
    }

    submitProject(event){
        event.preventDefault();

        if(this.verify() == true){
            axios.post('/add-project', {
                name: this.state.name,
                description: this.state.description,
                startDate: new Date().getTime(),
            }).then(response => {
                if(response.data.success == true){
                    this.getProjects();
                    this.resetState();
                }
            });
        }
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
    }
}

export default connect(mapStateToProps)(ProjectSetup);