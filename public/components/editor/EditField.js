import React from 'react';
import EditButton from './EditButton';
import Label from './Label';
import Small from './Small';
import { connect } from 'react-redux';

class EditField extends React.Component{
    render(){
        return(
            <div class="form-group knbn-bg-transparent">
                <Label label={this.props.label}/>
                <div class={"knbn-input-grp knbn-fake-input-grp input-group knbn-transition" + (this.props.themeToggled ? " knbn-dark-border-2x knbn-dark-onselect" : " knbn-snow-border-2x knbn-snow-onselect")}>
                {this.state.inEditMode == false ? 
                    <div class={"knbn-fake-input form-control text-truncate knbn-bg-transparent" + (this.props.themeToggled == true ? " knbn-dark-color-5x" : " knbn-snow-color-5x")}>
                        {this.state.value == undefined || this.state.value.length == 0 ? 
                        <span>
                            {this.props.filler == undefined || this.props.filler.length == 0 ? 'No data available' : this.props.filler}
                        </span> : this.state.value}
                    </div> 
                    :
                    <input type="text" class={"knbn-input form-control knbn-editing-mode knbn-bg-transparent" + 
                    (this.props.themeToggled == true ? 
                        " knbn-dark-color-4x knbn-dark-bg-2x knbn-dark-bg-2x-active" 
                        : 
                        " knbn-snow-color-4x knbn-snow-bg-2x knbn-snow-bg-2x-active")} aria-describedby="knbnHelp" 
                    style={{after: "content: " + this.props.after}}
                    placeholder={this.state.value == undefined || this.state.value.length == 0 ? "Enter item name" : ""}
                    value={this.state.value}
                    onChange={this.setFieldValue}/>
                }
                    <EditButton edit={this.state.inEditMode} save={this.save} enableEditMode={()=>{this.setState({inEditMode: true})}}/>
                </div>
                <Small>{this.props.description}</Small>
            </div>
        );
    }

    constructor(props){
        super(props);
        this.state={
            inEditMode: false,
            value: '',
        }

        this.setFieldValue = this.setFieldValue.bind(this);
        this.save = this.save.bind(this);
    }

    componentWillReceiveProps(nextProps, nextState){if(nextProps.value != this.state.value){this.setState({value: nextProps.value})}}

    setFieldValue(event){this.setState({value: event.target.value})}

    save(){
        this.setState({inEditMode: false});
        this.props.save != null || this.props.save != undefined ? this.props.save(this.state.value) : {}
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
    }
}

export default connect(mapStateToProps)(EditField);