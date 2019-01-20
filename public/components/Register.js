import React from 'react';
import ReactDOM from 'react-dom';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import crypto from 'crypto';
import store from '../storage/store';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

class Register extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            email: '', 
            password: '',
            repeatPassword: '',
            name: '',
            company: '',
            error: '',
            redirect: false
        };

        this.setEmail = this.setEmail.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.setCompany = this.setCompany.bind(this);
        this.setName = this.setName.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
        this.validateName = this.validateName.bind(this);
        this.calcGravatar = this.calcGravatar.bind(this);
        this.setRepeatPassword = this.setRepeatPassword.bind(this);
    }

    validateEmail() {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(this.state.email == undefined || this.state.email .length == 0){
            this.setState({error: 'E-mail necorespunzător'}); 
            return false;
        }
        return true;
    }

    validatePassword(){
        if(this.state.password == undefined || this.state.password.length == 0){
            this.setState({
                error: 'Parolă necorespunzătoare'
            });
            return false;
        }
        this.state.password.length > 7 ? 
        this.setState({error: ''}) 
        : 
        this.setState({error: 'Parolă necorespunzătoare'})
    }

    validateName(){
        (this.state.name != undefined && this.state.name.length > 0) ? 
        this.setState({error: ''}) 
        : 
        this.setState({error: 'Introdu un nume'});
    }

    setEmail(event){
        this.setState({email: event.target.value});
    }

    setPassword(event){
        this.setState({password: event.target.value});
    }

    setRepeatPassword(event){
        this.setState({repeatPassword: event.target.value});
    }

    setName(event){
        this.setState({name: event.target.value});
    }

    setCompany(event){this.setState({company: event.target.value});}

    calcGravatar(email){
        var md5 = crypto.createHash('md5');
        var hash = md5.update(String(this.state.email).toLowerCase().trim()).digest('hex');
        this.setState({gravatar: hash})
    }

    render(){
        return(
            <div class={"container-fluid d-flex p-2 h-100" + (this.props.themeToggled ? " knbn-dark-bg-1x" : " knbn-snow-bg-1x")}>
                <div class="col-xl-2 offset-xl-5 col-lg-4 offset-lg-4 col-md-4 offset-md-4 col-sm-6 offset-sm-3 col-xs-8 offset-xs-2 align-self-center">
                    <form method="post" action="/register">
                        <div class="form-group my-0">
                            <div class="col-lg-12 col-xl-12 col-md-12 col-12 d-flex justify-content-center">
                                <div class="mb-2 d-flex">
                                    <img class='profile-img mx-auto' src={'https://www.gravatar.com/avatar/' + this.state.gravatar}/>
                                </div>
                            </div>
                            <div class='set-profile-msg knbn-font-small px-0'>Profile image will be available once you enter your e-mail</div>
                        </div>
                        {
                            this.state.error.length == 0 ? 
                            null
                            :
                            <div class={"col-xl-12 knbn-font-small knbn-error px-1 py-1 mb-2" + (this.props.themeToggled ? " knbn-dark-bg-1x knbn-dark-error-color knbn-dark-bg-error" : " knbn-snow-bg-1x knbn-snow-error-color knbn-snow-bg-error")}>{this.state.error}</div>
                        }
                        <div class="form-group">
                            <input 
                            type="email" 
                            class="form-control register-area" 
                            placeholder="E-mail" 
                            value={this.state.email} 
                            onChange={this.setEmail} 
                            title="E-mail"
                            onBlur={this.validateEmail}/>
                        </div>

                        <div class="form-group">
                            <input 
                            type="password" 
                            class="form-control register-area" 
                            placeholder="Parolă" 
                            value={this.state.password}
                            onChange={this.setPassword} 
                            onBlur={this.validatePassword}
                            title="Parolă"/>
                        </div>

                        <div class="form-group">
                            <input 
                            type="password" 
                            class="form-control register-area" 
                            placeholder="Repetă parola" 
                            value={this.state.repeatPassword}
                            onChange={this.setRepeatPassword} 
                            onBlur={this.validatePassword}
                            title="Repetă Parola"/>
                        </div>

                        <div class="form-group">
                            <input 
                            type="text" 
                            class="form-control register-area" 
                            placeholder="Nume" 
                            value={this.state.name} 
                            onChange={this.setName}
                            title="Nume" 
                            onBlur={this.validateName}/>
                        </div>

                        <div class="form-group">
                            <input 
                            type="text" 
                            class="form-control register-area" 
                            placeholder="Companie" value={this.state.company}
                            onChange={this.setCompany} 
                            title="Companie"/>
                        </div>

                        <button 
                        class="btn col-12 register-btn mb-2 knbn-transition"
                        // type="submit" 
                        title="Apasă pentru înregistrare">
                            Înregistrează-te
                        </button>
                        <span class="already-account">Dacă ai cont deja, apasă <a href='/login'>aici</a></span>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(Register);