import React  from 'react';
import EditField from './editor/EditField';
import EditForm from './editor/EditForm';
import EditTextArea from './editor/EditTextArea';
import EditSelection from './editor/EditSelection';
import axios from 'axios';
import EditUser from './editor/EditUser';
import EditDate from './editor/EditDate';

class EditTicket extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            data: {},
            releases: [],
            priorities: [{id: 0, name: 'Low', dbName: 'low'}, {id: 1, name: 'Medium', dbName: 'medium'}, {id: 2, name: 'High', dbName: 'high'}],
        }

        // this.saveRelease = this.saveRelease.bind(this);
        // this.saveName = this.saveName.bind(this);
        // this.saveDescription = this.saveDescription.bind(this);
        // this.savePriority = this.savePriority.bind(this);
        // this.saveWIP = this.saveWIP.bind(this);
        // this.saveOwner = this.saveOwner.bind(this);
        this.saveDueDate = this.saveDueDate.bind(this);
    }

    componentDidMount(){
        axios.get('/get-ticket-data/' + this.props.match.params.ticketID).then(response => {            
            this.setState({data: response.data}, () => {
                axios.get('/get-releases').then(response => {
                    this.setState({releases: response.data});
                });
            });
            
        });
    }

    // saveRelease(release){axios.post('/set-component/release', {id: this.state.data.id, rel: release.id}).then();}
    // saveName(name){axios.post('/set-component/name', {id: this.state.data.id, name: name}).then();}
    // saveDescription(description){axios.post('/set-component/desc', {id: this.state.data.id, description: description}).then();}
    // savePriority(priority){axios.post('/set-component/prio', {id: this.state.data.id, priority: priority.dbName}).then();}
    // saveWIP(wip){axios.post('/set-component/wip', {id: this.state.data.id, wip: wip}).then();}
    // saveOwner(user){axios.post('/set-component/owner', {id: this.state.data.id, owner: user});}
    saveDueDate(date){axios.post('/set-component/due-date', {id: this.state.data.id, date: date});}

    render(){
        return(
            <div class={this.props.dark == true ? "container-fluid mt-3 px-0" : "knbn-container-light container-fluid mt-3 px-0"}>
                <div class="col-xl-12 col-12 d-flex">
                    <h3 class="knbn-header-3 w-100">Ticket Editor</h3>
                </div>
                <div class="col-xl-12 col-12 d-flex flex-xl-row flex-column">
                    <EditForm classes="col-xl-4 col-12 px-0">
                        <EditField
                            value={this.state.data.name}
                            label='Name' 
                            save={this.saveName}
                            description='Ticket name given when it was created'/>
                        <EditTextArea
                            value={this.state.data.description}
                            save={this.saveDescription}
                            label='Description' 
                            description='Ticket description given when it was created'/>
                        <EditSelection
                            value={(this.state.releases.length > 0 && this.state.data.releaseID != undefined) ? this.state.releases.find(rel => {return rel.id == this.state.data.releaseID}).name : ''}
                            label="Release"
                            description='Release for this ticket'
                            filterItems = {true}
                            items={this.state.releases}
                            filler="Release not set yet"
                            save={this.saveRelease}/>
                        <EditSelection
                            value={this.state.data.priority != undefined ? (this.state.data.priority== 'low' ? 'Low' : this.state.data.priority == 'medium' ? 'Medium' : 'High') : '' }
                            label="Priority"
                            description='Priority for this ticket'
                            filler="Priority not set yet"
                            items={this.state.priorities}
                            save={this.savePriority}/>
                    </EditForm>
                    <EditForm classes="col-xl-4 offset-xl-4 col-12 px-0">
                        {/* <EditUser
                            label='Edit owner'
                            user={this.state.data.owner}
                            // save={this.saveOwner}
                        /> */}
                        <EditDate
                            editable={false}
                            date={this.state.data.startDate}
                            label='Creation date'
                            description='Creation date'
                            save={this.saveDueDate}
                        />
                        <EditDate
                            editable={true}
                            date={this.state.data.dueDate}
                            label='Due date'
                            save={this.saveDueDate}
                            description='Due date for ticket'
                        />
                    </EditForm>
                </div>
            </div>
        );
    }
}

// ReactDOM.render(<EditCmp/>, document.getElementById('edit-cmp'));

export default EditTicket;