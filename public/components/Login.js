import React from 'react';
import ReactDOM from 'react-dom';
import crypto from 'crypto';
import axios from 'axios';

class Login extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            email: 'free_roaming94@yahoo.com', 
            password: '12345678',
            remember: false,

            errorEmail: false,
            errorPass: false,
            errorEmailMsg: '',
            errorPassMsg: ''
        };

        this.setEmail = this.setEmail.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.remember = this.remember.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
    }

    validateEmail(event) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        axios.post('/user/checkuser', {email: this.state.email}).then(response => {
            console.log(response.data);
            if(response.data.success == false && response.data.message != undefined && response.data.message.length > 0){
                this.setState({errorEmail: false, errorEmailMsg: ''});
            }
            else if(response.data.success == true){
                this.setState({errorEmail: true, errorEmailMsg: 'E-mail does not exist in database'});
            }
            else if(!re.test(String(email).toLowerCase())){
                this.setState({errorEmail: true, errorEmailMsg: 'Invalid email'})
            }
            
            this.calcGravatar();
        });
    }

    validatePassword(){
        // var num = /d/;
        // var upper = /[A-Z]/;
        this.state.password.length > 7 /*&& num.test(this.state.password) && upper.test(this.state.password)*/ ? this.setState({errorPass: false, errorPassMsg: ''}) : 
            this.setState({errorPass: true, errorPassMsg: 'Invalid password'});
    }

    setEmail(event){this.setState({email: event.target.value});}

    setPassword(event){this.setState({password: event.target.value});}

    remember(event){
        this.setState({remember: event.target.checked});
    }

    calcGravatar(email){
        var md5 = crypto.createHash('md5');
        var hash = md5.update(String(this.state.email).toLowerCase().trim()).digest('hex');
        this.setState({gravatar: hash})
    }

    render(){
        return(
            <form action='/login' method="post">
                <div class="form-group">
                    <div class="col-lg-12 col-xl-12 col-md-12 col-12 d-flex justify-content-center">
                        <div class="mb-2 d-flex">
                            <img class='profile-img mx-auto' src={'https://www.gravatar.com/avatar/' + this.state.gravatar}/>
                        </div>
                    </div>
                    <span class='set-profile-msg'>Profile image will be available once you enter your e-mail</span>
                </div>

                <div class="form-group">
                    <input 
                    type="email" 
                    class="form-control register-area" 
                    placeholder="Email" 
                    name="username" 
                    value={this.state.email} 
                    onChange={this.setEmail} title="Email" 
                    onBlur={this.validateEmail}/>
                    {this.state.errorEmail == true && this.state.errorEmailMsg != undefined && this.state.errorEmailMsg.length > 0 ? <span class='register-err'>{this.state.errorEmailMsg}</span> : null}
                </div>
                <div class="form-group">
                    <input 
                    type="password" 
                    class="form-control register-area" 
                    placeholder="Password" 
                    name="password" 
                    value={this.state.password} 
                    onChange={this.setPassword} 
                    title="Password" 
                    onBlur={this.validatePassword}/>
                    {this.state.errorPass == true && this.state.errorPassMsg != undefined && this.state.errorPassMsg.length > 0 ? <span class='register-err'>{this.state.errorPassMsg}</span> : null}
                </div>

                {/* <div class="form-check">
                    <label class="form-check-label custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" onChange={this.remember}/>
                        <span class="custom-control-indicator"></span>
                        <span>Remember password</span>
                    </label>
                </div> */}

                <button class="btn col-12 register-btn mb-2" title="Press to login" type='submit'>Login</button>

                <a href='/forgotpass' class="forgot">Forgot password</a> 
        </form>
        );
    }
}

ReactDOM.render(<Login/>, document.getElementById('login'));