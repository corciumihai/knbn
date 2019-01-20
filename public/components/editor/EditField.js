import React from 'react';
import Label from './Label';
import Small from './Small';
import { connect } from 'react-redux';
import RemoveItem from '../create/RemoveItem';
import SaveButton from './SaveButton';

class EditField extends React.Component{
    constructor(props){
        super(props);
        this.state={
            inEditMode: false,
            value: '',
        }

        this.setFieldValue = this.setFieldValue.bind(this);
        this.save = this.save.bind(this);
        this.setEditMode = this.setEditMode.bind(this);
    }

    componentWillMount()
    {
        if(this.props.value != undefined){
            this.setState({value: this.props.value, inEditMode: false})
        }
        else{
            this.setState({inEditMode: true});
        }
    }

    componentWillReceiveProps(nextProps, nextState)
    {
        if(nextProps.value != undefined){
            this.setState({value: nextProps.value, inEditMode: false})
        }
        else{
            this.setState({inEditMode: true});
        }
    }

    setEditMode(){
        this.setState({inEditMode: !this.state.inEditMode});
    }

    setFieldValue(event){this.setState({value: event.target.value})}

    save(){
        this.setState({inEditMode: false});
        this.props.save != null || this.props.save != undefined ? this.props.save(this.state.value) : {}
    }

    render(){
        return(
            <div class="form-group knbn-bg-transparent">
                <Label label={this.props.label}/>
                
                {this.state.inEditMode == false ? 
                    this.state.value != undefined ? 
                    <RemoveItem remove={this.setEditMode}>{this.state.value}</RemoveItem>
                    :
                    null
                :
                <div class={"knbn-input-grp knbn-fake-input-grp input-group knbn-transition knbn-font-medium" + (this.props.themeToggled ? " knbn-dark-border-2x knbn-dark-onselect" : " knbn-snow-border-2x knbn-snow-onselect")}>
                    <input  type="text" class={"knbn-input form-control knbn-editing-mode knbn-bg-transparent" + 
                            (this.props.themeToggled == true ? 
                                " knbn-dark-color-4x knbn-dark-bg-2x knbn-dark-bg-2x-active" 
                                : 
                                " knbn-snow-color-4x knbn-snow-bg-2x knbn-snow-bg-2x-active")} aria-describedby="knbnHelp" 
                            placeholder={this.state.value == undefined ? "Introdu nume" : ""}
                            value={this.state.value}
                            onChange={this.setFieldValue}
                    />
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

export default connect(mapStateToProps)(EditField);