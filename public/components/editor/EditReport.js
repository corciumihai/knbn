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
            blocked: {},
            
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
        this.saveCategory = this.saveCategory.bind(this);
        this.fetchComments = this.fetchComments.bind(this);
        this.fetchWorklogs = this.fetchWorklogs.bind(this);
        this.saveExpected = this.saveExpected.bind(this);
        this.saveTestSteps = this.saveTestSteps.bind(this);
        this.saveObserved = this.saveObserved.bind(this);
        this.saveBlocked = this.saveBlocked.bind(this);
        this.saveDueDate = this.saveDueDate.bind(this);
    }

    componentDidMount(){
        axios.all([
            axios.get('/report/get/' + this.props.match.params.id),
            axios.get('/release/multi/get'),
            axios.get('/category/multi/get'),
            axios.get('/report/get/comments/' + this.props.match.params.id),
            axios.get('/report/get/worklogs/' + this.props.match.params.id),
        ])
        .then(axios.spread((reportData, releases, categories, comments, worklogs) => {
            axios.all([
                reportData.data.blocked ? axios.get('/ticket/get/' + reportData.data.blocked) : null,
                axios.get('/component/get/tickets/' + reportData.data.component)
            ])
            .then(axios.spread((blocked, tickets) => {
                this.setState({
                    id: reportData.data.id,
                    priority: this.props.priorities.find(item => {return item.dbName == reportData.data.priority}),
                    description: reportData.data.description,
                    name: reportData.data.name,
                    assignee: {email: reportData.data.assignee},
                    reporter: {email: reportData.data.reporter},
                    startDate: reportData.data.startDate,
                    dueDate: reportData.data.dueDate,
                    estimation: reportData.data.estimation,
                    project: reportData.data.project,
                    testSteps: reportData.data.testSteps,
                    expected: reportData.data.expected,
                    observed: reportData.data.observed,
                    releases: releases,
                    filteredReleases: releases.data.filter(item => item.project == reportData.data.project),
                    categories: categories.data,
                    filteredCategories: categories.data.filter(item => item.project == reportData.data.project),
                    comments: comments.data,
                    worklogs: worklogs.data,
                    blocked: reportData.data.blocked ? blocked.data : {},
                    tickets: tickets.data,
                    loading: false
                }, () => {
                    if(reportData.data.releaseID){
                        axios.get('/release/get/' + reportData.data.releaseID)
                        .then(response => {
                            this.setState({release: response.data})
                        })
                    }

                    if(reportData.data.category){
                        axios.get('/category/get/' + reportData.data.category)
                        .then(response => {
                            this.setState({category: response.data,})
                        })
                    }
                })
            }))
        }))
        .catch(error => {
            this.setState({error: error.response.data.error});
        })
    }

    componentWillReceiveProps(nextProps, nextState){
    }

    fetchComments(){
        axios.get('/report/get/comments/' + this.state.id)
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
        axios.get('/report/get/worklogs/' + this.state.id)
        .then(response => {
            if(response.status == 200){
                this.setState({worklogs: response.data})
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error});
        })
    }

    toggleSection(value){
        this.setState({toggleSection: value})
    }

    addComment(item){
        if(item){
            let data = item;
            data.report = this.props.match.params.id;

            axios.post('/report/add/comment', data)
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

    addWorklog(item){
        if(item){
            let data = item;
            data.report = this.state.id;
            data.created = new Date();

            axios.post('/report/add/worklog', data)
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
            axios.post('/report/update/worklog', item)
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
            axios.post('/report/update/comment', item)
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
        .catch(error => {
            this.setState({commentAreaError: error.response.data.error});
        })
    }

    removeWorklog(worklog){
        if(worklog){
            axios.post('/report/remove/worklog', worklog)
            .then(response => {
                if(response.status == 200){
                    this.fetchWorklogs();
                }
            })
            .catch(error => {
                this.setState({commentAreaError: error.response.data.error});
            })
        }
        else{
            this.setState({error: "Elementul nu există"})
        }
    }

    saveName(name){
        if(name.length){
            axios.post('/report/set/name', {id: this.state.id, value: name})
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
        axios.post('/report/set/desc', {id: this.state.id,value: description})
        .then(response => {
            if(response.status == 200){
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
        axios.post('/report/set/priority', {id: this.state.id, value: priority.dbName})
        .then(response => {
            if(response.status == 200){
                this.setState({priority: priority});
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error});
        })
    }

    saveAssignee(user){
        if(user.email){
            axios.post('/report/set/assignee', {id: this.state.id, value: user.email})
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
            axios.post('/report/set/reporter', { id: this.state.id, value: user.email})
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

    saveEstimation(value){
        axios.post('/report/set/estimation', {id: this.state.id, value: value.length > 0 ? value : 0})
        .then(response => {
            if(response.status == 200){
                this.setState({estimation: value.length > 0 ? value : 0});
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error})
        })
    }

    saveTestSteps(value){
        axios.post('/report/set/teststeps', {id: this.state.id, value: value})
        .then(response => {
            if(response.status == 200){
                this.setState({testSteps: value});
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error});
        })
    }

    saveExpected(value){
        axios.post('/report/set/expected', {id: this.state.id, value: value})
        .then(response => {
            if(response.status == 200){
                this.setState({expected: value});
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error});
        })
    }

    saveObserved(value){
        axios.post('/report/set/observed', {id: this.state.id, value: value})
        .then(response => {
            if(response.status == 200){
                this.setState({observed: value});
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error});
        })
    }

    saveBlocked(item){
        axios.post('/report/set/blocked', {id: this.state.id, ticket: item})
        .then(response => {
            if(response.status == 200){
                this.setState({blocked: item})
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error});
        })
    }

    saveDueDate(date){        
        axios.post('/report/set/dueDate', {
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

    render(){
        return(
            <div class={"container-fluid knbn-bg-transparent knbn-transition knbn-container pb-3 h-100" + (this.props.themeToggled ? " knbn-dark-bg-1x" : " knbn-snow-bg-1x")}>
                <Menu/>

                <div class="row knbn-mandatory-margin">
                    <div class="col-12">
                        <Header3>Editor Raport problemă</Header3>
                    </div>
                </div>

                <DismissableError dismissError={() => {this.setState({error: ''})}}>{this.state.error}</DismissableError>

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
                                        canEdit={this.props.isAdmin || this.props.currentUser == this.state.reporter.email || this.props.currentUser == this.state.assignee.email}
                                    />

                                    <EditSelection
                                        item={this.state.blocked}
                                        label="Tichet sursă eroare"
                                        description='Tichetul ce generează eroarea'
                                        items={this.state.tickets}
                                        save={this.saveBlocked}
                                        canEdit={this.props.isAdmin || this.props.currentUser == this.state.reporter.email || this.props.currentUser == this.state.assignee.email}
                                    />

                                    <EditTextArea
                                        value={this.state.description}
                                        save={this.saveDescription}
                                        canEdit={this.props.isAdmin || this.props.currentUser == this.state.reporter.email || this.props.currentUser == this.state.assignee.email}
                                        label='Descriere' 
                                        description='Descrierea tichetului când a fost creat'
                                    />

                                    <EditTextArea
                                        value={this.state.testSteps}
                                        save={this.saveTestSteps}
                                        canEdit={this.props.isAdmin || this.props.currentUser == this.state.reporter.email || this.props.currentUser == this.state.assignee.email}
                                        label='Pași de testare' 
                                        description='Pașii de testare configurati de cel ce a testat'
                                    />

                                    <EditTextArea
                                        value={this.state.expected}
                                        save={this.saveExpected}
                                        canEdit={this.props.isAdmin || this.props.currentUser == this.state.reporter.email || this.props.currentUser == this.state.assignee.email}
                                        label='Comportament așteptat' 
                                        description='Comportamenul normal al funcționalității'
                                    />

                                    <EditTextArea
                                        value={this.state.observed}
                                        save={this.saveObserved}
                                        canEdit={this.props.isAdmin || this.props.currentUser == this.state.reporter.email || this.props.currentUser == this.state.assignee.email}
                                        label='Comportament observat' 
                                        description='Comportamenul observat al funcționalității'
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
                                        canEdit={this.props.isAdmin || this.state.reporter.email == this.props.currentUser || !this.state.reporter.email}
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
                                            description='Data când a fost creată componenta'
                                        >{dateformat(new Date(this.state.startDate), "dddd \u00B7 d mmmm \u00B7 yyyy")}</ImmutableField> : null
                                    }

                                    <EditDate
                                        canEdit={this.props.isAdmin || this.props.currentUser == this.state.reporter.email || this.props.currentUser == this.state.assignee.email}
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

export default connect(mapStateToProps)(EditReport);