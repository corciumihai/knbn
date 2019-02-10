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
import DismisableError from '../messages/DismisableError';

class EditTicket extends React.Component{
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
            
            estimation: 0,

            startDate: new Date(), 
            dueDate: new Date(),

            comments: [],
            releases: [],
            categories: [],
            worklogs: [],

            filteredReleases: [],
            filteredCategories: [],

            loadingData: true,
            loadingRelease: true,
            loadingReleases: true,

            toggleSection: false
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
        this.fetchWorklogs = this.fetchWorklogs.bind(this);
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
    }

    componentDidMount(){
        axios.all([
            axios.get('/ticket/get/' + this.props.match.params.id),
            axios.get('release/multi/get'),
            axios.get('category/multi/get'),
            axios.get('/ticket/get/comments/' + this.props.match.params.id),
            axios.get('/ticket/get/worklogs/' + this.props.match.params.id)
        ])
        .then(axios.spread(
            (ticket, releases, categories, comments, worklogs) => {
                this.setState({
                    id: ticket.data.id,
                    priority: this.props.priorities.find(item => {return item.dbName == ticket.data.priority}),
                    description: ticket.data.description,
                    name: ticket.data.name,
                    assignee: {email: ticket.data.assignee},
                    reporter: {email: ticket.data.reporter},
                    startDate: ticket.data.startDate,
                    dueDate: ticket.data.dueDate,
                    estimation: ticket.data.estimation,
                    project: ticket.data.project,
                    releases: releases.data,
                    filteredReleases: releases.data,
                    categories: categories.data,
                    filteredCategories: categories.data,
                    comments: comments.data,
                    worklogs: worklogs.data,
                    loading: false,
                }, () => {
                    if(ticket.data.releaseID){
                        axios.get('/release/get/' + ticket.data.releaseID)
                        .then(response => {
                            if(response.status == 200){
                                this.setState({release: response.data})
                            }
                        })
                        .catch(error => {
                            this.setState({error: error.response.data.error})
                        })
                    }
                    
                    if(ticket.data.category){
                        axios.get('/category/get/' + ticket.data.category)
                        .then(response => {
                            if(response.status == 200){
                                this.setState({category: response.data})
                            }
                        })
                        .catch(error => {
                            this.setState({error: error.response.data.error})
                        })
                    }

                    this.filterReleases();
                    this.filterCategories();
                })
                .catch(error => {
                    this.setState({error: error.response.data.error})
                })
            }
        ))
        .catch(error => {
            this.setState({error: error.response.data.error})
        })
    }

    componentWillReceiveProps(nextProps, nextState){
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

    fetchComments(){
        axios.get('/ticket/get/comments/' + this.props.match.params.id)
        .then(response => {
            if(response.status == 200){
                this.setState({comments: response.data})
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error});
        })
    }

    fetchWorklogs(){
        axios.get('/ticket/get/worklogs/' + this.props.match.params.id)
        .then(response => {
            if(response.status == 200){
                this.setState({worklogs: response.data})
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error});
        })
    }

    addComment(item){
        if(item){
            let data = item;
            data.ticket = this.props.match.params.id;

            axios.post('/ticket/add/comment', data)
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
            data.created = new Date();

            axios.post('/ticket/add/worklog', data)
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
            axios.post('/ticket/update/worklog', item)
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
            axios.post('/ticket/update/comment', item)
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
        axios.post('/ticket/remove/comment', item)
        .then(response => {
            if(response.status == 200){
                this.fetchComments();
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error});
        })
    }

    removeWorklog(worklog){        
        if(worklog){
            axios.post('/ticket/remove/worklog', worklog)
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
        if(name.length){
            axios.post('/ticket/set/name', {
                id: this.state.id, 
                value: name
            })
            .then(response => {
                if(response.status == 200){
                    this.setState({name: name});
                }
            })
            .catch(error => {
                this.setState({error: error.response.data.error});
            })
        }
        else{
            this.setState({error: "Numele nu poate fi omis"});
        }
    }

    saveDescription(description){
        if(description.length){
            axios.post('/ticket/set/desc', {
                id: this.state.id,
                value: description
            })
            .then( response => {
                if(response.status == 200){
                    this.setState({description: description});
                }
            })
            .catch(error => {
                this.setState({error: error.response.data.error});
            })
        }
    }

    saveRelease(release){
        if(release.id){
            axios.post('/ticket/set/release', {
                id: this.state.id, 
                value: release.id
            })
            .then(response => {
                if(response.status == 200){
                    this.setState({release: release});
                }
            })
            .catch(error => {
                this.setState({error: error.response.data.error});
            })
        }  
    }

    saveCategory(category){
        if(category.id){
            axios.post('/ticket/set/category', {id: this.state.id, value: category.id})
            .then(response => {
                if(response.status == 200){
                    this.setState({category: category});
                }
            })
            .catch(error => {
                this.setState({error: error.response.data.error});
            })
        }    
    }

    savePriority(priority){
        if(priority){
            axios.post('/ticket/set/priority', {
                id: this.state.id, 
                value: priority.dbName
            })
            .then(response => {
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
        if(user.email){
            axios.post('/ticket/set/assignee', {id: this.state.id, value: user.email})
            .then(response => {
                if(response.status == 200){
                    this.setState({assignee: user})
                }
            })
            .catch(error => {
                this.setState({error: error.response.data.error})
            })
        }
    }

    saveReporter(user){
        if(user.email){
            axios.post('/ticket/set/reporter', { id: this.state.id, value: user.email})
            .then(response => {
                if(response.status == 200){
                    this.setState({reporter: user});
                }
            })
            .catch(error => {
                this.setState({error: error.response.data.error})
            })
        }
    }

    saveDueDate(date){
        console.log(date)
        
        axios.post('/ticket/set/dueDate', {
            id: this.state.id, 
            date: date
        })
        .then(response => {
            if(response.status == 200){
                this.setState({dueDate: date});
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error});
        })
    }

    saveEstimation(value){
        if(value.length){
            axios.post('/ticket/set/estimation', {
                id: this.state.id, 
                value: value
            })
            .then(response => {
                if(response.status == 200){
                    this.setState({estimation: value});
                }
            })
            .catch(error => {
                this.setState({error: error.response.data.error});
            })
        }
    }

    render(){
        let loading = this.state.loadingData && this.state.loadingRelease && this.state.loadingReleases && this.state.loadingComments;
        return(
            <div class={"container-fluid knbn-bg-transparent knbn-transition knbn-container pb-3 h-100" + (this.props.themeToggled ? " knbn-dark-bg-1x" : " knbn-snow-bg-1x")}>
                <Menu/>
                
                <div class="row knbn-mandatory-margin">
                    <div class="col-12">
                        <Header3>Editor Tichet</Header3>
                    </div>
                </div>

                <DismisableError dismissError={()=>{this.setState({error: ''})}}>{this.state.error}</DismisableError>

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
                                        canEdit={this.props.isAdmin || this.props.currentUser == this.state.reporter.email || this.props.currentUser == this.state.assignee.email}
                                    />

                                    <EditTextArea
                                        value={this.state.description}
                                        save={this.saveDescription}
                                        canEdit={this.props.isAdmin || this.props.currentUser == this.state.reporter.email || this.props.currentUser == this.state.assignee.email}
                                        label='Descriere' 
                                        description='Descrierea tichetului când a fost creat'
                                    />

                                    <EditSelection
                                        item={this.state.release}
                                        label="Versiune"
                                        description='Versiunea atașată tichetului'
                                        items={this.state.filteredReleases}
                                        save={this.saveRelease}
                                        canEdit={this.props.isAdmin || this.props.currentUser == this.state.reporter.email || this.props.currentUser == this.state.assignee.email}
                                    />

                                    <EditSelection
                                        item={this.state.category}
                                        label="Categorie"
                                        description='Categoria atașată tichetului'
                                        items={this.state.filteredCategories}
                                        save={this.saveCategory}
                                        canEdit={this.props.isAdmin || this.props.currentUser == this.state.reporter.email || this.props.currentUser == this.state.assignee.email}
                                    />

                                    <EditSelection
                                        item={this.state.priority}
                                        label="Prioritate"
                                        description='Prioritatea tichetului'
                                        items={this.props.priorities}
                                        save={this.savePriority}
                                        canEdit={this.props.isAdmin || this.props.currentUser == this.state.reporter.email || this.props.currentUser == this.state.assignee.email}
                                    />

                                    <EditField
                                        value={this.state.estimation}
                                        label='Estimare' 
                                        save={this.saveEstimation}
                                        description='Estimare timp pentru rezolvarea tichetului'
                                        canEdit={this.props.isAdmin || this.props.currentUser == this.state.reporter.email || this.props.currentUser == this.state.assignee.email}
                                    />
                                </EditForm>
                                <EditForm classes={"offset-xl-4"}>
                                    <EditUser
                                        label='Supervizor'
                                        user={this.state.reporter}
                                        save={this.saveReporter}
                                        description="Reporter tichetului"
                                        canEdit={this.props.isAdmin || this.props.isAdmin || this.props.currentUser == this.state.reporter.email || !this.state.reporter.email}
                                    />

                                    <EditUser
                                        label='Asignat'
                                        user={this.state.assignee}
                                        save={this.saveAssignee}
                                        description="Proprietarul tichetului"
                                        canEdit={true}
                                    />

                                    {
                                        this.state.startDate != undefined ?
                                        <ImmutableField
                                            label='Dată creare'
                                            description='Data când a fost creat tichetul'
                                        >{dateformat(new Date(this.state.startDate), "dddd \u00B7 d mmmm \u00B7 yyyy")}</ImmutableField> : null
                                    }

                                    <EditDate
                                        canEdit={this.props.isAdmin || this.props.currentUser == this.state.reporter.email || this.props.currentUser == this.state.assignee.email}
                                        date={this.state.dueDate}
                                        label='Data limită'
                                        save={this.saveDueDate}
                                        description='Data limită pentru tichet'
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
                                        <div class="col-12">
                                            <Header3>Comentarii</Header3>
                                        </div>
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
                                        <div class="col-12">
                                            <Header3>Raport muncă</Header3>
                                        </div>
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
                                this.props.currentUser == this.state.reporter.email || this.props.currentUser == this.state.assignee.email ? 
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

export default connect(mapStateToProps)(EditTicket);