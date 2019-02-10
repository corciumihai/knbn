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

    componentDidMount()
    {
        if(this.props.value != undefined){
            this.setState({value: this.props.value})
        }
    }

    componentWillReceiveProps(nextProps, nextState)
    {
        if(nextProps.value != undefined){
            this.setState({value: nextProps.value})
        }
    }

    setEditMode(){
        this.setState({inEditMode: !this.state.inEditMode, value: this.props.value});
    }

    setFieldValue(event){this.setState({value: event.target.value})}

    save(){
        this.setState({inEditMode: false},
            this.props.save != null || this.props.save != undefined ? this.props.save(this.state.value) : null
        );
    }

    render(){        
        return(
            <div class="form-group knbn-bg-transparent">
                <Label label={this.props.label}/>

                {this.state.inEditMode == false ? 
                <RemoveItem remove={this.setEditMode} canEdit={this.props.canEdit}>
                    {this.props.value}
                </RemoveItem>

                :
                <div class={"input-group knbn-transition knbn-font-medium knbn-border" + (this.props.themeToggled ? " knbn-dark-border-2x knbn-dark-onselect" : " knbn-snow-border-2x knbn-snow-onselect")}>
                    <input  type="text" 
                            class={"knbn-no-border knbn-font-medium knbn-no-box-shadow knbn-no-border-radius knbn-border-transparent form-control knbn-editing-mode knbn-bg-transparent" + 
                            (this.props.themeToggled == true ? 
                                " knbn-dark-color-4x knbn-dark-bg-2x knbn-dark-bg-2x-active knbn-dark-border-2x" 
                                : 
                                " knbn-snow-color-4x knbn-snow-bg-3x knbn-snow-bg-3x-active knbn-snow-border-3x")} 
                            aria-describedby="knbnHelp" 
                            placeholder={this.state.value == undefined ? "Introdu caractere" : ""}
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
        isAdmin: state.isAdmin,
        currentUser: state.currentUser
    }
}

export default connect(mapStateToProps)(EditField);