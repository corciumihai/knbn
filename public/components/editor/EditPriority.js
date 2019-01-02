import React from 'react';

class EditPriority extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            priority: {id: 0, name: 'low'},
            inEditMode: false,
            choices: [{id: 0, name: 'Low', dbName: 'low'}, {id: 1, name: 'Medium', dbName: 'medium'}, {id: 2, name: 'High', dbName: 'high'}],
            value: '',
            sortedChoices: [],
        }

        this.enterEditMode = this.enterEditMode.bind(this);
        this.save = this.save.bind(this);
        this.setPriority = this.setPriority.bind(this);
        this.setFieldValue = this.setFieldValue.bind(this);
        this.setItem = this.setItem.bind(this);
    }

    componentDidMount(){this.setState({sortedChoices: this.state.choices})}

    setPriority(prio){this.setState({priority: prio});}
    enterEditMode(){this.setState({inEditMode: true, value: ''})}
    save(){this.setState({inEditMode: false})}
    setFieldValue(event){this.setState({value: event.target.value}, () => {
        this.setState({sortedChoices: this.state.choices.filter(item => {return item.name.toLowerCase().includes(this.state.value.toLowerCase())})})
    })}
    setItem(item){this.setState({priority: item, value: item.name})}

    render(){
        return(
            <div class="form-group">
                <label for="knbnFieldLabel" class="knbn-edit-field">Priority</label>
                <div class="knbn-input-grp knbn-fake-input-grp input-group dropdown">
                {this.state.inEditMode == false ? 
                    <div class="knbn-fake-input form-control text-truncate">{this.state.priority.name == undefined || this.state.priority.name.length == 0 ? <span class="knbn-label-muted">No text</span> : 
                        this.state.priority.dbName == 'low' ? 'Low' : this.state.priority.dbName == 'medium' ? 'Medium' : 'High'
                    }</div> 
                    : 
                    <input type="text" class="knbn-input form-control" id="knbnFieldLabel" aria-describedby="knbnHelp" 
                    placeholder={this.state.value == undefined || this.state.value.length == 0 ? "Select priority" : ""}
                    value={this.state.value}
                    onChange={this.setFieldValue}
                    onClick={this.setFieldValue}
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"/>
                }
                    <div class="knbn-input-grp-append input-group-append d-flex">
                        <div class="input-group-text mx-1 d-flex my-auto">
                            {this.state.inEditMode ? 
                                <div>
                                    <img class="knbn-edit-btn mx-auto" src="./images/save.svg" onClick={this.save}></img>
                                </div>
                                :
                                <img class="knbn-edit-btn mx-auto" src="./images/edit.svg" onClick={this.enterEditMode}></img>}
                        </div>
                    </div>
                    <div id="knbnDropdownMenu" class="knbn-dropdown-menu dropdown-menu w-100">
                        {
                            this.state.sortedChoices == undefined || this.state.sortedChoices.length == 0 ? 
                            <a class="knbn-dropdown-item dropdown-item" href="#">No items found</a>
                            :
                            this.state.sortedChoices.map(item => {return <a class="knbn-dropdown-item dropdown-item" href="#" key={item.id} onClick={()=>{this.setItem(item)}}>{item.name}</a>})
                        }
                    </div>
                </div>
                <small id="knbnHelp" class="knbn-edit-help form-text text-muted">The priority of the current component</small>
            </div>
        );
    }
}

export default EditPriority;