import React  from 'react';
import EditField from './EditField';
import EditForm from './EditForm';
import EditTextArea from './EditTextArea';
import EditSelection from './EditSelection';
import axios from 'axios';
import EditUser from './EditUser';
import EditDate from './EditDate';
import { connect } from 'react-redux';
import Header3 from './Header3';
import CommentArea from '../comments/CommentArea';
import ImmutableField from './ImmutableField';
import dateformat from 'dateformat';
import Menu from '../Menu';
import LoadingScreen from '../../components/LoadingScreen';
import CommentInsert from '../comments/CommentInsert';

class EditTicket extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            releases: [],
            id: undefined,
            name: '',
            priority: {},
            description: '',
            assignee: {},
            reporter: {},
            release: {},
            startDate: undefined, 
            estimation: 0,
            comments: [],
            loadingData: true,
            loadingRelease: true,
            loadingReleases: true
        }

        this.saveRelease = this.saveRelease.bind(this);
        this.saveName = this.saveName.bind(this);
        this.saveDescription = this.saveDescription.bind(this);
        this.savePriority = this.savePriority.bind(this);
        this.saveAssignee = this.saveAssignee.bind(this);
        this.saveDueDate = this.saveDueDate.bind(this);
        this.saveReporter = this.saveReporter.bind(this);
        this.saveEstimation = this.saveEstimation.bind(this);
        this.fetchComments = this.fetchComments.bind(this);
        this.addComment = this.addComment.bind(this);
    }

    componentWillMount(){
        axios.get('/get-ticket-data/' + this.props.match.params.id).then( response => {      
            this.setState({
                id: response.data.id,
                priority: this.props.priorities.find(item => {return item.dbName == response.data.priority}),
                description: response.data.description,
                name: response.data.name,
                assignee: {email: response.data.assignee},
                reporter: {email: response.data.reporter},
                startDate: response.data.startDate, 
                estimation: response.data.estimation,
                loadingData: false
            });

            axios.get('/get-release/' + response.data.releaseID).then(response => {
                this.setState({
                    release: response.data, loadingRelease: false
                });
            });
        });        

        axios.get('/get-releases').then( response => {
            this.setState({
                releases: response.data,
                loadingReleases: false
            })
        });

        this.fetchComments();
    }

    fetchComments(){
        axios.get('/ticket/get-comments/' + this.props.match.params.id).then( response => {
            this.setState({
                comments: response.data,
                loadingComments: false
            })
        });
    }

    addComment(value){
        if(value){
            axios.post('/ticket/add-comment', {
                owner: this.props.currentUser,
                ticket: this.props.match.params.id,
                created: new Date(),
                value: value
            })
            .then(response => {
                if(response.status == 200){
                    this.fetchComments();
                }
            })
        }
    }

    saveName(name){
        axios.post('/set-ticket/name', {
            id: this.state.id, 
            value: name
        }).then( response => {
            if(response.data.success == true){
                this.setState({name: name});
            }
        });
    }

    saveDescription(description){
        axios.post('/set-ticket/description', {
            id: this.state.id,
            value: description
        })
        .then( response => {
            if(response.data.success == true){
                this.setState({description: description});
            }
        });
    }

    saveRelease(release){        
        axios.post('/set-ticket/release', {
            id: this.state.id, 
            value: release.id
        })
        .then( response => {
            if(response.data.success == true){
                this.setState({release: release});
            }
        });
    }

    savePriority(priority){
        axios.post('/set-ticket/priority', {
            id: this.state.id, 
            value: priority.dbName
        })
        .then( response => {
            if(response.data.success == true){
                this.setState({priority: priority});
            }
        });
    }

    saveAssignee(user){
        axios.post('/set-ticket/assignee', {
            id: this.state.id,
            value: user.email
        })
        .then( response => {
            if(response.data.success == true){
                this.setState({assignee: user});
            }
        });
    }

    saveReporter(user){     
        axios.post('/set-ticket/reporter', {
            id: this.state.id,
            value: user.email
        })
        .then( response => {
            if(response.data.success == true){
                this.setState({reporter: user});
            }
        });
    }

    saveDueDate(date){
        axios.post('/set-component/due-date', {
            id: this.state.id, 
            date: date
        })
        .then( response => {
            if(response.data.success == true){
                this.setState({dueDate: date});
            }
        });
    }

    saveEstimation(value){
        axios.post('/set-component/estimation', {
            id: this.state.id, 
            value: value
        })
        .then( response => {
            if(response.data.success == true){
                this.setState({dueDate: date});
            }
        });
    }

    render(){
        let loading = this.state.loadingData && this.state.loadingRelease && this.state.loadingReleases && this.state.loadingComments;
        return(
            <div class={"container-fluid knbn-bg-transparent knbn-transition knbn-container pb-3 h-100" + (this.props.themeToggled ? " knbn-dark-bg-1x" : " knbn-snow-bg-1x")}>
                <Menu/>
                
                    <div class="row mt-3">
                        <Header3>Editor tichet</Header3>
                    </div>

                    {
                        loading? 
                        <LoadingScreen/>
                        :
                        <div class="row">
                            <div class="col-xl-12 col-12">
                                <div class="row">
                                    <EditForm>
                                        <EditField
                                            value={this.state.name}
                                            label='Nume' 
                                            save={this.saveName}
                                            description='Numele tichetului când a fost creat'
                                        />

                                        <EditTextArea
                                            value={this.state.description}
                                            save={this.saveDescription}
                                            label='Descriere' 
                                            description='Descrierea tichetului când a fost creat'
                                            canEdit={true}
                                        />

                                        <EditSelection
                                            item={this.state.release}
                                            label="Versiune"
                                            description='Versiunea atașată tichetului'
                                            items={this.state.releases}
                                            save={this.saveRelease}
                                        />

                                        <EditSelection
                                            item={this.state.priority}
                                            label="Prioritate"
                                            description='Prioritatea tichetului'
                                            items={this.props.priorities}
                                            save={this.savePriority}
                                        />

                                        <EditField
                                            value={this.state.estimation}
                                            label='Estimare' 
                                            save={this.saveEstimation}
                                            description='Estimare timp pentru rezolvarea tichetului'
                                        />
                                    </EditForm>
                                    <EditForm classes={"offset-xl-4"}>
                                        <EditUser
                                            label='Reporter'
                                            user={this.state.reporter}
                                            save={this.saveReporter}
                                            description="Reporter tichetului"
                                        />

                                        <EditUser
                                            label='Proprietar'
                                            user={this.state.assignee}
                                            save={this.saveAssignee}
                                            description="Proprietarul tichetului"
                                        />

                                        {
                                            this.state.startDate != undefined ?
                                            <ImmutableField
                                                label='Dată creare'
                                                description='Data când a fost creată componenta'
                                            >{dateformat(new Date(parseInt(this.state.startDate)), "dddd \u00B7 d mmmm \u00B7 yyyy")}</ImmutableField> : null
                                        }

                                        <EditDate
                                            editable={true}
                                            date={this.state.dueDate}
                                            label='Data limită'
                                            save={this.saveDueDate}
                                            description='Data limită pentru componentă'
                                        />
                                    </EditForm>
                                </div>
                            </div>

                            <CommentArea comments={this.state.comments} remove={this.removeComment}/>

                            <div class={"col-xl-12" + (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-2x")}>
                                <div class="row">
                                    <div class={"col-xl-6 knbn-transition knbn-bg-transparent"}>
                                        <CommentInsert add={this.addComment}/>
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
        priorities: state.priorities,
        currentUser: state.currentUser
    }
}

export default connect(mapStateToProps)(EditTicket);