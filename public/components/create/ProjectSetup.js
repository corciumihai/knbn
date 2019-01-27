import React from 'react';
import axios from 'axios';
import InputField from './InputField';
import TextAreaField from './TextAreaField';
import { connect } from 'react-redux';
import Error from './Error';
import Header3 from '../editor/Header3';
import Menu from '../Menu';
import SubmitButton from './SubmitButton';
import CancelButton from './CancelButton';
import Container from './Container';
import RemoveItemSmall from '../create/RemoveItemSmall';
import update from 'react-addons-update';
import { callbackify } from 'util';

class ProjectSetup extends React.Component{
    
    constructor(props){
        super(props);

        this.state = {
            projectNames: [],
            name: '',
            description: '',
            nameError: '',
            versions: [],
            categories: [],
            errorVersion: '',
            success: false
        }

        this.setDescription = this.setDescription.bind(this);
        this.submitProject = this.submitProject.bind(this);
        this.setName = this.setName.bind(this);
        this.validate = this.validate.bind(this);
        this.getProjects = this.getProjects.bind(this);
        this.addVersion = this.addVersion.bind(this);
        this.setVersionName = this.setVersionName.bind(this);
        this.removeVersion = this.removeVersion.bind(this);
        this.addCategory = this.addCategory.bind(this);
        this.removeCategory = this.removeCategory.bind(this);
        this.setCategoryName = this.setCategoryName.bind(this);
        this.resetError = this.resetError.bind(this);
    }

    componentWillMount(){
        this.getProjects();
    }

    setName(value){
        this.setState({name: value, nameError: ''}, this.resetError);
    }

    setDescription(value){
        this.setState({description: value}, this.resetError);
    }

    getProjects(){
        axios.get('/get-projects').then(response => {
            this.setState({projectNames: Array.from(response.data, item => item.name.toLowerCase())});
        })
    }

    resetState(){
        this.setState({
            name: '',
            description: '',
            nameError: '',
            currentVersion: '',
            currentCategory: '',
            versions: [],
            categories: [],
            errorCategory: '',
            errorVersion: '',
            success: false
        })
    }

    setVersionName(value){
        this.setState({currentVersion: value, errorVersion: ''});
    }

    setCategoryName(value){
        this.setState({currentCategory: value, errorCategory: ''});
    }

    addVersion(){
        let found = this.state.versions.find(item => {return item.name == this.state.currentVersion});

        if(!found){
            this.setState({currentVersion: '', versions: update(this.state.versions, {$push: [{key: this.state.versions.length, name: this.state.currentVersion, created: new Date()}]})}, () => {

            });
        }
        else{
            this.setState({errorVersion: 'Versiunea este adăugată deja'})
        }
    }

    addCategory(){
        let found = this.state.categories.find(item => {return item.name == this.state.currentCategory});

        if(!found){
            this.setState({currentCategory: '', categories: update(this.state.categories, {$push: [{key: this.state.categories.length, name: this.state.currentCategory, created: new Date()}]})}, () => {

            });
        }
        else{
            this.setState({currentCategory: 'Versiunea este adăugată deja'})
        }
    }

    removeVersion(version){
        this.setState({versions: update(this.state.versions, {$splice: [[this.state.versions.indexOf(this.state.versions.find(item => {return item.key == version.key})), 1]]})})
    }

    removeCategory(category){
        this.setState({categories: update(this.state.categories, {$splice: [[this.state.categories.indexOf(this.state.categories.find(item => {return item.key == category.key})), 1]]})})
    }

    validate(callback){
        if(!this.state.name){
            this.setState({error: 'Introdu un nume'});
        }
        else{
            callback();
        }
    }

    resetError(){
        this.setState({error: '', success: false});
    }

    submitProject(event){
        event.preventDefault();

        this.validate(() => {
            axios.post('/add-project', {
                name: this.state.name,
                description: this.state.description,
                startDate: new Date().getTime(),
                categories: this.state.categories,
                releases: this.state.versions
            })
            .then(response => {
                if(response.status == 200){
                    this.setState({success: true}, this.resetState());
                }
            })
            .catch(error => {
                this.setState({error: error.response.data.error});
            })
        })
    }

    render(){
        return(
            <div class={"container-fluid knbn-bg-transparent knbn-transition pb-3 h-100 knbn-container" + (this.props.themeToggled ? " knbn-dark-bg-1x" : " knbn-snow-bg-1x")}>
                <Menu/>
            {!this.props.isAdmin ? 
                <div class="row mt-3 knbn-mandatory-margin">
                    <div class={"col-xl-4 offset-xl-4 d-flex justify-content-center flex-column" + (this.props.themeToggled ? " knbn-dark-color-2x" : " knbn-snow-color-2x")}>
                        <div class="knbn-font-medium">Drepturi insuficiente</div>
                        <div class="knbn-font-small">Numai administratorii pot crea proiecte noi</div>
                    </div>
                </div>
                :
                <div class="row mt-3 knbn-mandatory-margin">
                    <div class="col-xl-4 offset-xl-4">
                        <div class="row">
                            <Header3>Creator Proiect</Header3>
                        </div>
                    </div>

                    <div class="col-xl-12">
                        <div class="row">
                            <div class="col-xl-4 offset-xl-4">
                                <Error>{this.state.nameError}</Error>
                                <InputField 
                                    label="Nume"
                                    value={this.state.name}
                                    description="Numele proiectului"
                                    action={this.setName}
                                />
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-12">
                        <div class="row">
                            <div class="col-xl-4 offset-xl-4">
                                <TextAreaField
                                    label="Descriere"
                                    action={this.setDescription}
                                    value={this.state.description}
                                    description="Descrierea proiectului"
                                />
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-12">
                        <div class="row">
                            <div class="col-xl-4 offset-xl-4">
                                <InputField
                                    label="Versiuni"
                                    value={this.state.currentVersion}
                                    description="Versiunile SW pe parcursul proiectului"
                                    action={this.setVersionName}
                                />
                                <SubmitButton action={this.addVersion}>Adaugă versiune</SubmitButton>
                                {
                                    this.state.errorVersion ?
                                    <div class={"col-xl-12 knbn-error text-center mt-2" + (this.props.themeToggled ? " knbn-dark-error-color knbn-dark-bg-error" : " knbn-snow-error-color knbn-snow-bg-error")}>
                                        {this.state.errorVersion}
                                    </div>
                                    :
                                    null
                                }
                            </div>
                            <div class="col-xl-4 offset-xl-4 mt-2">
                                <Container>
                                {
                                    this.state.versions.length > 0 ?
                                    this.state.versions.map(version => {
                                        return <RemoveItemSmall key={version.key} classes="my-1" remove={() => {this.removeVersion(version)}}>{version.name}</RemoveItemSmall>
                                    })
                                    :
                                    <div class={"knbn-font-small" + (this.props.themeToggled ? " knbn-dark-color-2x" : " knbn-snow-color-2x")}>Nici o versiune încă</div>
                                    
                                }
                                </Container>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-12">
                        <div class="row">
                            <div class="col-xl-4 offset-xl-4">
                                <InputField
                                    label="Categorii"
                                    value={this.state.currentCategory}
                                    description="Categorii folosite pe parcursul proiectului"
                                    action={this.setCategoryName}
                                />
                                <SubmitButton action={this.addCategory}>Adaugă categorie</SubmitButton>
                                {
                                    this.state.errorCategory ?
                                    <div class={"col-xl-12 knbn-error text-center mt-2" + (this.props.themeToggled ? " knbn-dark-error-color knbn-dark-bg-error" : " knbn-snow-error-color knbn-snow-bg-error")}>
                                        {this.state.errorCategory}
                                    </div>
                                    :
                                    null
                                }
                            </div>
                            <div class="col-xl-4 offset-xl-4 mt-2">
                                <Container>
                                {
                                    this.state.categories.length > 0 ?
                                    this.state.categories.map(category => {
                                        return <RemoveItemSmall key={category.key} classes="my-1" remove={() => {this.removeCategory(category)}}>{category.name}</RemoveItemSmall>
                                    })
                                    :
                                    <div class={"knbn-font-small" + (this.props.themeToggled ? " knbn-dark-color-2x" : " knbn-snow-color-2x")}>Nici o categorie încă</div>
                                }
                                </Container>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-12 mt-3">
                        <div class="row">
                            <div class="col-xl-4 offset-xl-4">
                                <div class="d-flex flex-row justify-content-center mb-3 ">
                                    <SubmitButton action={this.submitProject}>Adaugă proiect</SubmitButton>
                                    <CancelButton action={this.resetState}>Anulează</CancelButton>
                                </div>
                                {
                                    this.state.error ?
                                    <div class={"col-xl-12 knbn-error text-center mt-2" + (this.props.themeToggled ? " knbn-dark-error-color knbn-dark-bg-error" : " knbn-snow-error-color knbn-snow-bg-error")}>
                                        {this.state.error}
                                    </div>
                                    :
                                    null
                                }
                                {this.state.success ?
                                <div class={"col-xl-12 knbn-error text-center" + (this.props.themeToggled ? " knbn-dark-success-color knbn-dark-bg-success" : " knbn-snow-success-color knbn-snow-bg-success")}>
                                    Proiect adăugat cu succes
                                </div>
                                :
                                null
                                }
                            </div>
                        </div>
                    </div>  
                </div>
            }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
        isAdmin: state.isAdmin
    }
}

export default connect(mapStateToProps)(ProjectSetup);