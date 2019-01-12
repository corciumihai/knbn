import React  from 'react';
import EditField from './editor/EditField';
import EditForm from './editor/EditForm';
import EditTextArea from './editor/EditTextArea';
import EditSelection from './editor/EditSelection';
import axios from 'axios';
import EditUser from './editor/EditUser';
import EditDate from './editor/EditDate';
import CommentArea from './comments/CommentArea';
import Header3 from './editor/Header3';
import { connect } from 'react-redux';

class EditComponent extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            data: {},
            releases: [],
            priorities: [{id: 0, name: 'Low', dbName: 'low'}, {id: 1, name: 'Medium', dbName: 'medium'}, {id: 2, name: 'High', dbName: 'high'}],
        }

        this.saveRelease = this.saveRelease.bind(this);
        this.saveName = this.saveName.bind(this);
        this.saveDescription = this.saveDescription.bind(this);
        this.savePriority = this.savePriority.bind(this);
        this.saveOwner = this.saveOwner.bind(this);
        this.saveDueDate = this.saveDueDate.bind(this);
    }

    componentWillMount(nextProps, nextState){
        axios.get('/get-component-data/' + this.props.match.params.compID).then(response => {
            var tempData = response.data;
            axios.get('/get-releases').then(response => {
                this.setState({data: tempData, releases: response.data});
            });
        });
    }

    saveRelease(release){axios.post('/set-component/release', {id: this.state.data.id, rel: release.id}).then();}
    saveName(name){axios.post('/set-component/name', {id: this.state.data.id, name: name}).then();}
    saveDescription(description){axios.post('/set-component/desc', {id: this.state.data.id, description: description}).then();}
    savePriority(priority){axios.post('/set-component/prio', {id: this.state.data.id, priority: priority.dbName}).then();}
    saveOwner(user){axios.post('/set-component/owner', {id: this.state.data.id, owner: user});}
    saveDueDate(date){axios.post('/set-component/due-date', {id: this.state.data.id, date: date});}

    render(){
        return(
            <div class={"container-fluid mt-3 px-0 py-2 knbn-transition" 
            // + (this.props.themeToggled == true ? " knbn-dark-bg-2x" : " knbn-snow-bg-2x")
            }>
                <div class="col-xl-12 col-12 d-flex">
                    <Header3>Component Editor</Header3>
                </div>
                <div class="col-xl-12 col-12 d-flex flex-xl-row flex-column">
                    <EditForm>
                        <EditField
                            value={this.state.data.name}
                            label='Name' 
                            save={this.saveName}
                            description='Component name given when it was created'
                        />
                        <EditTextArea
                            value={this.state.data.description}
                            save={this.saveDescription}
                            label='Description' 
                            description='Component description given when it was created'
                            canEdit={true}
                        />
                        <EditSelection
                            value={(this.state.releases.length > 0 && this.state.data.releaseID != undefined) ? this.state.releases.find(rel => {return rel.id == this.state.data.releaseID}).name : ''}
                            label="Release"
                            description='Release for this component'
                            filterItems = {true}
                            items={this.state.releases}
                            filler="Release not set yet"
                            save={this.saveRelease}
                        />
                        <EditSelection
                            value={this.state.data.priority != undefined ? (this.state.data.priority== 'low' ? 'Low' : this.state.data.priority == 'medium' ? 'Medium' : 'High') : '' }
                            label="Priority"
                            description='Priority for this component'
                            filler="Priority not set yet"
                            items={this.state.priorities}
                            save={this.savePriority}
                        />
                    </EditForm>
                    <EditForm classes={"offset-xl-4"}>
                        <EditUser
                            label='Edit owner'
                            user={this.state.data.owner}
                            save={this.saveOwner}
                        />
                        <EditDate
                            editable={false}
                            date={this.state.data.startDate}
                            label='Creation date'
                            description='Creation date'
                        />
                        <EditDate
                            editable={true}
                            date={this.state.data.dueDate}
                            label='Due date'
                            save={this.saveDueDate}
                            description='Due date for component'
                        />
                    </EditForm>
                </div>

                <CommentArea compID={this.state.data.id}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(EditComponent);