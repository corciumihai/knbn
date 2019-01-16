import React from 'react';
import ReactQuill from 'react-quill';
import ReactHtmlParser from 'react-html-parser';
import EditButton from './EditButton';
import Label from './Label';
import Small from './Small';
import { connect } from 'react-redux';
import RemoveItem from '../create/RemoveItem';
import SaveButton from './SaveButton';

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

    componentWillMount(){
        if(this.props.value != undefined && this.props.value.length > 0){
            this.setState({value: this.props.value, displayValue: ReactHtmlParser(this.props.value), inEditMode: false})
        }
        else{
            this.setState({inEditMode: true});
        }
    }

    componentWillReceiveProps(nextProps, nextState){
        if(nextProps.value != undefined && nextProps.value.length > 0){
            this.setState({value: nextProps.value, displayValue: ReactHtmlParser(nextProps.value), inEditMode: false})
        }
        else{
            this.setState({inEditMode: true});
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
        return(
            <div class="form-group knbn-bg-transparent">
                {
                    (this.props.label == undefined || this.props.label.length == 0) ? null : 
                    <Label label={this.props.label}/>
                }
                
                {this.state.inEditMode == false ? 
                    this.state.displayValue != undefined && this.state.displayValue.length > 0 ? 
                    <RemoveItem remove={this.setEditMode} classes={"w-100"}>{this.state.displayValue}</RemoveItem>
                    :
                    "Introdu valoare"
                       
                    : 
                    
                    <div class={"knbn-input-grp knbn-fake-input-grp input-group knbn-bg-transparent knbn-transition" + (this.props.themeToggled ? " knbn-dark-border-2x knbn-dark-onselect" : " knbn-snow-border-2x knbn-snow-onselect")}>
                        <ReactQuill value={this.state.value} onChange={this.setFieldValue} className={"w-100 h-100 knbn-bg-transparent" + (this.props.themeToggled ? " knbn-dark-color-5x knbn-dark-edit-bd-2x knbn-dark-bg-2x"  : " knbn-snow-bg-2x knbn-snow-color-5x knbn-snow-edit-bd-2x")}/>
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
    }
}

export default connect(mapStateToProps)(EditTextArea);