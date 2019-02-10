import React from 'react';
import ReactQuill from 'react-quill';
import ReactHtmlParser from 'react-html-parser';
import EditButton from './EditButton';
import Label from './Label';
import Small from './Small';
import { connect } from 'react-redux';
import RemoveItem from '../create/RemoveItem';
import SaveButton from './SaveButton';
import striptags from 'striptags';

class EditTextArea extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            inEditMode: false,
            value: '',
            displayValue: '',
        }

        this.setFieldValue = this.setFieldValue.bind(this);
        this.save = this.save.bind(this);
        this.setEditMode = this.setEditMode.bind(this);
    }

    componentDidMount(){
        if(this.props.value != undefined && this.props.value.length > 0){
            this.setState({value: this.props.value, displayValue: ReactHtmlParser(this.props.value)})
        }
    }

    componentWillReceiveProps(nextProps, nextState){
        if(nextProps.value != undefined && nextProps.value.length > 0){
            this.setState({value: nextProps.value, displayValue: ReactHtmlParser(nextProps.value)})
        }
    }

    setEditMode(){
        this.setState({inEditMode: !this.state.inEditMode});
    }

    setFieldValue(value){
        this.setState({value: value}, () => {this.setState({displayValue: ReactHtmlParser(this.state.value)})});
    }

    save(){
        this.setState({inEditMode: false});
        this.props.save != null || this.props.save != undefined ? this.props.save(this.state.value) : {}
    }

    render(){
        let quillModules = {
            toolbar: [
              ['bold', 'italic', 'underline','strike', 'blockquote'],
              [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
              ['link'],
              ['clean']
            ],
        }
        
        return(
            <div class="form-group knbn-bg-transparent">
                {
                    (this.props.label == undefined || this.props.label.length == 0) ? 
                    null 
                    : 
                    <Label label={this.props.label}/>
                }
                {
                    this.state.inEditMode == false ? 
                        <RemoveItem remove={this.setEditMode} canEdit={this.props.canEdit} classes={"w-100"} mute={striptags(this.state.value).length == 0}>
                        {
                            striptags(this.state.value).length ? this.state.displayValue : "Niciun text introdus"
                        }
                        </RemoveItem>
                        : 
                        <div class={"d-flex flex-row input-group knbn-bg-transparent knbn-transition knbn-border knbn-no-box-shadow" + (this.props.themeToggled ? " knbn-dark-border-2x knbn-dark-onselect" : " knbn-snow-border-2x knbn-snow-onselect")}>
                            <div class="col px-0">
                                <ReactQuill modules={quillModules} value={this.state.value} onChange={this.setFieldValue} className={"w-100 h-100 knbn-bg-transparent" + (this.props.themeToggled ? " knbn-dark-color-5x knbn-dark-edit-bd-2x knbn-dark-bg-2x"  : " knbn-snow-color-4x knbn-snow-bg-3x knbn-snow-bg-3x-active knbn-snow-border-3x knbn-snow-edit-bd-2x")}/>
                            </div>
                            <SaveButton edit={this.state.inEditMode} save={this.save} enableEditMode={()=>{this.setState({inEditMode: true})}}/>
                        </div>
                }
                <Small>{this.props.description}</Small>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
        isAdmin: state.isAdmin,
        currentUser: state.currentUser
    }
}

export default connect(mapStateToProps)(EditTextArea);