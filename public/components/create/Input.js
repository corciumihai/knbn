import React from 'react';
import Hint from './Hint.js';

class Input extends React.Component{
    render(){
        var style = {};
        style.validStyle = {
            borderRightColor: 'rgb(109, 155, 72)'
        };
        style.invalidStyle = {
            borderRightColor: 'rgb(245, 109, 109)',
        };

        return(
            <div class="form-group">
                <input 
                    type={this.props.type} 
                    class={"form-control"} 
                    id={this.props.id} 
                    aria-describedby={this.props.ariaDescribedBy} 
                    placeholder={this.props.placeholder} 
                    value={this.props.value} 
                    onChange={this.props.onChange} 
                    onClick={this.props.onClick} 
                    style={this.props.validation ? style.validStyle : style.invalidStyle} 
                    title={this.props.title} 
                />
                <Hint id={this.props.hintId}>{this.props.hint}</Hint>
            </div>
        );
    }
}

Input.defaultProps = {
    type: 'text',
    class: undefined,
    id: undefined,
    ariaDescribedBy:undefined,
    value: undefined,
    onChange: undefined,
    style: undefined,
    title: 'Please enter a value',
    hintId: undefined,
    hint: undefined
}

export default Input;