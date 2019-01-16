import React from 'react';
import ReactQuill from 'react-quill';
import ReactHtmlParser from 'react-html-parser';
import Label from '../editor/Label';
import Small from '../editor/Small';
import { connect } from 'react-redux';

class TextAreaField extends React.Component{
    render(){
        return(
            <div class="form-group knbn-bg-transparent knbn-transition">
                {(this.props.label == undefined || this.props.label.length == 0) ? null : 
                    <Label label={this.props.label}/>
                }
                <div class={"knbn-input-grp knbn-fake-input-grp input-group knbn-bg-transparent knbn-transition" + (this.props.themeToggled ? " knbn-dark-border-2x knbn-dark-onselect" : " knbn-snow-border-3x knbn-snow-onselect")}>
                    <ReactQuill value={this.state.value} onChange={this.setFieldValue} className={"w-100 h-100 knbn-bg-transparent knbn-transition" + (this.props.themeToggled ? " knbn-dark-color-5x knbn-dark-bg-2x knbn-dark-edit-bd-2x" : " knbn-snow-color-5x knbn-snow-bg-2x knbn-snow-edit-bd-2x")}/>
                </div> 
                <Small>{this.props.description}</Small>
            </div>
        );
    }

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
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(TextAreaField);