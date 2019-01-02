import React from 'react';
import ReactQuill from 'react-quill';
import ReactHtmlParser from 'react-html-parser';

class EditTextArea extends React.Component{
    constructor(props){
        super(props);
        this.state={
            inEditMode: false,
            value: '',
            displayValue: '',
        }

        this.setFieldValue = this.setFieldValue.bind(this);
        this.save = this.save.bind(this);
        this.enableEditMode = this.enableEditMode.bind(this);
    }

    componentWillReceiveProps(nextProps, nextState){
        if(nextProps.value != this.state.value){
            this.setState({value: nextProps.value, displayValue: ReactHtmlParser(nextProps.value)});
        }
    }

    enableEditMode(){
        this.setState({inEditMode: true});
    }

    setFieldValue(value){
        this.setState({value: value}, () => {this.setState({displayValue: ReactHtmlParser(this.state.value)})});
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
                    <div class="knbn-fake-input form-control">
                        {
                            this.state.displayValue == undefined || this.state.displayValue.length == 0 ? <span class="knbn-label-muted">No text</span> 
                            : 
                            this.state.displayValue
                        }
                    </div>
                    : 
                    <ReactQuill value={this.state.value} onChange={this.setFieldValue} className='w-100 h-100'/>
                }
                    <div class="knbn-input-grp-append input-group-append d-flex">
                        <div class="input-group-text mx-1 d-flex my-1">
                            {this.state.inEditMode ? 
                            <img class="knbn-edit-btn mx-auto" src="./images/save.svg" onClick={this.save}></img>
                            :
                            <img class="knbn-edit-btn mx-auto d-none" src="./images/edit.svg" onClick={this.enableEditMode}></img>}
                        </div>
                    </div>
                </div>
                <small id="knbnHelp" class="knbn-edit-help form-text text-muted">{this.props.description}</small>
            </div>
        );
    }
}

export default EditTextArea;