import React from 'react';
import { connect } from 'react-redux';
import Menu from '../Menu';
import Header3 from './Header3';
import axios from 'axios';
import EditForm from './EditForm';
import EditField from './EditField';
import DismissableError from '../messages/DismissableError';
import EditTextArea from './EditTextArea';
import ImmutableField from './ImmutableField';
import dateformat from 'dateformat';
import RemoveItem from '../create/RemoveItem';
import Label from './Label';
import Small from './Small';
import InputField from '../create/InputField';
import update from 'react-addons-update';
import InputWithButton from './InputWithButton';

class EditProject extends React.Component{
    constructor(){
        super();

        this.state = {
            error: '',
            id: undefined,
            wip: 0,
            description: '',
            name: '',
            startDate: new Date(),
            loading: true,
            canEdit: false,
            categories: [],
            releases: []
        }

        this.saveName = this.saveName.bind(this);
        this.saveWip = this.saveWip.bind(this);
        this.saveDescription = this.saveDescription.bind(this);
        this.addCategory = this.addCategory.bind(this);
        this.addRelease = this.addRelease.bind(this);
        this.refreshCategories = this.refreshCategories.bind(this);
        this.removeCategory = this.removeCategory.bind(this);
        this.removeRelease = this.removeRelease.bind(this);
        this.refreshReleases = this.refreshReleases.bind(this);
    }

    componentDidMount(){
        axios.all([
            axios.get('/project/get/' + this.props.match.params.id),
            axios.get('/project/get/categories/' + this.props.match.params.id),
            axios.get('/project/get/releases/' + this.props.match.params.id)
        ])
        .then(axios.spread((response, categories, releases) => {
            this.setState({
                id: this.props.match.params.id,
                wip: response.data.wip,
                description: response.data.description,
                name: response.data.name,
                startDate: response.data.startDate,
                canEdit: this.props.isAdmin,
                categories: categories.data.sort((a, b) => a.name == b.name),
                releases: releases.data.sort((a, b) => a.name == b.name),
                loading: false,
            })
        }))
        .catch(error => {
            this.setState({error: error.response.data.error});
        })
    }

    componentWillReceiveProps(nextProps, nextState){
        this.setState({canEdit: nextProps.isAdmin});
    }

    saveName(value){
        axios.post('/project/set/name', {id: this.state.id, value: value})
        .then(response => {
            if(response.status == 200){
                this.setState({name: value});
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error});
        })
    }

    saveWip(value){
        let regex = /[0-9]+/;
        if(regex.test(value)){
            axios.post('/project/set/wip', {id: this.state.id, value: value})
            .then(response => {
                if(response.status == 200){
                    this.setState({wip: value});
                }
            })
            .catch(error => {
                this.setState({error: error.response.data.error});
            })
        }
        else{
            this.setState({wip: this.state.wip, error: ' Introdu doar valori numerice in câmpul limitei de muncă. "' + value + '" e invalid'});
        }
        
    }

    saveDescription(value){
        axios.post('/project/set/desc', {id: this.state.id, value: value})
        .then(response => {
            if(response.status == 200){
                this.setState({description: value});
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error});
        })
    }

    addCategory(category){
        let regex = /[a-zA-Z0-9\s]+/;

        if(regex.test(category)){
            axios.post('/project/add/category', {project: this.state.id, name: category})
            .then(response => {
                if(response.status == 200){
                    this.refreshCategories();
                }
            })
            .catch(error => {
                this.setState({error: error.response.data.error});
            })
        }
        else{
            this.setState({error: 'Valoarea "' + category + '" pentru o categorie nu este validă'})
        }
    }

    addRelease(release){
        let regex = /[a-zA-Z0-9\s]+/;

        if(regex.test(release)){
            axios.post('/project/add/release', {project: this.state.id, name: release})
            .then(response => {
                if(response.status == 200){
                    this.refreshReleases();
                }
            })
            .catch(error => {
                this.setState({error: error.response.data.error});
            })
        }
        else{
            this.setState({error: 'Valoarea "' + release + '" pentru o versiune nu este validă'})
        }
    }

    removeCategory(category){
        axios.post('/project/remove/category', {id: category.id})
        .then(response => {
            if(response.status == 200){
                this.refreshCategories();
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error});
        })
    }

    removeRelease(release){
        axios.post('/project/remove/release', {id: release.id})
        .then(response => {
            if(response.status == 200){
                this.refreshReleases();
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error});
        })
    }

    refreshCategories(){
        axios.get('/project/get/categories/' + this.props.match.params.id)
        .then(response => {
            this.setState({categories: response.data.sort((a, b) => a.name == b.name)});
        })
        .catch(error => {
            this.setState({error: error.response.data.error});
        })
    }

    refreshReleases(){
        axios.get('/project/get/releases/' + this.props.match.params.id)
        .then(response => {
            this.setState({releases: response.data.sort((a, b) => a.name == b.name)});
        })
        .catch(error => {
            this.setState({error: error.response.data.error});
        })
    }

    render(){
        return(
            <div class={"container-fluid knbn-bg-transparent knbn-transition knbn-container pb-3 h-100" + (this.props.themeToggled ? " knbn-dark-bg-1x" : " knbn-snow-bg-1x")}>
                <Menu/>

                <div class="row knbn-mandatory-margin">
                    <div class="col-12">
                        <Header3>Editor proiect</Header3>
                    </div>
                </div>

                <DismissableError dismiss={() => {this.setState({error: ''})}}>{this.state.error}</DismissableError>

                <div class="row">
                    <div class="col-xl-12 col-12">
                        <div class="row">
                            <EditForm>
                                <EditField
                                    value={this.state.name}
                                    label='Nume' 
                                    save={this.saveName}
                                    description='Numele proiectului vizualizat'
                                    canEdit={this.state.canEdit}
                                />

                                <EditField
                                    value={this.state.wip}
                                    label='Limita de muncă' 
                                    save={this.saveWip}
                                    description='Limita tichetelor din coloana de progres'
                                    canEdit={this.state.canEdit}
                                />

                                <EditTextArea
                                    value={this.state.description}
                                    save={this.saveDescription}
                                    canEdit={this.state.canEdit}
                                    label='Descriere' 
                                    description='Descrierea proiectului'
                                />
                                <Label label="Versiuni"></Label>
                                {
                                    <div class={"col knbn-border pt-3 pb-2 knbn-transition" + (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-2x")}>
                                        {
                                            this.props.isAdmin ? 
                                            <InputWithButton label="Adaugă versiune" action={this.addRelease}></InputWithButton>
                                            :
                                            null
                                        }
                                        <div class="knbn-max-h-200 knbn-overflow knbn-transition">
                                        {
                                            this.state.releases.map(item => {
                                                return <RemoveItem key={item.id} remove={() => {this.removeRelease(item)}} canEdit={this.state.canEdit} classes={"mb-1"}>{item.name}</RemoveItem>
                                            })
                                        }
                                        </div>
                                    </div>
                                    
                                }
                                <Small>Configurează versiuni pentru acest proiect</Small>
                            </EditForm>
                            <EditForm classes={"offset-xl-4"}>
                            {
                                this.state.startDate != undefined ?
                                <ImmutableField
                                    label='Dată creare'
                                    description='Data când a fost creat proiectul'
                                >{dateformat(new Date(this.state.startDate), "dddd \u00B7 d mmmm \u00B7 yyyy")}</ImmutableField> : null
                                
                            }

                            <Label label="Categorii"></Label>
                            {
                                <div class={"col knbn-border pt-3 pb-2 knbn-transition" + (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-2x")}>
                                {
                                    this.props.isAdmin ? 
                                    <InputWithButton label="Adaugă categorie" action={this.addCategory}></InputWithButton>
                                    :
                                    null
                                }
                                    
                                    <div class="knbn-max-h-200 knbn-overflow knbn-transition">
                                    {
                                        this.state.categories.map(item => {
                                            return <RemoveItem key={item.id} remove={() => {this.removeCategory(item)}} canEdit={this.state.canEdit} classes={"mb-1"}>{item.name}</RemoveItem>
                                        })
                                    }
                                    </div>
                                </div>
                            }
                            <Small>Configurează categorii pentru acest proiect</Small>
                            
                            </EditForm>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        themeToggled: state.themeToggled,
        currentUser: state.currentUser,
        isAdmin: state.isAdmin
    }
}

export default connect(mapStateToProps)(EditProject);