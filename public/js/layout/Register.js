import React from 'react';
import ReactDOM from 'react-dom';
import Button from './components/Button.js';
import CompanyInput from './components/register/CompanyInput.js';
import Input from './components/Input.js';
import Email from './components/Email.js';
import Password from './components/Password.js';
import ConfirmPassword from './components/ConfirmPassword.js';
import Alert from './components/Alert.js';

const axios = require('axios');
const validator = require('validator');

class Register extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email: '', 
            password: '', 
            company: '',
            confirmPassword: '',
            validEmail: false, 
            validPassword: false,
            validConfirmPassword: false,
            emailHint: '',
            passwordHint: '',
            confirmPasswordHint: '',
            alert: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event){
        this.handleChange(event);
    }

    handleChange(event){
        var id = event.target.id;
        switch(id){
            case 'email':
                // checking if email value is valid
                this.setState({email: event.target.value.toString()}, function(){
                    this.isEmail(function(error){
                            this.setState({emailHint: error});
                    }.bind(this)) ? this.setState({validEmail: true}, 
                        () => {
                            this.setState({emailHint: ''});
                    }) : this.setState({validEmail: false});
                }); 
            break;

            case 'password':
                // checking if password value is valid
                this.setState({password: event.target.value.toString()}, function(){
                    this.isPassword(function(error){
                        this.setState({passwordHint: error});
                    }.bind(this)) ? this.setState({validPassword: true}, 
                        () => {
                            this.setState({passwordHint: ''});
                    }) : this.setState({validPassword: false});

                    // sync password & confirm password - just using the same code chunk
                    this.setState({
                        validConfirmPassword: this.confirmPassword(function(error){
                            this.setState({confirmPasswordHint: error});
                        }.bind(this))
                    }, () =>{
                        if(this.state.validConfirmPassword){
                            this.setState({confirmPasswordHint: ''});
                        }
                    });
                });
            break;

            case 'confirm-password':
                this.setState({confirmPassword: event.target.value.toString()}, function(){
                    this.setState({
                        validConfirmPassword: this.confirmPassword(function(error){
                            this.setState({confirmPasswordHint: error});
                        }.bind(this))
                    }, () =>{
                        if(this.state.validConfirmPassword){
                            this.setState({confirmPasswordHint: ''});
                        }
                    });
                });
            break;

            case 'company':
                this.setState({company: event.target.value.toString()});
            break;
        }
    }

    handleSubmit(event){
        event.preventDefault();
        // abort the submit if there are fields that are not filled
        if(!(this.state.validEmail && this.state.validPassword && this.state.validConfirmPassword)){
            if(!this.state.validEmail){
                this.setState({emailHint: 'Email is required'});
            }
            if(!this.state.validPassword){
                this.setState({passwordHint: 'Password is required'});
            }
            if(!this.state.validConfirmPassword){
                this.setState({confirmPasswordHint: 'Password is required'});
            }
            return;
        }

        // gather the user details
        var userDetails = {
            email: this.state.email,
            password: this.state.password,
            company: this.state.company
        };

        // send the user data
        axios.post('/register', userDetails)
            .then(function(response){
                // alert user the email already exists
                if(response.data.email){
                    this.setState({emailHint: response.data.email});
                }
                // alert the user for password errors - might not be needed
                // if(response.data.password){
                //     this.setState({passwordHint: response.data.password});
                // }
                // TODO add if for company - if the case
            }.bind(this))
            .catch(function(error) {
                this.setState({alert: error.toString()});
            }.bind(this));
    }

    // confirm password behaviour
    confirmPassword(callback){
        if(!(this.state.confirmPassword.length > 0)){
            callback("Password is empty");
            return false;
        }
        if(!(this.state.confirmPassword === this.state.password)){
            callback("Passwords do not match");
            return false;
        }
        return true;
    }

    // check if the password respects pattern
    isPassword(callback){
        var error = '';
        // check if not empty
        if(!(this.state.password.length > 0)){
            error = 'Password is empty';
            callback(error);
           return false;
        }
        // check if it is 8-32 characters long
        if(!( 8 <= this.state.password.length && this.state.password.length <= 32)){
            error = 'Password must be 8-32 characters long';
            callback(error);
            return false;
        }
        // check if it contains at least one uppercase character
        if(!(/[A-Z]+/.test(this.state.password))){
            error = 'Password must contain an uppercase letter';
            callback(error);
            return false;
        }
        return true;
    }

    // check if the email respects pattern
    isEmail(callback){
        var error = '';
        // check if it contains spaces
        if(/\s/.test(this.state.email)){
            error = 'Email cannot contain spaces';
            callback(error);
            return false;
        }
        // check if it respects the email pattern
        if(!validator.isEmail(this.state.email)){
            error = 'Email is not valid';
            callback(error);
            return false;
        }
        return true;
    }

    render(){
        return(
            <form onSubmit={this.handleSubmit}>
            <Email 
                value={this.state.email}
                onChange={this.handleChange}
                onClick={this.handleClick}
                validation={this.state.validEmail}
                hint={this.state.emailHint}
            />
            <CompanyInput  
                onChange={this.handleChange}
                onClick={this.handleClick}
            />
            <Password 
                value={this.state.password}
                onChange={this.handleChange}
                onClick={this.handleClick}
                validation={this.state.validPassword}
                hint={this.state.passwordHint}
            />
            <ConfirmPassword
                value={this.state.confirmPassword}
                onChange={this.handleChange}
                onClick={this.handleClick}
                validation={this.state.validConfirmPassword}
                hint={this.state.confirmPasswordHint}
            />
            <Button 
                id="submit-button" 
                type="submit" 
                text="Register"/>
            <span id="already-account">If you already have an account, press <a href='/login'>here</a></span>
            <Alert text={this.state.alert}/>
        </form>
        );
    }
}

ReactDOM.render(<Register/>, document.getElementById('register'));