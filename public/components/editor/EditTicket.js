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

class EditTicket extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            releases: [],
            id: undefined,
            name: '',
            priority: {},
            description: '',
            assignee: '',
            reporter: '',
            release: {},
            startDate: undefined
        }

        this.saveRelease = this.saveRelease.bind(this);
        this.saveName = this.saveName.bind(this);
        this.saveDescription = this.saveDescription.bind(this);
        this.savePriority = this.savePriority.bind(this);
        this.saveAssignee = this.saveAssignee.bind(this);
        this.saveDueDate = this.saveDueDate.bind(this);
        this.saveReporter = this.saveReporter.bind(this);
    }

    componentWillMount(nextProps, nextState){
        axios.get('/get-ticket-data/' + this.props.match.params.id).then( response => {      
            this.setState({
                id: response.data.id,
                priority: this.props.priorities.find(item => {return item.dbName == response.data.priority}),
                description: response.data.description,
                name: response.data.name,
                assignee: response.data.assignee,
                reporter: response.data.reporter,
                startDate: response.data.startDate
            });

            axios.get('/get-release/' + response.data.releaseID).then( response => {
                this.setState({
                    release: response.data
                });
            });
        });

        axios.get('/get-releases').then( response => {
            this.setState({
                releases: response.data
            })
        });
    }

    saveName(name){
        axios.post('/set-ticket/name', {
            id: this.state.id, 
            value: name
        }).then( response => {
            if(response.success == true){
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
            if(response.success == true){
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
            if(response.success == true){
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
            if(response.success == true){
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
            if(response.success == true){
                this.setState({assignee: user.email});
            }
        });
    }

    saveReporter(user){
        axios.post('/set-ticket/reporter', {
            id: this.state.id,
            value: user.email
        })
        .then( response => {
            if(response.success == true){
                this.setState({reporter: user.email});
            }
        });
    }

    saveDueDate(date){
        axios.post('/set-component/due-date', {
            id: this.state.id, 
            date: date
        })
        .then( response => {
            if(response.success == true){
                this.setState({dueDate: date});
            }
        });
    }

    render(){
        return(
            <div class={"container-fluid px-0 py-2 knbn-transition" + (this.props.themeToggled ? " knbn-dark-bg-1x" : " knbn-snow-bg-1x")}>
                <div class="col-xl-12 col-12 d-flex">
                    <Header3>Editor tichet</Header3>
                </div>
                <div class="col-xl-12 col-12 d-flex flex-xl-row flex-column">
                    <EditForm>
                        <EditField
                            value={this.state.name}
                            label='Nume' 
                            save={this.saveName}
                            description='Numele componentei când a fost creată'
                        />

                        <EditTextArea
                            value={this.state.description}
                            save={this.saveDescription}
                            label='Descriere' 
                            description='Descrierea componentei când a fost creată'
                            canEdit={true}
                        />

                        <EditSelection
                            item={this.state.release}
                            label="Versiune"
                            description='Versiunea atașată componentei'
                            items={this.state.releases}
                            save={this.saveRelease}
                        />

                        <EditSelection
                            item={this.state.priority}
                            label="Prioritate"
                            description='Prioritatea componentei'
                            items={this.props.priorities}
                            save={this.savePriority}
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

                <CommentArea id={this.state.id}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
        priorities: state.priorities
    }
}

export default connect(mapStateToProps)(EditTicket);