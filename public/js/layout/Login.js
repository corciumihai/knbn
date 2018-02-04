import React from 'react';
import ReactDOM from 'react-dom';
import Input from "./components/Input.js";
import Button from "./components/Button.js";
import RememberPassword from "./components/login/RememberPassword.js";
import { error } from 'util';

const axios = require('axios');
const validator = require('validator');

class Login extends React.Component{
    constructor(props){
        super(props);
        //setting the initial state of the component
        this.state = {
            email: '', 
            password: '', 
            rememberPassword: false,
            validEmail: false, 
            validPassword: false,
            emailHint: '',
            passwordHint: ''
        };

        //binding methods to the object
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event){
        this.handleChange(event);
    }

    //handle the values from the form
    handleChange(event){
        var id = event.target.id;
        switch(id){
            case 'email':
            //checking if email value is valid
            this.setState({email: event.target.value.toString()}, function(){
                this.isEmail(this.state.email, function(error){
                        this.setState({emailHint: error});
                }.bind(this)) ? this.setState({validEmail: true}, 
                    () => {
                        this.setState({emailHint: ''});
                }) : this.setState({validEmail: false});
            }); 
            break;

            case 'password':
            //checking if password value is valid
            this.setState({password: event.target.value.toString()}, function(){
                this.isPassword(this.state.password, function(error){
                    this.setState({passwordHint: error});
                }.bind(this)) ? this.setState({validPassword: true}, 
                    () => {
                        this.setState({passwordHint: ''});
                }) : this.setState({validPassword: false});
            });
            break;

            case 'rememberPassword':
            this.setState({rememberPassword: event.target.checked}, function(){
                console.log(this.state.rememberPassword);
            });
            break;
        }
    }

    //on submit, send the POST request with the user details
    handleSubmit(event){
        event.preventDefault();
        // show errors when submitting form
        if(!(this.state.validEmail && this.state.validPassword)){
            if(!this.state.validEmail){
                this.setState({emailHint: 'Email required'});
            }
            if(!this.state.validPassword){
                this.setState({passwordHint: 'Password required'});
            }
            return;
        }

        // send the request with the user details
        axios.post('/login', this.state)  // < send less data over the network - over a json object
        .then(function(response){
            //
        })
        .catch(function(error){
            if(error.response) {
                if(error.response.status === 405){
                    this.setState({emailHint: 'Email and/or password are invalid'});
                }
            }
        }.bind(this));
        
    }

    isPassword(password, callback){
        var error = '';
        //check if not empty
        if(!password.length > 0){
            error = 'Password is empty';
            callback(error);
           return false;
        }
        //check if it is 8-32 characters long
        if(!( 8 <= password.length && password.length <= 32)){
            error = 'Password must be 8-32 characters long';
            callback(error);
            return false;
        }
        //check if it contains at least one uppercase character
        if(!(/[A-Z]+/.test(password))){
            error = 'Password must contain an uppercase letter';
            callback(error);
            return false;
        }
        return true;
    }

    isEmail(email, callback){
        var error = '';
        //check if it contains spaces
        if(/\s/.test(this.state.email)){
            error = 'Email cannot contain spaces';
            callback(error);
            return false;
        }
        //check if it respects the email pattern
        if(!validator.isEmail(email)){
            error = 'Email is not valid';
            callback(error);
            return false;
        }
        return true;
    }
    
    //render the components
    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <Input 
                    type="email" 
                    id="email" 
                    placeholder="Email" 
                    value={this.state.email} 
                    onChange={this.handleChange} 
                    onClick={this.handleClick}
                    validation={this.state.validEmail}
                    title="Please enter an email"
                    ariaDescribedBy="emailHint"
                    hintId="emailHint"
                    hint={this.state.emailHint}/>
                <Input 
                    type="password" 
                    id="password" 
                    placeholder="Password" 
                    value={this.state.password} 
                    onChange={this.handleChange}
                    onClick={this.handleClick}
                    validation={this.state.validPassword} 
                    title="Please enter a password"
                    ariaDescribedBy="passwordHint"
                    hintId="passwordHint"
                    hint={this.state.passwordHint}/>
                <RememberPassword 
                    id="rememberPassword" 
                    checked={this.state.checked} 
                    onChange={this.handleChange} />
                <Button 
                    id="submit-button" 
                    type="submit" 
                    text="Login"/>
                <a href='/forgot' id="forgot-password">Forgot password</a>
            </form>
        );
    }
}

ReactDOM.render(<Login/>, document.getElementById('login'));