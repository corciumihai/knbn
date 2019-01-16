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
            <div class="mt-3 mb-auto col-xl-4 col-sm-8 offset-sm-2 offset-xl-4 col-md-6 offset-md-3 px-2">
                <Header3>Creator Proiect</Header3>

                <Error>{this.state.nameError}</Error>
                <InputField 
                    label="Nume"
                    value={this.state.name}
                    description="Numele proiectului"
                    action={this.setName}
                />

                <TextAreaField
                    label="Descriere"
                    action={this.setDescription}
                    value={this.state.description}
                    description="Descrierea proiectului"
                />

                <div class="d-flex flex-row justify-content-center mb-3 ">
                    <button class={"ticket-dropdown-btn btn btn-primary mr-2 knbn-border" + (this.props.themeToggled ? " knbn-dark-bg-2x knbn-dark-color-2x knbn-dark-border-2x" : " knbn-snow-bg-2x knbn-snow-color-2x knbn-snow-border-2x")} onClick={this.submitProject}>Adaugă proiect</button>
                    <button class={"ticket-dropdown-btn btn btn-primary" + (this.props.themeToggled ? " knbn-dark-bg-2x knbn-dark-color-2x knbn-dark-border-2x" : " knbn-snow-bg-2x knbn-snow-color-2x knbn-snow-border-2x")} onClick={this.resetState}>Anulează</button>
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
            this.setState({nameError: 'Introdu numele proiectului'});
            return false;
        }

        if(this.state.projectNames.includes(this.state.name.toLowerCase())){
            this.setState({nameError: 'Numele acestui proiect există deja. Alege alt nume'});
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