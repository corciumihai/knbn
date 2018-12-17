import React from 'react';

class EditField extends React.Component{
    constructor(props){
        super(props);
        this.state={
            inEditMode: false,
            value: '',
        }

        this.setFieldValue = this.setFieldValue.bind(this);
        this.save = this.save.bind(this);
    }
    
    componentDidMount(){
        this.setState({value: this.props.value});
    }

    setFieldValue(event){
        this.setState({value: event.target.value})
    }

    save(){
        this.setState({inEditMode: false});
    }

    render(){
        return(
            <div class="form-group">
                <label for="knbnFieldLabel" class="knbn-edit-field">{this.props.label}</label>
                <div class="knbn-input-grp knbn-fake-input-grp input-group">
                {this.state.inEditMode == false ? 
                    <div class="knbn-fake-input form-control text-truncate">{this.state.value == undefined || this.state.value.length == 0 ? <span class="knbn-label-muted">No text</span> : this.state.value}</div> 
                    : 
                    <input type="text" class="knbn-input form-control" id="knbnFieldLabel" aria-describedby="knbnHelp" 
                    placeholder={this.state.value == undefined || this.state.value.length == 0 ? "Enter component name" : ""}
                    value={this.state.value}
                    onChange={this.setFieldValue}/>
                }
                    <div class="knbn-input-grp-append input-group-append d-flex">
                        <div class="input-group-text mx-1 d-flex my-auto">
                            {this.state.inEditMode ? 
                            <img class="knbn-edit-btn mx-auto" src="./images/save.svg" onClick={this.save}></img>
                            :
                            <img class="knbn-edit-btn mx-auto" src="./images/edit.svg" onClick={()=>{this.setState({inEditMode: true})}}></img>}
                        </div>
                    </div>
                </div>
                <small id="knbnHelp" class="knbn-edit-help form-text text-muted">{this.props.description}</small>
            </div>
        );
    }
}

export default EditField;