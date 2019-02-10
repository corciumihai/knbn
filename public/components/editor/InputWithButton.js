import React from 'react';
import Label from '../editor/Label';
import Small from '../editor/Small';
import { connect } from 'react-redux';

class InputWithButton extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            value: ''
        }

        this.set = this.set.bind(this);
        this.setValue = this.setValue.bind(this);
        this.setByKey = this.setByKey.bind(this);
    }

    setValue(e){
        this.setState({value: e.target.value});
    }

    set(e){
        e.preventDefault();
        this.props.action(this.state.value);
        this.setState({value: ''});
    }

    setByKey(e){
        if(e.key == 'Enter'){
            this.props.action(this.state.value);
            this.setState({value: ''});
        }
    }

    render(){
        return(
            <div class="form-group knbn-bg-transparent knbn-transition">
                <Label label={this.props.label}/>
                <div class={"input-group knbn-transition knbn-border" + (this.props.themeToggled ? " knbn-dark-border-2x knbn-dark-onselect" : " knbn-snow-border-2x knbn-snow-onselect")}>
                
                    <input type="text" class={"form-control knbn-editing-mode knbn-bg-transparent knbn-transition knbn-no-border-radius knbn-no-border knbn-font-medium knbn-no-box-shadow" + 
                    (this.props.themeToggled == true ? 
                        " knbn-dark-color-4x knbn-dark-bg-2x knbn-dark-bg-2x-active" 
                        : 
                        " knbn-snow-color-4x knbn-snow-bg-2x knbn-snow-bg-4x-active")} aria-describedby="knbnHelp" 
                    placeholder={this.state.value == undefined || this.state.value.length == 0 ? "Introdu nume" : ""}
                    value={this.state.value}
                    onKeyUp={this.setByKey}
                    onChange={this.setValue}
                    />

                    <div class="input-group-append">
                        <button 
                        onClick={this.set}
                        class={"btn knbn-no-border knbn-font-small knbn-bg-transparent knbn-no-box-shadow knbn-no-border-radius" + (this.props.themeToggled ? " knbn-dark-color-5x" : " knbn-snow-color-5x")} 
                        type="button">Adaugă</button>
                    </div>
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

export default connect(mapStateToProps)(InputWithButton);