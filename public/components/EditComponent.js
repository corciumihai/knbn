import React  from 'react';
import EditField from './editor/EditField';
import EditForm from './editor/EditForm';
import EditTextArea from './editor/EditTextArea';
import EditSelection from './editor/EditSelection';
import axios from 'axios';
import EditUser from './editor/EditUser';
import EditDate from './editor/EditDate';
import CommentArea from './comments/CommentArea';
import Header3 from './editor/Header3';
import { connect } from 'react-redux';
import Menu from './Menu';

class EditComponent extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            releases: [],
            filteredReleases: [],
            id: undefined,
            name: '',
            priority: {},
            description: '',
            owner: {},
            release: {},
            canEdit: false
        }

        this.saveRelease = this.saveRelease.bind(this);
        this.saveName = this.saveName.bind(this);
        this.saveDescription = this.saveDescription.bind(this);
        this.savePriority = this.savePriority.bind(this);
        this.saveOwner = this.saveOwner.bind(this);
        this.saveDueDate = this.saveDueDate.bind(this);
    }

    componentWillMount(){
        axios.get('/get-component-data/' + this.props.match.params.id).then( response => {      
            this.setState({
                id: response.data.id,
                priority: this.props.priorities.find(item => {return item.dbName == response.data.priority}),
                description: response.data.description,
                name: response.data.name,
                owner: {email: response.data.owner},
                project: response.data.project,
                canEdit: this.props.isAdmin || this.props.currentUser == response.data.owner,
                release: {id: response.data.releaseID}
            }, () => {
                if(this.state.release.id){
                    axios.get('/release/get/' + this.state.release.id).then( response => {
                        this.setState({
                            release: response.data
                        }, () => {
                            axios.get('release/multi/get').then( response => {
                                this.setState({
                                    releases: response.data,
                                    filteredReleases: response.data.filter(item => {return item.project == this.state.project})
                                })
                            });
                        });
                    });
                }
            });
        });
    }

    componentWillReceiveProps(nextProps, nextState){
        this.setState({canEdit: nextProps.isAdmin || nextProps.currentUser == this.state.owner.email});
    }

    saveRelease(release){
        axios.post('/set-component/release', {
            id: this.state.id, 
            value: release.id
        })
        .then( response => {
            if(response.success == true){
                this.setState({release: release});
            }
        });
    }

    saveName(name){
        axios.post('/set-component/name', {
            id: this.state.id, 
            value: name
        }).then( response => {
            if(response.success == true){
                this.setState({name: name});
            }
        });
    }

    saveDescription(description){
        axios.post('/set-component/desc', {
            id: this.state.id,
            value: description
        })
        .then( response => {
            if(response.success == true){
                this.setState({description: description});
            }
        });
    }

    savePriority(priority){
        axios.post('/set-component/prio', {
            id: this.state.id, 
            value: priority.dbName
        })
        .then( response => {
            if(response.success == true){
                this.setState({priority: priority});
            }
        });
    }

    saveOwner(user){
        axios.post('/component/set-owner', {
            id: this.state.id,
            value: user.email
        })
        .then(response => {
            if(response.status == 200){
                this.setState({owner: {email: user.email}, canEdit: user.email == this.props.currentUser || this.props.isAdmin});
            }
        })
        .catch(error => {
            console.log(error.response.data.error)
        })
    }

    saveDueDate(date){
        axios.post('/set-component/due-date', {
            id: this.state.id, 
            value: date
        })
        .then( response => {
            if(response.success == true){
                this.setState({dueDate: date});
            }
        });
    }

    render(){
        console.log(this.state.canEdit)

        return(
            <div class={"container-fluid knbn-bg-transparent knbn-transition pb-3 h-100 knbn-container" + (this.props.themeToggled ? " knbn-dark-bg-1x" : " knbn-snow-bg-1x")}>
                <Menu/>

                <div class="row mt-3 knbn-mandatory-margin">
                    <Header3>Editor componentă</Header3>
                </div>
                
                <div class="row ">
                    <div class="col-xl-12 col-12">
                        <div class="row">
                            <EditForm>
                                <EditField
                                    value={this.state.name}
                                    canEdit={this.state.canEdit}
                                    label='Nume' 
                                    save={this.saveName}
                                    description='Numele componentei când a fost creată'
                                />

                                <EditTextArea
                                    value={this.state.description}
                                    save={this.saveDescription}
                                    label='Descriere' 
                                    description='Descrierea componentei când a fost creată'
                                    canEdit={this.state.canEdit}
                                />

                                <EditSelection
                                    item={this.state.release}
                                    canEdit={this.state.canEdit}
                                    label="Versiune"
                                    description='Versiunea atașată componentei'
                                    items={this.state.filteredReleases}
                                    save={this.saveRelease}
                                />

                                <EditSelection
                                    item={this.state.priority}
                                    canEdit={this.state.canEdit}
                                    label="Prioritate"
                                    description='Prioritatea componentei'
                                    items={this.props.priorities}
                                    save={this.savePriority}
                                />
                            </EditForm>
                            <EditForm classes={"offset-xl-4"}>
                                <EditUser
                                    label='Editează proprietar'
                                    user={this.state.owner}
                                    save={this.saveOwner}
                                    canEdit={this.state.canEdit || this.state.owner.email == undefined}
                                />
                            </EditForm>
                        </div>
                    </div>

                    {/* <CommentArea id={this.state.id}/> */}
                </div>
            </div>
        );
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