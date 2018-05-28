import React from 'react';
import ReactDom from 'react-dom';
import axios from 'axios';
import {Switch, Route} from 'react-router-dom';
import dateformat from 'dateformat';
import PriorityDropdown from './components/view/PriorityDropdown';
import ReleaseDropdown from './components/view/ReleaseDropdown';
import CategoryDropdown from './components/view/CategoryDropdown';
import Estimation from './components/view/Estimation';

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

            editPrio: false,
            editRelease: false,
            editDiscipline: false,
            editEstimation: false,
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
    }

    componentWillMount(){
        axios.get('/get-ticket/' + this.props.match.params.id).then(response => {
            let ticket = response.data.ticket; 
            let release = response.data.release;
            // console.log(release);
            let project = response.data.project;
            let component = response.data.component;
            let discipline = response.data.discipline;
            // console.log(discipline);
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
                dueDate: ticket.dueDate,
                //ticket start date
                startDate: ticket.startDate,
                //estimated work hours
                estimated: ticket.estimation,
                //logged work hours
                logged: ticket.logged,
                loading: false,

            }, () => {console.log(this.state)}); 
        });
    }

    editName(){
        this.setState({editing: !this.state.editName, tempName: this.state.name});
    }

    setName(){
        this.setState({name: this.state.tempName, editing: false}, () => {
            axios.post('/update/ticket', {id: this.state.id, name: this.state.name}).then()
        });
    }

    setNameOnKeyPess(event){
        if(event.charCode != 13){return;}
        this.setState({name: this.state.tempName, editing: false}, () => {
            axios.post('/update/ticket', {id: this.state.id, name: this.state.name}).then()
        });
    }

    changeTempName(event){
        let value = event.target.value;
        if(value.length > this.state.tempName.length && this.state.charCounter - value.length == -1) {return;}
        this.setState({tempName: event.target.value});
    }

    setEditPrio(){ this.setState({editPrio: !this.state.editPrio}); }

    setEditRelease(){ this.setState({editRelease: !this.state.editRelease}); }

    setEditDiscipline(){this.setState({editDiscipline: !this.state.editDiscipline});}

    setEditEstimation(){this.setState({editEstimation: !this.state.editEstimation});}

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

    render(){
        let dueDate = new Date(parseInt(this.state.dueDate));
        let startDate = new Date(parseInt(this.state.startDate));
        return (
            
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xl-6 mb-3">
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="col-xl-12 header mb-2 tag py-1">Modifiable attributes</div>
                                    <div class="col tag"> 
                                        <div class="row my-1">
                                            <div class="col-xl-4 info d-flex"><span class="align-self-center">Priority</span></div>
                                            {!this.state.editPrio ?
                                            <div class="col ticket-data modifiable py-1">
                                                <div class="row">
                                                    <div class="edit-field ml-1"><img title="Priority" src={"/images/" + (this.state.priority == 1 ? "low.svg" : this.state.priority == 2 ? "neuter.svg" : "high.svg")} class="d-block mx-auto"/></div>
                                                    <div class="col">{this.state.priority == 1 ? "Low" : this.state.priority == 2? "Medium" : "High"}</div>
                                                    <div class="edit-field mr-1" onClick={this.setEditPrio} title="Edit"><img src="/images/edit.svg" class="d-block mx-auto"/></div>
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
                                                    <div class="edit-field ml-1" title="Release"><img src="/images/release.svg" class="d-block mx-auto"/></div>
                                                    <div class="col">{this.state.release.name}</div>
                                                    <div class="edit-field mr-1" onClick={this.setEditRelease} title="Edit"><img src="/images/edit.svg" class="d-block mx-auto"/></div>
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
                                                    <div class="edit-field ml-1" title="Category"><img src="/images/category.svg" class="d-block mx-auto"/></div>
                                                    <div class="col">{this.state.discipline.name}</div>
                                                    <div class="edit-field mr-1" onClick={this.setEditDiscipline} title="Edit"><img src="/images/edit.svg" class="d-block mx-auto"/></div>
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
                                                        <div class="edit-field ml-1" title="Estimation"><img src="/images/estimation.svg" class="d-block mx-auto"/></div>
                                                        <div class="col">{this.state.estimated} hours</div>
                                                        <div class="edit-field mr-1" onClick={this.setEditEstimation} title="Edit"><img src="/images/edit.svg" class="d-block mx-auto"/></div>
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
                                            <div class="col ticket-data modifiable py-1">
                                                <div class="row">
                                                    <div class="col">{dateformat(startDate, "dd-mmmm-yyyy")}</div>
                                                    <div class="edit-field mr-1"><img src="/images/edit.svg" class="d-block mx-auto"/></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row my-1">
                                            <div class="col-xl-4 info d-flex"><span class="align-self-center">Due date</span></div>
                                            <div class="col ticket-data modifiable py-1">
                                                <div class="row">
                                                    <div class="col">{dateformat(dueDate, "dd-mmmm-yyyy")}</div>
                                                    <div class="edit-field mr-1"><img src="/images/edit.svg" class="d-block mx-auto"/></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                    </div>
                </div>
            </div>
            :
            <div class="container-fluid">
                <div class="row">
                    <div class="col info text-center">Unable to find ticket. Please check again if the conditions are valid</div>
                </div>
            </div>
        );
    }
}


export default ViewTicket;