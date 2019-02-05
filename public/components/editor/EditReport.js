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
import Worklog from '../comments/Worklog';
import WorklogInsert from '../comments/WorklogInsert';
import Comment from '../comments/Comment';
import CommentInsert from '../comments/CommentInsert';
import DismissableError from '../messages/DismisableError';

class EditReport extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            id: undefined,
            name: '',
            priority: {},
            description: '',
            assignee: {},
            reporter: {},
            release: {},
            category: {},
            canEdit: false,
            
            estimation: 0,

            startDate: new Date(), 
            dueDate: new Date(),

            comments: [],
            releases: [],
            categories: [],
            worklogs: [],

            filteredReleases: [],
            filteredCategories: [],

            loading: false,
            toggleSection: false
        }

        this.saveRelease = this.saveRelease.bind(this);
        this.saveName = this.saveName.bind(this);
        this.saveDescription = this.saveDescription.bind(this);
        this.savePriority = this.savePriority.bind(this);
        this.saveAssignee = this.saveAssignee.bind(this);
        this.saveReporter = this.saveReporter.bind(this);
        this.saveEstimation = this.saveEstimation.bind(this);
        this.addWorklog = this.addWorklog.bind(this);
        this.addComment = this.addComment.bind(this);
        this.removeComment = this.removeComment.bind(this);
        this.removeWorklog = this.removeWorklog.bind(this);
        this.toggleSection = this.toggleSection.bind(this);
        this.updateWorklog = this.updateWorklog.bind(this);
        this.updateComment = this.updateComment.bind(this);
        this.filterReleases = this.filterReleases.bind(this);
        this.filterCategories = this.filterCategories.bind(this);
        this.saveCategory = this.saveCategory.bind(this);
        this.eraseError = this.eraseError.bind(this);
    }

    componentDidMount(){
        axios.all([
            axios.get('/report/get-data/' + this.props.match.params.id),
            axios.get('/release/multi/get'),
            axios.get('/category/multi/get'),
            axios.get('/report/get-comments/' + this.props.match.params.id),
            axios.get('/report/get-worklogs/' + this.props.match.params.id)
        ])
        .then(axios.spread((reportData, releases, categories, comments, worklogs) => {
            axios.all([
                axios.get('/release/get/' + reportData.data.releaseID),
                axios.get('/category/get/' + reportData.data.category)
            ])
            .then(axios.spread((release, category) => {
                this.setState({
                    id: reportData.data,
                    priority: this.props.priorities.find(item => {return item.dbName == reportData.data.priority}),
                    description: reportData.data.description,
                    name: reportData.data.name,
                    assignee: {email: reportData.data.assignee},
                    reporter: {email: reportData.data.reporter},
                    startDate: reportData.data.startDate,
                    dueDate: reportData.data.dueDate,
                    estimation: reportData.data.estimation,
                    project: reportData.data.project,
                    releases: releases,
                    filteredReleases: releases.data,
                    categories: categories.data,
                    filteredCategories: categories.data,
                    comments: comments.data,
                    worklogs: worklogs.data,
                    canEdit: this.props.isAdmin || reportData.data.assignee == this.props.currentUser || reportData.data.reporter == this.props.currentUser,
                    release: release.data,
                    category: category.data,
                    loading: false
                })
            }))
        }))
        .catch(error => {
            this.setState({error: error.response.data.error});
        })
    }

    componentWillReceiveProps(nextProps, nextState){
        this.setState({canEdit: nextProps.isAdmin || this.state.assignee.email == nextProps.currentUser || this.state.reporter.email == nextProps.currentUser});
    }

    filterReleases(){
        this.setState({filteredReleases: this.state.releases.filter(item => {return item.project == this.state.project})});
    }

    filterCategories(){
        this.setState({filteredCategories: this.state.categories.filter(item => {return item.project == this.state.project})});
    }

    toggleSection(value){
        this.setState({toggleSection: value})
    }

    addComment(item){
        if(item){
            let data = item;
            data.ticket = this.props.match.params.id;

            axios.post('/report/add-comment', data)
            .then(response => {
                if(response.status == 200){
                    this.fetchComments();
                }
            })
            .catch(error => {
                this.setState({commentError: error.response.data.error});
            })
        }
    }

    addWorklog(item){
        if(item){
            let data = item;
            data.ticket = this.state.id;

            axios.post('/report/add-worklog', data)
            .then(response => {
                if(response.status == 200){
                    this.fetchWorklogs();
                }
            })
            .catch(error => {
                this.setState({commentAreaError: error.response.data.error});
            })
        }
    }

    updateWorklog(item){
        if(item){
            axios.post('/report/update-worklog', item)
            .then(response => {
                if(response.status == 200){
                    this.fetchWorklogs();
                }
            })
            .catch(error => {
                this.setState({commentAreaError: error.response.data.error});
            })
        }
    }

    updateComment(item){
        if(item){
            axios.post('/report/update-comment', item)
            .then(response => {
                if(response.status == 200){
                    this.fetchComments();
                }
            })
            .catch(error => {
                this.setState({commentAreaError: error.response.data.error});
            })
        }
    }

    removeComment(item){
        axios.post('/report/remove/comment', item)
        .then(response => {
            if(response.status == 200){
                this.fetchComments();
            }
        })
    }

    removeWorklog(worklog){        
        if(worklog){
            axios.post('/report/remove-worklog', worklog)
            .then(response => {
                if(response.status == 200){
                    this.fetchWorklogs();
                }
            })
            .catch(error => {
                this.setState({commentAreaError: error.response.data.error});
            })
        }
    }

    saveName(name){
        axios.post('/report/set/name', {id: this.state.id, value: name})
        .then( response => {
            if(response.status == 200){
                this.setState({name: name});
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error});
        })
    }

    saveDescription(description){
        axios.post('/report/set/description', {id: this.state.id,value: description})
        .then( response => {
            if(response.data.success == true){
                this.setState({description: description});
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error});
        })
    }

    saveRelease(release){        
        axios.post('/report/set/release', {id: this.state.id, value: release.id})
        .then(response => {
            if(response.status == 200){
                this.setState({release: release});
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error});
        })
    }

    saveCategory(category){        
        axios.post('/report/set/category', {id: this.state.id, value: category.id})
        .then(response => {
            if(response.status == 200){
                this.setState({category: category});
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error});
        })
    }

    savePriority(priority){
        if(priority){
            axios.post('/ticket/set/priority', {id: this.state.id, value: priority.dbName})
            .then( response => {
                if(response.status == 200){
                    this.setState({priority: priority});
                }
            })
            .catch(error => {
                this.setState({error: error.response.data.error});
            })
        }
    }

    saveAssignee(user){
        axios.post('/report/set/assignee', {id: this.state.id, value: user.email})
        .then( response => {
            if(response.status == 200){
                this.setState({
                    assignee: user, 
                    canEdit: this.props.isAdmin || user.email == this.props.currentUser || this.state.reporter.email == this.props.currentUser});
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error})
        })
    }

    saveReporter(user){     
        axios.post('/report/set/reporter', { id: this.state.id, value: user.email})
        .then( response => {
            if(response.status == 200){
                this.setState({
                    reporter: user, 
                    canEdit: this.props.isAdmin || user.email == this.props.currentUser || this.state.assignee.email == this.props.currentUser});
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error})
        })
    }

    saveEstimation(value){
        axios.post('/report/set/estimation', {id: this.state.id, value: value})
        .then( response => {
            if(response.status == 200){
                this.setState({dueDate: date});
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error})
        })
    }

    eraseError(){
        this.setState({error: ''});
    }

    render(){
        return(
            <div class={"container-fluid knbn-bg-transparent knbn-transition knbn-container pb-3 h-100" + (this.props.themeToggled ? " knbn-dark-bg-1x" : " knbn-snow-bg-1x")}>
                <Menu/>

                <div class="row knbn-mandatory-margin">
                    <Header3>Editor tichet</Header3>
                </div>

                <DismissableError dismissError={this.eraseError}>{this.state.error}</DismissableError>

                {
                    this.state.loading ? 
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
                                        canEdit={this.state.canEdit}
                                    />

                                    <EditTextArea
                                        value={this.state.description}
                                        save={this.saveDescription}
                                        canEdit={this.state.canEdit}
                                        label='Descriere' 
                                        description='Descrierea tichetului când a fost creat'
                                    />

                                    <EditSelection
                                        item={this.state.release}
                                        label="Versiune"
                                        description='Versiunea atașată tichetului'
                                        items={this.state.filteredReleases}
                                        save={this.saveRelease}
                                        canEdit={this.state.canEdit}
                                    />

                                    <EditSelection
                                        item={this.state.category}
                                        label="Categorie"
                                        description='Categoria atașată tichetului'
                                        items={this.state.filteredCategories}
                                        save={this.saveCategory}
                                        canEdit={this.state.canEdit}
                                    />

                                    <EditSelection
                                        item={this.state.priority}
                                        label="Prioritate"
                                        description='Prioritatea tichetului'
                                        items={this.props.priorities}
                                        save={this.savePriority}
                                        canEdit={this.state.canEdit}
                                    />

                                    <EditField
                                        value={this.state.estimation}
                                        label='Estimare' 
                                        save={this.saveEstimation}
                                        description='Estimare timp pentru rezolvarea tichetului'
                                        canEdit={this.state.canEdit}
                                    />
                                </EditForm>
                                <EditForm classes={"offset-xl-4"}>
                                    <EditUser
                                        label='Supervizor'
                                        user={this.state.reporter}
                                        save={this.saveReporter}
                                        description="Reporter tichetului"
                                        canEdit={this.state.canEdit || this.state.reporter.email == undefined}
                                    />

                                    <EditUser
                                        label='Asignat'
                                        user={this.state.assignee}
                                        save={this.saveAssignee}
                                        description="Proprietarul tichetului"
                                        canEdit={this.state.canEdit || this.state.assignee.email == undefined}
                                    />

                                    {
                                        this.state.startDate != undefined ?
                                        <ImmutableField
                                            label='Dată creare'
                                            description='Data când a fost creată componenta'
                                        >{dateformat(new Date(this.state.startDate), "dddd \u00B7 d mmmm \u00B7 yyyy")}</ImmutableField> : null
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

                        <CommentArea
                            flag={this.state.toggleSection}
                            toggle={this.toggleSection}
                            error={this.state.commentAreaError}
                        >
                            <div class={"col-xl-12 knbn-transition knbn-bg-transparent mb-2 knbn-border-bottom" + (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-2x")}>
                            {
                                !this.state.toggleSection ? 
                                    <div class="row">
                                        <Header3>Comentarii</Header3>
                                    {
                                        this.state.comments.length > 0 ? 
                                            this.state.comments.map(item => {
                                                return <Comment data={item} key={item.id} update={this.updateComment} remove={this.removeComment}/>
                                            })
                                            : 
                                            <div class={"col knbn-font-medium" + (this.props.themeToggled ? " knbn-dark-color-2x" : " knbn-snow-color-2x")}>
                                                Nici un comentariu încă
                                            </div>
                                    }
                                    </div>
                                :
                                    <div class="row">
                                        <Header3>Raport muncă</Header3>
                                    {
                                        this.state.worklogs.length > 0 ? 
                                        this.state.worklogs.map(item => {
                                            return <Worklog data={item} key={item.id} update={this.updateWorklog} remove={this.removeWorklog}/>
                                        })
                                        : 
                                        <div class={"col knbn-font-medium" + (this.props.themeToggled ? " knbn-dark-color-2x" : " knbn-snow-color-2x")}>
                                            Nici un raport de muncă încă
                                        </div>
                                    }
                                    </div>
                            }
                            </div>

                            <div class={"col-xl-6 knbn-transition knbn-bg-transparent"}>
                            {
                                !this.state.toggleSection ? 
                                <CommentInsert add={this.addComment}/>
                                :
                                this.state.canEdit ? 
                                    <WorklogInsert add={this.addWorklog}/>
                                    :
                                    null
                            }
                                
                            </div>
                        </CommentArea>
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
        currentUser: state.currentUser,
        isAdmin: state.isAdmin
    }
}

export default connect(mapStateToProps)(EditReport);