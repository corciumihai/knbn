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

    componentWillReceiveProps(nextProps, nextState){
        if(nextProps.value != this.state.value){this.setState({value: nextProps.value})}
    }

    setFieldValue(event){
        this.setState({value: event.target.value})
    }

    save(){
        this.setState({inEditMode: false});
        this.props.save != null || this.props.save != undefined ? this.props.save(this.state.value) : {}
    }

    render(){
        return(
            <div class="form-group">
                <label for="knbnFieldLabel" class="knbn-edit-field">{this.props.label}</label>
                <div class="knbn-input-grp knbn-fake-input-grp input-group">
                {this.state.inEditMode == false ? 
                    <div class="knbn-fake-input form-control text-truncate" style={{after: "content: " + this.props.after}}>
                        {this.state.value == undefined || this.state.value.length == 0 ? 
                        <span class="knbn-label-muted">
                            {this.props.filler == undefined || this.props.filler.length == 0 ? 'No data available' : this.props.filler}
                        </span> : this.state.value}
                    </div> 
                    : 
                    <input type="text" class="knbn-input form-control" id="knbnFieldLabel" aria-describedby="knbnHelp" 
                    style={{after: "content: " + this.props.after}}
                    placeholder={this.state.value == undefined || this.state.value.length == 0 ? "Enter component name" : ""}
                    value={this.state.value}
                    onChange={this.setFieldValue}/>
                }
                    <div class="knbn-input-grp-append input-group-append d-flex">
                        <div class="input-group-text mx-1 d-flex my-auto">
                            {this.state.inEditMode ? 
                            <img class="knbn-edit-btn mx-auto" src="./images/save.svg" onClick={this.save}></img>
                            :
                            <img class="knbn-edit-btn mx-auto d-none" src="./images/edit.svg" onClick={()=>{this.setState({inEditMode: true})}}></img>}
                        </div>
                    </div>
                </div>
                <small id="knbnHelp" class="knbn-edit-help form-text text-muted">{this.props.description}</small>
            </div>
        );
    }
}

export default EditField;