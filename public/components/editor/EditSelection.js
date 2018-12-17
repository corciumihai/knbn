import React from 'react';
import { throws } from 'assert';

class EditSelection extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            value: '',
            inEditMode: false,
            items: [],
            selectedItem: {}
        }

        this.setFieldValue = this.setFieldValue.bind(this);
        this.enterEditMode = this.enterEditMode.bind(this);
        this.save = this.save.bind(this);
        this.setItem = this.setItem.bind(this);
    }

    componentWillReceiveProps(nextProps, nextState){
        if(nextProps.items != this.state.items){
            this.setState({items: nextProps.items});
        }
    }

    enterEditMode(){
        this.setState({inEditMode: true})
    }

    setFieldValue(event){
        this.setState({value: event.target.value}, () => {
            this.props.fetch(this.state.value);
        });
    }

    save(){
        this.setState({inEditMode: false})
    }

    setItem(item){
        this.setState({selectedItem: item, value: item.name});
    }

    render(){
        return(
            <div class="form-group">
                <label for="knbnFieldLabel" class="knbn-edit-field">{this.props.label}</label>
                <div class="knbn-input-grp knbn-fake-input-grp input-group dropdown">
                {this.state.inEditMode == false ? 
                    <div class="knbn-fake-input form-control text-truncate">{this.state.value == undefined || this.state.value.length == 0 ? <span class="knbn-label-muted">No text</span> : this.state.value}</div> 
                    : 
                    <input type="text" class="knbn-input form-control" id="knbnFieldLabel" aria-describedby="knbnHelp" 
                    placeholder={this.state.value == undefined || this.state.value.length == 0 ? "Enter release name" : ""}
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
                            this.state.items == undefined || this.state.items.length == 0 ? 
                            <a class="knbn-dropdown-item dropdown-item" href="#">No items found</a>
                            :
                            this.props.items.map(item => {return <a class="knbn-dropdown-item dropdown-item" href="#" key={item.id} onClick={()=>{this.setItem(item)}}>{item.name}</a>})
                        }
                    </div>
                </div>
                <small id="knbnHelp" class="knbn-edit-help form-text text-muted">{this.props.description}</small>
            </div>
        );
    }
}

export default EditSelection;