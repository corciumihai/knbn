import React from 'react';
import Input from './Input.js'

class Password extends React.Component{
    render(){
        return(
            <Input 
                type="password"
                id="password"
                title="Please enter a password"
                ariaDescribedBy="passwordHint"
                placeholder="password"     
                hintId="passwordHint"
                value={this.props.value}
                onChange={this.props.onChange}
                onClick={this.props.onClick}
                validation={this.props.validation}
                hint={this.props.hint}
            />
        );
    }
}

export default Password;