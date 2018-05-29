import React from 'react';
import ReactDom from 'react-dom';
import axios from 'axios';
import {Switch, Route} from 'react-router-dom';
import dateformat from 'dateformat';
import PriorityDropdown from './components/view/PriorityDropdown';
import ReleaseDropdown from './components/view/ReleaseDropdown';
import CategoryDropdown from './components/view/CategoryDropdown';
import Estimation from './components/view/Estimation';
import SetDate from './components/view/SetDate';
import User from './components/view/User';

class ViewTicket extends React.Component{
    constructor(props){
        super(props);

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

            editPrio: false,
            editRelease: false,
            editDiscipline: false,
            editEstimation: false,
            editDueDate: false,
            editStartDate: false,
            noResponse: false,
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
                loading: false,

            }, () => {console.log(this.state)}); 
        });
    }

    editName(){
        this.setState({editing: !this.state.editName, tempName: this.state.name});
    }

    setName(){
        if(this.state.tempName.length == 0){ return; }
        this.setState({name: this.state.tempName, editing: false}, () => {
            axios.post('/update/ticket', {id: this.state.id, name: this.state.name}).then()
        });
    }

    setNameOnKeyPess(event){
        if(event.charCode != 13){return;}
        if(this.state.tempName.length == 0){ return; }
        this.setState({name: this.state.tempName, editing: false}, () => {
            axios.post('/update/ticket', {id: this.state.id, name: this.state.name}).then()
        });
    }

    changeTempName(event){
        let value = event.target.value;
        // if(value.length == 0){ return; }
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

    setPrio(prio){
        if(prio == undefined){{editPrio: false}}
        this.setState({priority: prio.id, editPrio: false}, () => {
            //update ticket priority in database
        });
    }

    setRelease(release){
        let releaseName = release.value;
        let releaseId = release.key;
        this.setState({editRelease: false, release: {name: releaseName, id: releaseId}}, () => {
            //update release id in database
        });
    }

    setDiscipline(discipline){
        let disName = discipline.value;
        let disId = discipline.key;
        this.setState({editDiscipline: false, discipline: {name: disName, id: disId}}, () => {
            //update discipline id in database
        });
    }

    setEstimation(estimation){
        this.setState({estimated: estimation, editEstimation: false}, () => {
            //set estimation in database
        });
    }

    setStartDate(date){ this.setState({startDate:date, editStartDate: false}); }
    setDueDate(date){ this.setState({dueDate:date, editDueDate: false}); }
    setReporter(reporter){ this.setState({reporter: reporter, editReporter: false}); }
    setAssignee(assignee){ this.setState({assignee: assignee, editAssignee: false}); }

    render(){
        // let dueDate = new Date(parseInt(this.state.dueDate));
        // let startDate = ;
        return (
            !this.state.noResponse ? 
            !this.state.loading ?
            <div class="container-fluid">
                <div class="view-ticket col-xl-6 offset-xl-3">
                    <div class="row mb-3">
                        <div class="container-fluid">
                        <div class="col-xl-12 header mb-2 tag py-1">Ticket name</div>
                        <div class={this.state.editing ? "col name text-truncate px-3 permanent-border": "col name text-truncate px-3"}> 
                            {!this.state.editing ?
                            <div class="row">
                                <div class="col">{this.state.name} </div>
                                <div class="d-flex">
                                    <div class="edit align-self-center d-flex mr-2" onClick={this.editName}>
                                        <img src="/images/edit.svg" class="d-block mx-auto"/>
                                    </div>
                                </div>
                            </div>
                            :
                            <div class="row">
                                <div class="col">
                                    <input type="text" class="form-control form-big-font py-0 px-0" onChange={this.changeTempName} value={this.state.tempName} onKeyPress={this.setNameOnKeyPess}/>
                                </div>
                                <div class="d-flex">
                                    <div class="edit align-self-center d-flex mr-2" onClick={this.setName}>
                                        <img src="/images/save.svg" class="d-block mx-auto"/>
                                    </div>
                                </div>
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
                                            <div class="col-xl-2 info">Ticket ID</div><div class="col ticket-data py-1">{this.state.project.shortName + '-' + this.state.id}</div>
                                        </div>
                                        <div class="row my-1">
                                            <div class="col-xl-2 info">Component</div><div class="col ticket-data py-1">{this.state.component.name}</div>
                                        </div>
                                        <div class="row my-1">
                                            <div class="col-xl-2 info">Last modified on</div><div class="col ticket-data py-1">Some day</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-xl-6 mb-3">
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
                                                    <div class="col">{this.state.reporter.name}</div>
                                                    <div class="edit-field mr-1 d-flex" onClick={this.setEditReporter} title="Edit"><img src="/images/edit.svg" class="d-block mx-auto"/></div>
                                                </div>
                                            </div>
                                            :
                                            <User key={this.state.reporter.email} user={this.state.reporter} set={this.setReporter}/>
                                            }
                                            
                                        </div>
                                        <div class="row my-1">
                                            <div class="col-xl-4 info d-flex"><span class="align-self-center">Assignee</span></div>
                                            {
                                            !this.state.editAssignee ? 
                                            <div class="col ticket-data modifiable py-1">
                                                <div class="row">
                                                    <div class="edit-field ml-1 d-flex" title="Assignee"><img src="/images/user.svg" class="d-block mx-auto"/></div>
                                                    <div class="col">{this.state.assignee.name}</div>
                                                    <div class="edit-field mr-1 d-flex" onClick={this.setEditAssignee} title="Edit"><img src="/images/edit.svg" class="d-block mx-auto"/></div>
                                                </div>
                                            </div>
                                            :
                                            <User key={this.state.assignee.email} user={this.state.assignee} set={this.setAssignee}/>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xl-12 header mb-2 tag py-1">Modifiable attributes</div>
                                    <div class="col tag"> 
                                        <div class="row my-1">
                                            <div class="col-xl-4 info d-flex"><span class="align-self-center">Priority</span></div>
                                            {!this.state.editPrio ?
                                            <div class="col ticket-data modifiable py-1">
                                                <div class="row">
                                                    <div class="edit-field ml-1 d-flex"><img title="Priority" src={"/images/" + (this.state.priority == 1 ? "low.svg" : this.state.priority == 2 ? "neuter.svg" : "high.svg")} class="d-block mx-auto"/></div>
                                                    <div class="col">{this.state.priority == 1 ? "Low" : this.state.priority == 2? "Medium" : "High"}</div>
                                                    <div class="edit-field mr-1 d-flex" onClick={this.setEditPrio} title="Edit"><img src="/images/edit.svg" class="d-block mx-auto"/></div>
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
                                                    <div class="col">{this.state.release.name}</div>
                                                    <div class="edit-field mr-1 d-flex" onClick={this.setEditRelease} title="Edit"><img src="/images/edit.svg" class="d-block mx-auto"/></div>
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
                                                    <div class="col">{this.state.discipline.name}</div>
                                                    <div class="edit-field mr-1 d-flex" onClick={this.setEditDiscipline} title="Edit"><img src="/images/edit.svg" class="d-block mx-auto"/></div>
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
                                                        <div class="col">{this.state.estimated} hours</div>
                                                        <div class="edit-field mr-1 d-flex" onClick={this.setEditEstimation} title="Edit"><img src="/images/edit.svg" class="d-block mx-auto"/></div>
                                                    </div>
                                                    :
                                                    <Estimation est={this.state.estimated} set={this.setEstimation}/>
                                            }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-6 mb-3">
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
                                                <div class="col-xl-12 info text-center">{this.state.estimated} hours</div>
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
                                                        style={{width: (100/(this.state.estimated/(this.state.estimated - this.state.logged)))+"%"}} aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                                <div class="col-xl-12 info text-center">{this.state.estimated - this.state.logged} hours</div>
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
                                                    <div class="edit-field mr-1 d-flex" onClick={this.setEditStartDate}><img src="/images/edit.svg" class="d-block mx-auto"/></div>
                                                </div>
                                            </div>
                                            :
                                            <SetDate date={this.state.startDate} set={this.setStartDate}/>
                                            }
                                        </div>
                                       
                                        <div class="row my-1">
                                            <div class="col-xl-4 info d-flex"><span class="align-self-center">Start date</span></div>
                                            {
                                            !this.state.editDueDate ?
                                            <div class="col ticket-data modifiable py-1">
                                                <div class="row">
                                                    <div class="col text-center">{dateformat(this.state.dueDate, "dd . mmmm . yyyy")}</div>
                                                    <div class="edit-field mr-1 d-flex" onClick={this.setEditDueDate}><img src="/images/edit.svg" class="d-block mx-auto"/></div>
                                                </div>
                                            </div>
                                            :
                                            <SetDate date={this.state.dueDate} set={this.setDueDate}/>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                    </div>
                    <div class="row mb-3">
                        <div class="col">
                            <ul class="nav nav-tabs tag">
                                <li class="nav-item">
                                    <a class="nav-link active header px-2 py-2" href="#">Comments</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link header px-2 py-2" href="#">Worklog</a>
                                </li>
                                {/* <li class="nav-item">
                                    <a class="nav-link disabled" href="#">Disabled</a>
                                </li> */}
                            </ul>
                        </div>
                    </div>
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