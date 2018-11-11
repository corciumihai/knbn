import React from 'react';
import axios from 'axios';
import dateformat from 'dateformat';
import PriorityDropdown from './view/PriorityDropdown';
import ReleaseDropdown from './view/ReleaseDropdown';
import CategoryDropdown from './view/CategoryDropdown';
import Estimation from './view/Estimation';
import SetDate from './view/SetDate';
import User from './view/User';
import CommentArea from './view/CommentArea';
import WorkLogArea from './view/WorkLogArea';
import OtherTicket from './view/OtherTicket';
import StatusDropdown from './view/StatusDropdown';

class ViewTicket extends React.Component{
    constructor(props){
        super(props);

        let date = new Date().getTime();

        this.state = {
            project: {},
            release: {},
            component: {},
            discipline: {},

            charCounter: 100,
            loading: true,
            editing: false,
            //ticket name
            name: '',
            discipline: '',
            dueDate: undefined,
            tempName: '',
            id: '',
            priority: 0,
            reporter: {},
            assignee: {},
            estimated: 0,
            blocking: {},
            blockedBy: {},
            lane: 0,
            created: date,
            lastModified: date,

            editPrio: false,
            editRelease: false,
            editDiscipline: false,
            editEstimation: false,
            editDueDate: false,
            editStartDate: false,
            editBlocking: false,
            editBlockedBy: false,
            editStatus: false,
            noResponse: false,
            commentArea: true,

            errorEstimation: '',
            errorName: '',
            errorStartDate: '',
            errorDueDate: '',
            errorBlocking: '',
            errorBlockedBy: '',
        }

        this.editName = this.editName.bind(this);
        this.changeTempName = this.changeTempName.bind(this);
        this.setName = this.setName.bind(this);
        this.setEditPrio = this.setEditPrio.bind(this);
        this.setPrio = this.setPrio.bind(this);
        this.setEditRelease = this.setEditRelease.bind(this);
        this.setRelease = this.setRelease.bind(this);
        this.setEditDiscipline = this.setEditDiscipline.bind(this);
        this.setDiscipline = this.setDiscipline.bind(this);
        this.setNameOnKeyPess = this.setNameOnKeyPess.bind(this);
        this.setEditEstimation = this.setEditEstimation.bind(this);
        this.setEstimation = this.setEstimation.bind(this);
        this.setStartDate = this.setStartDate.bind(this);
        this.setDueDate = this.setDueDate.bind(this);
        this.setEditStartDate = this.setEditStartDate.bind(this);
        this.setEditDueDate = this.setEditDueDate.bind(this);
        this.setEditAssignee = this.setEditAssignee.bind(this);
        this.setEditReporter = this.setEditReporter.bind(this);
        this.setReporter = this.setReporter.bind(this);
        this.setAssignee = this.setAssignee.bind(this);
        this.switchCommentArea = this.switchCommentArea.bind(this);
        this.addLogHours = this.addLogHours.bind(this);
        this.removeLogHours = this.removeLogHours.bind(this);
        this.setEditBlocking = this.setEditBlocking.bind(this);
        this.setEditBlockedBy = this.setEditBlockedBy.bind(this);
        this.setBlocking = this.setBlocking.bind(this);
        this.setBlockedBy = this.setBlockedBy.bind(this);
        this.setEditStatus = this.setEditStatus.bind(this);
        this.setLane = this.setLane.bind(this);
    }

    componentWillMount(){
        axios.get('/get-ticket/' + this.props.match.params.id).then(response => {
            console.log(response.data);

            let ticket = response.data.ticket; 
            let release = response.data.release;
            // console.log(release);
            let project = response.data.project;
            let component = response.data.component;
            let discipline = response.data.discipline;
            // console.log(discipline);
            if(ticket.id.length == 0){this.setState({noResponse: true}); return;}
            
            this.setState({
                project: project,
                release: release,
                component: component,
                discipline: discipline,
                // editPrio: false,

                //ticket id
                id: ticket.id,
                //ticket name
                name: ticket.name, 
                //priority
                priority: ticket.priority,
                //temporary name for change name mechanism
                tempName: ticket.name,
                //ticket due date
                dueDate: new Date(parseInt(ticket.dueDate)).getTime(),
                //ticket start date
                startDate: new Date(parseInt(ticket.startDate)).getTime(),
                //estimated work hours
                estimated: ticket.estimation,
                //logged work hours
                logged: ticket.logged,
                reporter: response.data.reporter,
                assignee: response.data.assignee,
                blocking: response.data.blocking,
                blockedBy: response.data.blocked,
                lane: ticket.lane,
                created: ticket.created,
                lastModified: ticket.lastModified,
                loading: false,
            }, () => {console.log(this.state)});
        });
    }

    editName(){
        this.setState({editing: !this.state.editName, tempName: this.state.name, error: ''}, () => {console.log(this.state.tempName);});
    }

    setName(){
        if(this.state.tempName.length == 0){ this.setState({errorName: 'Name is empty'}); return; }
        if(this.state.name == this.state.tempName){ this.setState({editing: false}); }
        axios.post('/update/ticket/name', {id: this.state.id, name: this.state.tempName}).then(response => {
            if(response.status == 200){ this.setState({name: this.state.tempName, editing: false, errorName: ''}); }
        });
        
    }

    setNameOnKeyPess(event){
        if(event.charCode != 13){return;}
        if(this.state.tempName.length == 0 || this.state.name == this.state.tempName){ this.setState({errorName: 'Name is empty'}); return; }
        axios.post('/update/ticket/name', {id: this.state.id, name: this.state.tempName}).then(response => {
            if(response.status == 200){ this.setState({name: this.state.tempName, editing: false}); }
        });
    }

    changeTempName(event){
        event.preventDefault();
        let value = event.target.value;
        if(value.length > this.state.tempName.length && this.state.charCounter - value.length == -1) {return;}
        this.setState({tempName: event.target.value});
    }

    setEditPrio(){ this.setState({editPrio: !this.state.editPrio}); }
    setEditRelease(){ this.setState({editRelease: !this.state.editRelease}); }
    setEditDiscipline(){this.setState({editDiscipline: !this.state.editDiscipline});}
    setEditEstimation(){this.setState({editEstimation: !this.state.editEstimation});}
    setEditStartDate(){this.setState({editStartDate: !this.state.editStartDate});}
    setEditDueDate(){this.setState({editDueDate: !this.state.editDueDate});}
    setEditReporter(){this.setState({editReporter: !this.state.editReporter})};
    setEditAssignee(){this.setState({editAssignee: !this.state.editAssignee})};
    setEditBlockedBy(){this.setState({editBlockedBy: !this.state.editBlockedBy});}
    setEditBlocking(){this.setState({editBlocking: !this.state.editBlocking});}

    setPrio(prio){
        let date = new Date().getTime();
        axios.post('/update/ticket/prio', {id: prio.id, lastModified: date, tid: this.state.id}).then(response => {
            if(response.status == 200){this.setState({priority: prio.id, editPrio: false});}
        })
        
    }

    setRelease(release){
        let releaseName = release.value;
        let releaseId = release.key;
        let date = new Date().getTime();
        axios.post('/update/ticket/release', {id: releaseId, lastModified: date, tid: this.state.id}).then(response => {
            if(response.status == 200){ this.setState({editRelease: false, release: {name: releaseName, id: releaseId}}); }
        })
        
    }

    setDiscipline(discipline){
        let disName = discipline.value;
        let disId = discipline.key;
        let date=  new Date().getTime();
        axios.post('/update/ticket/discipline', {id: disId, tid: this.state.id, lastModified: date}).then(response => {
            if(response.status == 200){ this.setState({editDiscipline: false, discipline: {name: disName, id: disId}}); }
        });
    }

    setEstimation(estimation){
        let date = new Date().getTime();
        if(isNaN(parseInt(estimation))){this.setState({errorEstimation: 'Estimation value is not a number'}); return; }
        let value = parseInt(estimation);
        axios.post('/update/ticket/estimation', {hours: value, lastModified: date, id: this.state.id}).then(response => {
            if(response.status == 200){ this.setState({estimated: value, editEstimation: false, errorEstimation: ''}); } });
    }

    setStartDate(date){ 
        if(date > this.state.dueDate){this.setState({errorStartDate: 'Start date cannot be higher than due date'}); return;}
        axios.post('/update/ticket/startDate', {id: this.state.id, date: date}).then(response => {
            if(response.status == 200){ this.setState({startDate: date, editStartDate: false, errorStartDate: ''}); }
        })
        
    }
    setDueDate(date){ 
        if(date < this.state.startDate){this.setState({errorDueDate: 'Due date cannot be lower than start date'}); return;}
        axios.post('/update/ticket/dueDate', {id: this.state.id, date: date}).then(response => {
            if(response.status == 200){ this.setState({dueDate: date, editDueDate: false, errorDueDate: ''}); }
        });
        
    }
    setReporter(reporter){
        axios.post('/update/ticket/reporter', {id: this.state.id, user: reporter.email}).then(response => {
            if(response.status == 200){ this.setState({reporter: reporter, editReporter: false}); }
        });
    }
    setAssignee(assignee){
        axios.post('/update/ticket/assignee', {id: this.state.id, user: assignee.email}).then(response => {
            if(response.status == 200){ this.setState({assignee: assignee, editAssignee: false}); }
        });
    }
    addLogHours(hours){ this.setState({logged: parseInt(this.state.logged) + hours}); }
    removeLogHours(hours){ this.setState({logged: parseInt(this.state.logged) - hours})}
    switchCommentArea(event){event.preventDefault(); this.setState({commentArea: !this.state.commentArea});}

    setBlocking(ticket){
        if(ticket.key == this.state.id){this.setState({errorBlocking: 'Blocking ticket cannot be the same as current ticket. Please choose another one'}); return;}
        let date = new Date().getTime();
        axios.post('/update/ticket/blocking', {id: ticket.key, lastModified: date, tid: this.state.id}).then(response => {
            if(response.status == 200){
                this.setState({blocking: ticket, editBlocking: false, errorBlocking: ''});
            }
        })
    }

    setBlockedBy(ticket){
        console.log(ticket);
        if(ticket.key == this.state.id){this.setState({errorBlockedBy: 'Blocked ticket cannot be the same as current ticket. Please choose another one'}); return;}
        let date = new Date().getTime();
        axios.post('/update/ticket/blocked', {id: ticket.key, lastModified: date, tid: this.state.id}).then(response => {
            if(response.status == 200){
                this.setState({blockedBy: ticket, editBlockedBy: false, errorBlockedBy: ''});
            }
        })
    }

    setEditStatus(){this.setState({editStatus: !this.state.editStatus});}
    setLane(lane){
        console.log(lane);
        let date = new Date().getTime();
        axios.post('/update/ticket/lane', {lane: lane, lastModified: date, tid: this.state.id}).then(response => {
            if(response.status == 200){
                this.setState({lane: lane, editStatus: false});
            }
        });
    }

    render(){
        return (
            !this.state.noResponse ? 
            !this.state.loading ?
                <div class="view-ticket col-xl-6 offset-xl-3">
                    <div class="row mb-3">
                        <div class="container-fluid">
                        <div class="col-xl-12 header mb-2 tag py-1">Ticket name</div>
                        <div class={this.state.editing ? "col name px-3 permanent-border": "col name px-3"}> 
                            {!this.state.editing ?
                            <div class="row">
                                <div class="col text-truncate">{this.state.name} </div>
                                <div class="d-flex">
                                    <div class="edit align-self-center d-flex mr-2" onClick={this.editName}>
                                        <img src="/images/edit.svg" class="d-block mx-auto"/>
                                    </div>
                                </div>
                            </div>
                            :
                            <div class="row">
                                <div class="col text-truncate">
                                    <input type="text" class="form-control form-big-font py-0 px-0" onChange={this.changeTempName} value={this.state.tempName} onKeyPress={this.setNameOnKeyPess}/>
                                </div>
                                <div class="d-flex">
                                    <div class="edit align-self-center d-flex mr-2" onClick={this.setName}>
                                        <img src="/images/save.svg" class="d-block mx-auto"/>
                                    </div>
                                </div>
                                {
                                    this.state.errorName.length > 0 ? <div class="col-xl-12 error-input"><span class="error">{this.state.errorName}</span></div> : null
                                }
                            </div>
                            }
                        </div>
                    
                        {
                            this.state.editing ? 
                            <div class="col-xl-12 info justify-content-end d-flex">{(this.state.charCounter - this.state.tempName.length) + " chars remaining"}</div>
                            :null
                        }  
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-xl-12">
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="col-xl-12 header mb-2 tag py-1">Static attributes</div>
                                    <div class="col tag"> 
                                        <div class="row my-1">
                                            <div class="col-xl-2 info align-self-center">Ticket ID</div><div class="col text-truncate ticket-data py-1 align-self-center">{this.state.project.shortName + '-' + this.state.id}</div>
                                        </div>
                                        <div class="row my-1">
                                            <div class="col-xl-2 info align-self-center">Component</div><div class="col text-truncate ticket-data py-1 align-self-center">{this.state.component.name}</div>
                                        </div>
                                        <div class="row my-1">
                                            <div class="col-xl-2 info align-self-center">Created on</div><div class="col text-truncate ticket-data py-1 align-self-center">{dateformat(this.state.created, 'dd.mm.yyyy')}</div>
                                        </div>
                                        <div class="row my-1">
                                            <div class="col-xl-2 info align-self-center">Last modified on</div><div class="col text-truncate ticket-data py-1 align-self-center">{dateformat(this.state.lastModified, 'dd.mm.yyyy')}</div>
                                        </div>
                                        <div class="row my-1">
                                            <div class="col-xl-2 info align-self-center">Status</div><div class="col text-truncate ticket-data py-1 align-self-center">
                                                {this.state.lane == 0 ? "In backlog" : this.state.lane == 1 ? "In progress" : this.state.lane ? "Done" : "Closed"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-xl-12">
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="col-xl-12 header mb-2 tag py-1">Relationship to other tickets</div>
                                    <div class="col tag"> 
                                        <div class="row">
                                            <div class="col-xl-6">
                                                <div class="row my-1">
                                                    <div class="col-xl-3 info align-self-center">Blocking</div>
                                                    <div class="col-xl-9 ticket-data py-1 align-self-center">
                                                    {!this.state.editBlocking ?
                                                        <div class="col ticket-data modifiable py-1">
                                                            <div class="row">
                                                                <div class="edit-field ml-1 d-flex"><img title="Blocking ticket" src="/images/ticketer.svg" class="d-block mx-auto"/></div>
                                                                <div class="col text-truncate">{this.state.blocking != undefined && this.state.blocking.value != undefined && this.state.blocking.value.length > 0 ? this.state.blocking.value : "None"}</div>
                                                                {
                                                                    this.state.lane == 3 ? <div class="edit-field mr-1 d-flex" title="Modifying relationship is disabled when ticket is closed"><img src="/images/disabled.svg" class="d-block mx-auto"/></div> :
                                                                    <div class="edit-field mr-1 d-flex" onClick={this.setEditBlocking} title="Edit"><img src="/images/edit.svg" class="d-block mx-auto"/></div>
                                                                }
                                                            </div>
                                                        </div>
                                                        :
                                                        <OtherTicket ticket={this.state.blocking} set={this.setBlocking} key={1}/>
                                                    }
                                                    </div>
                                                    {
                                                        this.state.errorBlocking.length > 0 ? <div class="col-xl-12"><span class="error">{this.state.errorBlocking}</span></div> : null
                                                    }
                                                </div>
                                            </div>
                                            <div class="col-xl-6">
                                                <div class="row my-1">
                                                    <div class="col-xl-3 info align-self-center">Blocked by</div>
                                                    <div class="col-xl-9 ticket-data py-1 align-self-center">
                                                    {!this.state.editBlockedBy ?
                                                        <div class="col ticket-data modifiable py-1">
                                                            <div class="row">
                                                                <div class="edit-field ml-1 d-flex"><img title="Blocked ticket" src="/images/ticketer.svg" class="d-block mx-auto"/></div>
                                                                <div class="col text-truncate">{this.state.blockedBy != undefined && this.state.blockedBy.value != undefined && this.state.blockedBy.value.length > 0 ? this.state.blockedBy.value : "None"}</div>
                                                                {
                                                                    this.state.lane == 3 ? <div class="edit-field mr-1 d-flex" title="Modifying relationship is disabled when ticket is closed"><img src="/images/disabled.svg" class="d-block mx-auto"/></div> : 
                                                                    <div class="edit-field mr-1 d-flex" onClick={this.setEditBlockedBy} title="Edit"><img src="/images/edit.svg" class="d-block mx-auto"/></div>
                                                                }
                                                            </div>
                                                        </div>
                                                        :
                                                        <OtherTicket ticket={this.state.blockedBy} set={this.setBlockedBy} key={2}/>
                                                    }
                                                    </div>
                                                    {
                                                        this.state.errorBlockedBy.length > 0 ? <div class="col-xl-12"><span class="error">{this.state.errorBlockedBy}</span></div> : null
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-xl-6">
                            <div class="container-fluid">
                                <div class="row">
                                <div class="col-xl-12 header mb-2 tag py-1">Participants</div>
                                    <div class="col tag mb-3"> 
                                        <div class="row my-1">
                                            <div class="col-xl-4 info d-flex"><span class="align-self-center">Reporter</span></div>
                                            {!this.state.editReporter ?
                                            <div class="col ticket-data modifiable py-1">
                                                <div class="row">
                                                    <div class="edit-field ml-1 d-flex"><img title="Reporter" src="/images/user.svg" class="d-block mx-auto"/></div>
                                                    <div class="col text-truncate">{this.state.reporter.name}</div>
                                                    {
                                                        this.state.lane == 3 ? <div class="edit-field mr-1 d-flex" title="Modifying reporter is disabled when ticket is closed"><img src="/images/disabled.svg" class="d-block mx-auto"/></div> : 
                                                        <div class="edit-field mr-1 d-flex" onClick={this.setEditReporter} title="Edit"><img src="/images/edit.svg" class="d-block mx-auto"/></div>
                                                    }
                                                </div>
                                            </div>
                                            :
                                            <User key={this.state.reporter.email} user={this.state.reporter} set={this.setReporter} title="Reporter"/>
                                            }
                                            
                                        </div>
                                        <div class="row my-1">
                                            <div class="col-xl-4 info d-flex"><span class="align-self-center">Assignee</span></div>
                                            {
                                            !this.state.editAssignee ? 
                                            <div class="col ticket-data modifiable py-1">
                                                <div class="row">
                                                    <div class="edit-field ml-1 d-flex" title="Assignee"><img src="/images/user.svg" class="d-block mx-auto"/></div>
                                                    <div class="col text-truncate">{this.state.assignee.name}</div>
                                                    {
                                                        this.state.lane == 3 ? <div class="edit-field mr-1 d-flex" title="Modifying assignee is disabled when ticket is closed"><img src="/images/disabled.svg" class="d-block mx-auto"/></div> : 
                                                        <div class="edit-field mr-1 d-flex" onClick={this.setEditAssignee} title="Edit"><img src="/images/edit.svg" class="d-block mx-auto"/></div>
                                                    }
                                                </div>
                                            </div>
                                            :
                                            <User key={this.state.assignee.email} user={this.state.assignee} set={this.setAssignee} title="Assignee"/>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xl-12 header mb-2 tag py-1">Modifiable attributes</div>
                                    <div class="col tag"> 
                                        <div class="row my-1">
                                            <div class="col-xl-4 info d-flex"><span class="align-self-center">Status</span></div>
                                            {!this.state.editStatus ?
                                            <div class="col ticket-data modifiable py-1">
                                                <div class="row">
                                                    <div class="edit-field ml-1 d-flex"><img title="Status" src={"/images/" + (this.state.lane == 0 ? "lane1.svg" : this.state.lane == 1 ? "lane.svg" : this.state.lane == 2 ? "lane.svg" : "lane.svg")} class="d-block mx-auto"/></div>
                                                    <div class="col text-truncate">
                                                    {this.state.lane == 0 ? "In backlog" : this.state.lane == 1 ? "In progress" : this.state.lane == 2 ? "Done" : "Closed"}</div>
                                                    {this.state.lane == 3 ? <div class="edit-field mr-1 d-flex" title="Status change not allowed when ticket is closed"><img src="/images/disabled.svg" class="d-block mx-auto"/></div>
                                                    :   <div class="edit-field mr-1 d-flex" onClick={this.setEditStatus} title="Edit"><img src="/images/edit.svg" class="d-block mx-auto"/></div>}
                                                </div>
                                            </div>
                                            :
                                            <StatusDropdown lane={this.state.lane} set={this.setLane}/>
                                            }
                                            
                                        </div>
                                        <div class="row my-1">
                                            <div class="col-xl-4 info d-flex"><span class="align-self-center">Priority</span></div>
                                            {!this.state.editPrio ?
                                            <div class="col ticket-data modifiable py-1">
                                                <div class="row">
                                                    <div class="edit-field ml-1 d-flex"><img title="Priority" src={"/images/" + (this.state.priority == 1 ? "low.svg" : this.state.priority == 2 ? "neuter.svg" : "high.svg")} class="d-block mx-auto"/></div>
                                                    <div class="col text-truncate">{this.state.priority == 1 ? "Low" : this.state.priority == 2? "Medium" : "High"}</div>
                                                    {
                                                        this.state.lane == 3 ? <div class="edit-field mr-1 d-flex" title="Modifying priority is disabled when ticket is closed"><img src="/images/disabled.svg" class="d-block mx-auto"/></div> : 
                                                        <div class="edit-field mr-1 d-flex" onClick={this.setEditPrio} title="Edit"><img src="/images/edit.svg" class="d-block mx-auto"/></div>
                                                    }
                                                </div>
                                            </div>
                                            :
                                            <PriorityDropdown prio={this.state.priority} set={this.setPrio}/>
                                            }
                                            
                                        </div>
                                        <div class="row my-1">
                                            <div class="col-xl-4 info d-flex"><span class="align-self-center">Release</span></div>
                                            {
                                            !this.state.editRelease ? 
                                            <div class="col ticket-data modifiable py-1">
                                                <div class="row">
                                                    <div class="edit-field ml-1 d-flex" title="Release"><img src="/images/release.svg" class="d-block mx-auto"/></div>
                                                    <div class="col text-truncate">{this.state.release == undefined ? "*undefined*" : this.state.release.name}</div>
                                                    {
                                                        this.state.lane == 3 ? <div class="edit-field mr-1 d-flex" title="Modifying release is disabled when ticket is closed"><img src="/images/disabled.svg" class="d-block mx-auto"/></div> : 
                                                        <div class="edit-field mr-1 d-flex" onClick={this.setEditRelease} title="Edit"><img src="/images/edit.svg" class="d-block mx-auto"/></div>
                                                    }
                                                </div>
                                            </div>
                                            :
                                            <ReleaseDropdown release={this.state.release} set={this.setRelease}/>
                                            }
                                        </div>
                                        <div class="row my-1">
                                            <div class="col-xl-4 info d-flex"><span class="align-self-center">Category</span></div>
                                            {
                                            !this.state.editDiscipline ?
                                            <div class="col ticket-data modifiable py-1">
                                                <div class="row">
                                                    <div class="edit-field ml-1 d-flex" title="Category"><img src="/images/category.svg" class="d-block mx-auto"/></div>
                                                    <div class="col text-truncate">{this.state.discipline == undefined ? 'Unknown discipline' : this.state.discipline.name}</div>
                                                    {
                                                        this.state.lane == 3 ? <div class="edit-field mr-1 d-flex" title="Modfying category is disabled when ticket is closed"><img src="/images/disabled.svg" class="d-block mx-auto"/></div> : 
                                                        <div class="edit-field mr-1 d-flex" onClick={this.setEditDiscipline} title="Edit"><img src="/images/edit.svg" class="d-block mx-auto"/></div>
                                                    }
                                                </div>
                                            </div>
                                            :
                                            <CategoryDropdown discipline={this.state.discipline} set={this.setDiscipline}/>
                                            }
                                            
                                        </div>
                                        <div class="row my-1">
                                            <div class="col-xl-4 info d-flex"><span class="align-self-center">Estimation</span></div>
                                            <div class={this.state.editEstimation ? "col ticket-data modifiable py-1 permanent-border" : "col ticket-data modifiable py-1"}> 
                                            {
                                                !this.state.editEstimation ?
                                                    <div class="row">
                                                        <div class="edit-field ml-1 d-flex" title="Estimation"><img src="/images/estimation.svg" class="d-block mx-auto"/></div>
                                                        <div class="col text-truncate">{this.state.estimated} hours</div>
                                                        {
                                                            this.state.lane == 3 ? <div class="edit-field mr-1 d-flex"title="Modifying estimation is disabled when ticket is closed"><img src="/images/disabled.svg" class="d-block mx-auto"/></div> : 
                                                            <div class="edit-field mr-1 d-flex" onClick={this.setEditEstimation} title="Edit"><img src="/images/edit.svg" class="d-block mx-auto"/></div>
                                                        }
                                                    </div>
                                                    :
                                                    <Estimation est={this.state.estimated} set={this.setEstimation}/>
                                            }
                                            {
                                                this.state.errorEstimation.length > 0 ? <div class="col-xl-12 error-input"><span class="error">{this.state.errorEstimation}</span></div> : null
                                            }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-6">
                            <div class="container-fluid">
                                <div class="row mb-3">
                                    <div class="col-xl-12 header mb-2 tag py-1">Worked hours and estimation</div>
                                    <div class="col tag"> 
                                        <div class="row my-1">
                                            <div class="col-xl-4 info d-flex"><span class="align-self-start">Estimated hours</span></div>
                                            <div class="col my-1">
                                                <div class="progress">
                                                    <div class="progress-bar estimated" role="progressbar" style={{width: "100%"}} aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                                <div class="col-xl-12 info text-center text-truncate">{this.state.estimated} hours</div>
                                            </div>
                                        </div>
                                        <div class="row my-1">
                                            <div class="col-xl-4 info d-flex"><span class="align-self-start">Logged hours</span></div>
                                            <div class="col my-1">
                                                <div class="progress">
                                                    <div class="progress-bar logged" role="progressbar" 
                                                        style={{width: (100/(this.state.estimated/this.state.logged))+"%"}} aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                                <div class="col-xl-12 info text-center">{this.state.logged} hours</div>
                                            </div>
                                        </div>
                                        <div class="row my-1">
                                            <div class="col-xl-4 info d-flex"><span class="align-self-start">Remaining hours</span></div>
                                            <div class="col my-1">
                                                <div class="progress justify-content-end">
                                                    <div class="progress-bar remaining" role="progressbar" 
                                                
                                                        style={{width: 
                                                        this.state.estimated - this.state.logged < 0 ? '100%': 
                                                        (100/(this.state.estimated/(this.state.estimated - this.state.logged)))+"%"}} aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                                <div class="col-xl-12 info text-center">{this.state.estimated - this.state.logged < 0 ? 0 : this.state.estimated - this.state.logged} hours</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>  

                                <div class="row mb-3">
                                    <div class="col-xl-12 header mb-2 tag py-1">Dates</div>
                                    <div class="col tag"> 
                                        <div class="row my-1">
                                            <div class="col-xl-4 info d-flex"><span class="align-self-center">Start date</span></div>
                                            {
                                            !this.state.editStartDate ?
                                            <div class="col ticket-data modifiable py-1">
                                                <div class="row">
                                                    <div class="col text-center">{dateformat(this.state.startDate, "dd . mmmm . yyyy")}</div>
                                                    {
                                                        this.state.lane == 3 ? <div class="edit-field mr-1 d-flex" title="Modifying dates is disabled when ticket is closed"><img src="/images/disabled.svg" class="d-block mx-auto"/></div> :
                                                        <div class="edit-field mr-1 d-flex" onClick={this.setEditStartDate}><img src="/images/edit.svg" class="d-block mx-auto"/></div>
                                                    }
                                                </div>
                                            </div>
                                            :
                                            <SetDate date={this.state.startDate} set={this.setStartDate} error={this.state.errorStartDate}/>
                                            }
                                        </div>
                                       
                                        <div class="row my-1">
                                            <div class="col-xl-4 info d-flex"><span class="align-self-center">Due date</span></div>
                                            {
                                            !this.state.editDueDate ?
                                            <div class="col ticket-data modifiable py-1">
                                                <div class="row">
                                                    <div class="col text-center">{dateformat(this.state.dueDate, "dd . mmmm . yyyy")}</div>
                                                    {
                                                        this.state.lane == 3 ? <div class="edit-field mr-1 d-flex" title="Modifying dates is disabled when ticket is closed"><img src="/images/disabled.svg" class="d-block mx-auto"/></div> :
                                                        <div class="edit-field mr-1 d-flex" onClick={this.setEditDueDate}><img src="/images/edit.svg" class="d-block mx-auto"/></div>
                                                    }
                                                </div>
                                            </div>
                                            :
                                            <SetDate date={this.state.dueDate} set={this.setDueDate} error={this.state.errorDueDate}/>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col mb-2">
                            <ul class="nav nav-tabs bottom-nav tag ticket">
                                <li class="nav-item ticket-nav-item px-0">
                                    <a class={this.state.commentArea ? "nav-link ticket-link header px-2 py-2 ticket-link-active" : "nav-link ticket-link header px-2 py-2"} href="#" onClick={this.switchCommentArea}>Comments</a>
                                </li>
                                <li class="nav-item ticket-nav-item px-0">
                                    <a class={this.state.commentArea ? "nav-link ticket-link header px-2 py-2" : "nav-link ticket-link header px-2 py-2 ticket-link-active"} href="#" onClick={this.switchCommentArea}>Worklog</a>
                                </li>
                            </ul>
                        </div>
                        {
                            this.state.commentArea ? 
                            <CommentArea ticketId={this.state.id} disabled={this.state.lane == 3 ? true : false} /> : <WorkLogArea ticketId={this.state.id} log={this.addLogHours} unlog={this.removeLogHours} estimated={this.state.estimated} logged={this.state.logged} disabled={this.state.lane == 3 ? true : false}/>
                        }
                        
                    </div>
                </div>
            :
            <div class="container-fluid">
                <div class="row">
                    <div class="col info text-center">Loading ticket now....</div>
                </div>
            </div>
            :
            <div class="container-fluid">
                <div class="row">
                    <div class="col info text-center">No such ticket in the database</div>
                </div>
            </div>
        );
    }
}


export default ViewTicket;