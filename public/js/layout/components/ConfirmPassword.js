import React from 'react';
import Input from './Input.js';

class ConfirmPassword extends React.Component{
    render(){
        return(
            <Input 
                type="password"
                id="confirm-password"
                title="Please enter a password"
                ariaDescribedBy="confirmPasswordHint"
                placeholder="confirm pasword"
                hintId="confirmPasswordHint"
                value={this.props.value}
                onChange={this.props.onChange}
                onClick={this.props.onClick}
                validation={this.props.validation}
                hint={this.props.hint}
            />
        );
    }
}

export default ConfirmPassword;