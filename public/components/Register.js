import React from 'react';
import ReactDOM from 'react-dom';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import crypto from 'crypto';

class Register extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            email: 'free_roaming94@yahoo.com', 
            password: '12345678',
            name: 'Mihai',
            company: 'CompanyX',

            errorEmail: false,
            errorPass: false,
            errorName: false,
            errorNameMsg: '',
            errorEmailMsg: '',
            errorPassMsg: '',
        };

        this.setEmail = this.setEmail.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.setCompany = this.setCompany.bind(this);
        this.setName = this.setName.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
        this.validateName = this.validateName.bind(this);
        this.calcGravatar = this.calcGravatar.bind(this);
    }

    validateEmail() {
        if(this.state.email == undefined || this.state.email .length == 0){this.setState({errorEmail: true, errorEmailMsg: 'Invalid e-mail'}); return;}
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        axios.post('/user/checkuser', {email: this.state.email }).then(response => {
            if(response.data.success == false && response.data.message != undefined && response.data.message.length > 0){
                this.setState({errorEmail: true, errorEmailMsg: response.data.message})
            }
            // TODO 
            else if(!re.test(String(this.state.email ).toLowerCase())){
                this.setState({errorEmail: true, errorEmailMsg: 'Invalid e-mail'});
            }
            else{
                this.setState({errorEmail: false, errorEmailMsg: ''});
            }
            this.calcGravatar();
        });
    }

    validatePassword(){
        if(this.state.password == undefined || this.state.password.length == 0){
            this.setState({errorPass: true, errorPassMsg: 'Invalid password. It must be at greater than 8 characters and contain at least one uppercase letter'});
            return false;
        }
        // var num = /\d/;
        // var upper = /[A-Z]+/;
        this.state.password.length > 7 ? this.setState({errorPass: false, errorPassMsg: ''}) : 
                            this.setState({errorPass: true, errorPassMsg: 'Invalid password. It must be at greater than 8 characters and contain at least one uppercase letter'})
    }

    validateName(){
        (this.state.name != undefined && this.state.name.length > 0) ? this.setState({errorName: false, errorNameMsg: ''}) : 
            this.setState({errorName: true, errorNameMsg: 'Enter a name'});
    }

    setEmail(event){
        this.setState({email: event.target.value});
    }

    setPassword(event){
        this.setState({password: event.target.value});
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
            <form action='/register' method='post'>
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
                    value={this.state.email} 
                    onChange={this.setEmail} 
                    title="Email"
                    name='email'
                    onBlur={this.validateEmail} />
                    {this.state.errorEmail == true && this.state.errorEmailMsg != undefined && this.state.errorEmailMsg.length > 0 ? <span class='register-err'>{this.state.errorEmailMsg}</span> : null}
                </div>

                <div class="form-group">
                    <input 
                    type="password" 
                    class="form-control register-area" 
                    placeholder="Password" 
                    name='password'
                    // obfuscate the password value in the html dom
                    value={this.state.password}
                    onChange={this.setPassword} title="Password" 
                    onBlur={this.validatePassword}/>
                    {this.state.errorPass == true && this.state.errorPassMsg != undefined && this.state.errorPassMsg.length > 0 ? <span class='register-err'>{this.state.errorPassMsg}</span> : null}
                </div>

                <div class="form-group">
                    <input 
                    type="text" 
                    class="form-control register-area" 
                    placeholder="Name" 
                    value={this.state.name} 
                    onChange={this.setName}
                     title="Name" 
                     name='name'
                     onBlur={this.validateName}/>
                    {this.state.errorName == true && this.state.errorNameMsg != undefined && this.state.errorNameMsg.length > 0 ? <span class='register-err'>{this.state.errorNameMsg}</span> : null}
                </div>

                <div class="form-group">
                    <input type="text" class="form-control register-area" placeholder="Company" value={this.state.company} onChange={this.setCompany} title="Company" name='company'/>
                </div>

                <button class={this.state.errorEmail || this.state.errorPass || this.state.errorName ? 'btn col-12 register-btn mb-2 disabled' : "btn col-12 register-btn mb-2"}
                type="submit" 
                title="Press to register">
                    Register
                </button>
                <span class="already-account">If you already have an account, press <a href='/login'>here</a></span>
        </form>
        );
    }
}

ReactDOM.render(<Register/>, document.getElementById('register'));