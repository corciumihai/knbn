import React from 'react';
import ReactQuill from 'react-quill';
import ReactHtmlParser from 'react-html-parser';
import Label from '../editor/Label';
import Small from '../editor/Small';
import { connect } from 'react-redux';

class TextAreaField extends React.Component{
    constructor(props){
        super(props);
        this.state={
            value: '',
            displayValue: '',
        }

        this.setFieldValue = this.setFieldValue.bind(this);
    }

    componentWillReceiveProps(nextProps, nextState){
        if(nextProps.value != this.state.value){
            this.setState({value: nextProps.value, displayValue: ReactHtmlParser(nextProps.value)});
        }
    }

    setFieldValue(value){
        this.setState({value: value}, () => {this.props.action(this.state.value); this.setState({displayValue: ReactHtmlParser(this.state.value)})});
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
            <div class="form-group knbn-bg-transparent knbn-transition">
                {(this.props.label == undefined || this.props.label.length == 0) ? null : 
                    <Label label={this.props.label}/>
                }
                <div class={"input-group knbn-bg-transparent knbn-transition knbn-border" + (this.props.themeToggled ? " knbn-dark-border-2x knbn-dark-onselect" : " knbn-snow-border-3x knbn-snow-onselect")}>
                    <ReactQuill modules={quillModules} value={this.state.value} onChange={this.setFieldValue} className={"w-100 h-100 knbn-bg-transparent knbn-transition knbn-comp-desc" + (this.props.themeToggled ? " knbn-dark-color-5x knbn-dark-bg-2x knbn-dark-edit-bd-2x" : " knbn-snow-color-5x knbn-snow-bg-2x knbn-snow-edit-bd-2x")}/>
                </div> 
                <Small>{this.props.description}</Small>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(TextAreaField);