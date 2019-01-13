import React from 'react';
import Label from '../editor/Label';
import Small from '../editor/Small';
import { connect } from 'react-redux';

class InputField extends React.Component{
    constructor(props){
        super(props);

        this.set = this.set.bind(this);
    }

    set(e){
        e.preventDefault();
        this.props.action(e.target.value);
    }

    render(){
        return(
            <div class="form-group knbn-bg-transparent">
                <Label label={this.props.label}/>
                <div class={"knbn-input-grp knbn-fake-input-grp input-group knbn-transition" + (this.props.themeToggled ? " knbn-dark-border-2x knbn-dark-onselect" : " knbn-snow-border-2x knbn-snow-onselect")}>
                
                    <input type="text" class={"knbn-input form-control knbn-editing-mode knbn-bg-transparent" + 
                    (this.props.themeToggled == true ? 
                        " knbn-dark-color-4x knbn-dark-bg-2x knbn-dark-bg-2x-active" 
                        : 
                        " knbn-snow-color-4x knbn-snow-bg-2x knbn-snow-bg-2x-active")} aria-describedby="knbnHelp" 
                    placeholder={this.props.value == undefined || this.props.value.length == 0 ? "Introdu numele obiectului" : ""}
                    value={this.props.value}
                    onChange={this.set}
                    />
                
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

export default connect(mapStateToProps)(InputField);