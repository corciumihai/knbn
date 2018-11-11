import React from 'react';
import Input from './Input.js'

class Email extends React.Component{
    render(){
        return(
            <Input 
                type="email"
                id="email"
                title="Please enter an email"
                ariaDescribedBy="emailHint"
                placeholder="email"
                hintId="emailHint"
                value={this.props.value}
                onChange={this.props.onChange}
                onClick={this.props.onClick}
                validation={this.props.validation}
                hint={this.props.hint}
            />
        );
    }
}

export default Email;