import React from 'react';
import crypto from 'crypto';
import axios from 'axios';
import { connect } from 'react-redux';
import bcrypt from 'bcryptjs';
import { Redirect } from 'react-router-dom'

class LoginForm extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            email: 'free_roaming94@yahoo.com', 
            password: '12345678',
            remember: false,
            error: '',
            redirect: false
        };

        this.setEmail = this.setEmail.bind(this);
        this.setPassword = this.setPassword.bind(this);
        // this.remember = this.remember.bind(this);
        // this.validateEmail = this.validateEmail.bind(this);
        // this.validatePassword = this.validatePassword.bind(this);
        this.validate = this.validate.bind(this);
        this.submit = this.submit.bind(this);
    }

    // validateEmail(event) {
    //     var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // }

    // validatePassword(){
    //     // var num = /d/;
    //     // var upper = /[A-Z]/;
    //     this.state.password.length > 7 /*&& num.test(this.state.password) && upper.test(this.state.password)*/ ? this.setState({errorPass: false, errorPassMsg: ''}) : 
    //         this.setState({errorPass: true, errorPassMsg: 'Invalid password'});
    // }

    setEmail(event){
        this.setState({email: event.target.value});
    }

    setPassword(event){
        this.setState({password: event.target.value});
    }

    // remember(){
    //     this.setState({remember: !this.state.remember});
    // }

    // calcGravatar(email){
    //     var md5 = crypto.createHash('md5');
    //     var hash = md5.update(String(this.state.email).toLowerCase().trim()).digest('hex');
    //     this.setState({gravatar: hash})
    // }

    validate(){
        axios.post('/checkuser', {email: this.state.email, password: this.state.email}).then(response => {
            if(response.data.success == false){
                this.setState({error: response.data.message});
            }
        });
    }

    submit(event){
        event.preventDefault();

        axios.post('/login', {username: this.state.email, password: this.state.password})
        .then(response => {
            if(response.status == 200){
                this.props.setToken(response.data.jwtToken);
                this.setState({redirect: true});
            }
            else{
                this.setState({error: 'Eroare la logare! Incercați din nou'})
            }
        })
    }

    render(){
        return(
            <div>
                {this.state.redirect ? 

                    <Redirect to="/"/>
                :
                
                    <form>
                        <div class="form-group">
                            <div class="col-lg-12 col-xl-12 col-md-12 col-12 d-flex justify-content-center">
                                <div class="mb-2 d-flex">
                                    <img class='profile-img mx-auto' src={'https://www.gravatar.com/avatar/' + this.state.gravatar}/>
                                </div>
                            </div>
                        </div>

                        <div class="col-xl-12">{this.state.error}</div>

                        <div class="form-group">
                            <input 
                            type="email" 
                            class="form-control register-area" 
                            placeholder="Email" 
                            value={this.state.email} 
                            onChange={this.setEmail} title="Email" 
                            onBlur={this.validateEmail}/>
                        </div>
                        <div class="form-group">
                            <input 
                            type="password" 
                            class="form-control register-area" 
                            placeholder="Password" 
                            value={this.state.password} 
                            onChange={this.setPassword} 
                            title="Password" 
                            onBlur={this.validatePassword}/>
                        </div>

                        <div class="d-flex flex-row justify-content-center my-2 knbn-rmb-container" onClick={this.remember}>
                            <div class={"knbn-remember mr-2 d-flex" + (this.state.remember ? " knbn-remember-active" : "")}>
                                <img src="./images/save.svg" class="mx-auto my-auto knbn-img-inverted"/>
                                </div>
                            <span class="knbn-rmb">Remember password</span>
                        </div>

                        <button class="btn col-12 register-btn mb-2" title="Press to login" onClick={this.submit}>Logare</button>

                        <a href='/forgotpass' class="forgot">Forgot password</a> 
                    </form>
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setToken: (data) => {
            dispatch({
                type: 'KNBN_SET_TOKEN',
                payload: data
            });
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);