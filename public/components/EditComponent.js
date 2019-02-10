import React  from 'react';
import EditField from './editor/EditField';
import EditForm from './editor/EditForm';
import EditTextArea from './editor/EditTextArea';
import EditSelection from './editor/EditSelection';
import axios from 'axios';
import EditUser from './editor/EditUser';
import { Redirect } from 'react-router-dom';
import Header3 from './editor/Header3';
import { connect } from 'react-redux';
import Menu from './Menu';
import DismisableError from './messages/DismisableError';

class EditComponent extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            releases: [],
            categories: [],
            id: undefined,
            name: '',
            priority: {},
            description: '',
            owner: {},
            release: {},
            category: {},
            canEdit: false,
            redirect: false
        }

        this.saveRelease = this.saveRelease.bind(this);
        this.saveName = this.saveName.bind(this);
        this.saveDescription = this.saveDescription.bind(this);
        this.savePriority = this.savePriority.bind(this);
        this.saveOwner = this.saveOwner.bind(this);
        this.saveCategory = this.saveCategory.bind(this);
        this.saveDueDate = this.saveDueDate.bind(this);
    }

    componentDidMount(){
        axios.all([
            axios.get('/component/get/' + this.props.match.params.id)
        ])
        .then(axios.spread((component) => {
                if(component.data.id){
                    this.setState({
                        id: component.data.id,
                        priority: this.props.priorities.find(item => item.dbName == component.data.priority),
                        description: component.data.description,
                        name: component.data.name,
                        release: {id: component.data.releaseID},
                        category: {id: component.data.category},
                        owner: {email: component.data.owner},
                        project: component.data.project,
                        release: {id: component.data.releaseID}
                    }, () => {
                        if(this.state.category.id){
                            axios.get('/category/get/' + this.state.category.id)
                            .then(response => {
                                this.setState({category: response.data});
                            })
                        }

                        if(this.state.release.id){
                            axios.get('/release/get/' + this.state.release.id)
                            .then(response => {
                                this.setState({release: response.data});
                            })
                            .catch(error => {
                                this.setState({error: error.response.data.error})
                            })
                        }

                        if(this.state.project){
                            axios.all([
                                axios.get('/release/multi/get/' + this.state.project),
                                axios.get('/category/multi/get/' + this.state.project)
                            ])
                            .then(axios.spread((releases, categories) => {
                                    if(releases.data){
                                        this.setState({releases: releases.data})
                                    }
                    
                                    if(categories.data){
                                        this.setState({categories: categories.data})
                                    }
                                }
                            ))
                            .catch(error => {
                                this.setState({error: error.response.data.error})
                            })
                        }
                    })
                }
                else{
                    this.setState({redirect: true})
                }
            }
        ))
        .catch(error => {
            this.setState({error: error.response.data.error})
        })
    }

    componentWillReceiveProps(nextProps, nextState){
    }

    saveRelease(release){
        axios.post('/component/set/release', {
            id: this.state.id, 
            value: release.id
        })
        .then(response => {
            if(response.status == 200){
                this.setState({release: release});
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error})
        })
    }

    saveCategory(category){
        axios.post('/component/set/category', {
            id: this.state.id, 
            value: category.id
        })
        .then( response => {
            if(response.status == 200){
                this.setState({category: category});
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error})
        })
    }

    saveName(name){
        axios.post('/component/set/name', {
            id: this.state.id, 
            value: name
        }).then( response => {
            if(response.status == 200){
                this.setState({name: name});
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error})
        })
    }

    saveDescription(description){
        axios.post('/component/set/desc', {
            id: this.state.id,
            value: description
        })
        .then( response => {
            if(response.status == 200){
                this.setState({description: description});
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error})
        })
    }

    savePriority(priority){
        axios.post('/component/set/priority', {
            id: this.state.id, 
            value: priority.dbName
        })
        .then( response => {
            if(response.status == 200){
                this.setState({priority: priority});
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error})
        })
    }

    saveOwner(user){
        axios.post('/component/set/owner', {
            id: this.state.id,
            value: user.email
        })
        .then(response => {
            if(response.status == 200){
                this.setState({owner: {email: user.email}});
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error})
        })
    }

    saveDueDate(date){
        axios.post('/component/set/dueDate', {
            id: this.state.id, 
            value: date
        })
        .then( response => {
            if(response.status == 200){
                this.setState({dueDate: date});
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error})
        })
    }

    render(){
        if(this.state.redirect) {
            return <Redirect to="/"></Redirect>
        }
        else{
            return(
                <div class={"container-fluid knbn-bg-transparent knbn-transition pb-3 h-100 knbn-container" + (this.props.themeToggled ? " knbn-dark-bg-1x" : " knbn-snow-bg-1x")}>
                    <Menu/>

                    <div class="row mt-3 knbn-mandatory-margin">
                        <div class="col-12">
                            <Header3>Editor Modul</Header3>
                        </div>
                    </div>

                    <div class="col-12">
                        <DismisableError dismissError={() => {this.setState({error: ''})}}>{this.state.error}</DismisableError>
                    </div>
                    
                    <div class="row ">
                        <div class="col-xl-12 col-12">
                            <div class="row">
                                <EditForm>
                                    <EditField
                                        value={this.state.name}
                                        canEdit={this.props.isAdmin || this.props.currentUser == this.state.owner.email || this.state.owner.email == undefined}
                                        label='Nume' 
                                        save={this.saveName}
                                        description='Numele modulului'
                                    />

                                    <EditTextArea
                                        value={this.state.description}
                                        save={this.saveDescription}
                                        label='Descriere' 
                                        description='Descrierea modulului'
                                        canEdit={this.props.isAdmin || this.props.currentUser == this.state.owner.email || this.state.owner.email == undefined}
                                    />

                                    <EditSelection
                                        item={this.state.release}
                                        canEdit={this.props.isAdmin || this.props.currentUser == this.state.owner.email || this.state.owner.email == undefined}
                                        label="Versiune"
                                        description='Versiunea atașată modulului'
                                        items={this.state.releases}
                                        save={this.saveRelease}
                                    />

                                    <EditSelection
                                        item={this.state.category}
                                        canEdit={this.props.isAdmin || this.props.currentUser == this.state.owner.email || this.state.owner.email == undefined}
                                        label="Categorie"
                                        description='Categoria atașată modulului'
                                        items={this.state.categories}
                                        save={this.saveCategory}
                                    />

                                    <EditSelection
                                        item={this.state.priority}
                                        canEdit={this.props.isAdmin || this.props.currentUser == this.state.owner.email || this.state.owner.email == undefined}
                                        label="Prioritate"
                                        description='Prioritatea modulului'
                                        items={this.props.priorities}
                                        save={this.savePriority}
                                    />
                                </EditForm>
                                <EditForm classes={"offset-xl-4"}>
                                    <EditUser
                                        label='Editează proprietar'
                                        user={this.state.owner}
                                        save={this.saveOwner}
                                        canEdit={this.props.isAdmin || this.props.currentUser == this.state.owner.email || this.state.owner.email == undefined}
                                    />
                                </EditForm>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
        priorities: state.priorities,
        currentUser: state.currentUser,
        isAdmin: state.isAdmin
    }
}

export default connect(mapStateToProps)(EditComponent);