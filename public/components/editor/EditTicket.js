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
                dueDate: response.data.dueDate,
                estimation: response.data.estimation,
                project: response.data.project,
                loadingData: false,
            }, () => {
                this.setState({canEdit: this.props.isAdmin || this.state.assignee.email == this.props.currentUser || this.state.reporter.email == this.props.currentUser})
            });

            if(response.data.releaseID){
                axios.get('/get-release/' + response.data.releaseID).then(response => {
                    this.setState({
                        release: response.data, loadingRelease: false
                    });
                });
            }
            
            if(response.data.category){
                axios.get('/get-category/' + response.data.category).then(response => {
                    this.setState({
                        category: response.data, loadingCategory: false
                    });
                });
            }
        });        

        axios.get('/get-releases').then( response => {
            this.setState({
                releases: response.data,
                filteredReleases: response.data,
                loadingReleases: false
            }, this.filterReleases);
        });

        axios.get('/get-categories').then( response => {
            if(response.status == 200){
                this.setState({
                    categories: response.data,
                    filteredCategories: response.data,
                    loadingCategories: false
                }, this.filterCategories);
            }
        });

        this.fetchComments();
        this.fetchWorklogs();
    }

    componentWillReceiveProps(nextProps, nextState){
        this.setState({canEdit: nextProps.isAdmin || this.state.assignee.email == nextProps.currentUser || this.state.reporter.email == nextProps.currentUser}, () => console.log(this.state.canEdit));
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
        axios.get('/ticket/get-comments/' + this.props.match.params.id)
        .then(response => {
            this.setState({
                comments: response.data,
                loadingComments: false
            })
        });
    }

    fetchWorklogs(){
        axios.get('/ticket/get-worklogs/' + this.props.match.params.id)
        .then(response => {
            if(response.status == 200){
                this.setState({
                    worklogs: response.data,
                    loadingWorklogs: false
                });
            }
        });
    }

    addComment(item){
        if(item){
            let data = item;
            data.ticket = this.props.match.params.id;

            axios.post('/ticket/add-comment', data)
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

            axios.post('/ticket/add-worklog', data)
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
            axios.post('/ticket/update-worklog', item)
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
            axios.post('/ticket/update-comment', item)
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
        axios.post('/comment/remove', item)
        .then(response => {
            if(response.status == 200){
                this.fetchComments();
            }
        })
    }

    removeWorklog(worklog){        
        if(worklog){
            axios.post('/ticket/remove-worklog', worklog)
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

    saveCategory(category){        
        axios.post('/set-ticket/category', {
            id: this.state.id, 
            value: category.id
        })
        .then(response => {
            if(response.data.success == true){
                this.setState({category: category});
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
                this.setState({
                    assignee: user, 
                    canEdit: this.props.isAdmin || user.email == this.props.currentUser || this.state.reporter.email == this.props.currentUser});
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
                this.setState({
                    reporter: user, 
                    canEdit: this.props.isAdmin || user.email == this.props.currentUser || this.state.assignee.email == this.props.currentUser});
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
                
                    <div class="row knbn-mandatory-margin">
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

export default connect(mapStateToProps)(EditTicket);