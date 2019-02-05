import React from 'react';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import crypto from 'crypto';
import { Link } from 'react-router-dom';
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
            isAdmin: false,
            error: '',
            success: false
        };

        this.setEmail = this.setEmail.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.setCompany = this.setCompany.bind(this);
        this.setName = this.setName.bind(this);
        this.calcGravatar = this.calcGravatar.bind(this);
        this.setRepeatPassword = this.setRepeatPassword.bind(this);
        this.submit = this.submit.bind(this);
        this.validate = this.validate.bind(this);
        this.resetError = this.resetError.bind(this);
        this.setAdmin = this.setAdmin.bind(this);
    }

    setEmail(event){
        this.setState({email: event.target.value}, this.resetError);
    }

    setPassword(event){
        this.setState({password: event.target.value}, this.resetError);
    }

    setRepeatPassword(event){
        this.setState({repeatPassword: event.target.value}, this.resetError);
    }

    setName(event){
        this.setState({name: event.target.value}, this.resetError);
    }

    setCompany(event){
        this.setState({company: event.target.value}, this.resetError);
    }

    calcGravatar(email){
        this.setState({gravatar: crypto.createHash('md5').update(String(this.state.email).toLowerCase().trim()).digest('hex')})
    }

    validate(callback){
        let emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
        let num = /[0-9]/;
        let upper = /[A-Z]/;
        let whitespace = /^\s+|\s+$/g;
        
        if(!this.state.email || !this.state.email.match(emailRegex)){
            this.setState({error: 'Introdu un e-mail corespunzător'});
        }
        else if(this.state.password != this.state.repeatPassword){
            this.setState({error: 'Parolele nu sunt egale'})
        }
        else if (!this.state.password.replace(whitespace, '')){
            this.setState({error: 'Introdu o parolă corespunzatoare'})
        }
        else if(!this.state.password.match(num)){
            this.setState({error: 'Parola trebuie să conțină măcar o cifră'})
        }
        else if(!this.state.password.match(upper)){
            this.setState({error: 'Parola trebuie să conțină măcar o literă mare'})
        }
        else if(!this.state.password.length > 7){
            this.setState({error: 'Parola trebuie să aibă o lungime mai mare de 7 caractere'})
        }
        else if(!this.state.name){
            this.setState({error: 'Introdu un nume corespunzător'})
        }
        else{
            callback();
        }
    }

    setAdmin(){
        this.setState({isAdmin: !this.state.isAdmin});
    }

    resetError(){
        this.setState({error: '', success: false});
    }

    resetState(){
        this.setState({
            email: '',
            password: '',
            repeatPassword: '',
            name: '',
            company: '',
            isAdmin: false,
            error: '',
        })
    }

    submit(event){
        event.preventDefault();

        this.validate(() => {
            axios.post('/register', {
                email: this.state.email,
                password: this.state.password,
                name: this.state.name,
                company: this.state.company,
                isAdmin: this.state.isAdmin
            })
            .then(response => {
                if(response.status == 200){
                    this.setState({success: true}, this.resetState);
                }
            })
            .catch(error => {
                if(error.response.status == 500){
                    this.setState({error: error.response.data.error});
                }
            })
        });
    }

    render(){
        return(
            <div class={"container-fluid d-flex p-2 h-100 knbn-container knbn-font-medium" + (this.props.themeToggled ? " knbn-dark-bg-1x" : " knbn-snow-bg-1x")}>                    
                <div class="col-xl-2 offset-xl-5 col-lg-4 offset-lg-4 col-md-4 offset-md-4 col-sm-6 offset-sm-3 col-xs-8 offset-xs-2 align-self-center">
                    <form>
                        <div class={"col text-center mb-3" + (this.props.themeToggled ? " knbn-dark-color-3x" : " knbn-snow-color-3x")}>Înregistrare</div>

                        <div class="form-group">
                            <input 
                            type="email" 
                            class={"form-control knbn-font-medium knbn-no-box-shadow knbn-no-border-radius knbn-transition" + (this.props.themeToggled ? " knbn-dark-onselect knbn-dark-bg-2x knbn-dark-border-2x knbn-dark-color-5x" : " knbn-snow-onselect")}
                            placeholder="E-mail" 
                            value={this.state.email} 
                            onChange={this.setEmail} 
                            title="E-mail" 
                            />
                        </div>

                        <div class="form-group">
                            <input 
                            type="password" 
                            class={"form-control knbn-font-medium knbn-no-box-shadow knbn-no-border-radius knbn-transition" + (this.props.themeToggled ? " knbn-dark-onselect knbn-dark-bg-2x knbn-dark-border-2x knbn-dark-color-5x" : " knbn-snow-onselect")}
                            placeholder="Parolă" 
                            value={this.state.password} 
                            onChange={this.setPassword} 
                            title="Parolă"
                            />
                        </div>

                        <div class="form-group">
                            <input 
                            type="password" 
                            class={"form-control knbn-font-medium knbn-no-box-shadow knbn-no-border-radius knbn-transition" + (this.props.themeToggled ? " knbn-dark-onselect knbn-dark-bg-2x knbn-dark-border-2x knbn-dark-color-5x" : " knbn-snow-onselect")}
                            placeholder="Confirmă parolă" 
                            title="Confirmare parolă"
                            value={this.state.repeatPassword}
                            onChange={this.setRepeatPassword}
                            />
                        </div>

                        <div class="form-group">
                            <input 
                            type="text" 
                            class={"form-control knbn-font-medium knbn-no-box-shadow knbn-no-border-radius knbn-transition" + (this.props.themeToggled ? " knbn-dark-onselect knbn-dark-bg-2x knbn-dark-border-2x knbn-dark-color-5x" : " knbn-snow-onselect")}
                            placeholder="Nume" 
                            value={this.state.name} 
                            onChange={this.setName} 
                            title="Nume" 
                            />
                        </div>

                        {/* <div class="d-flex flex-row justify-content-center form-group knbn-pointer" onClick={this.setAdmin}>
                            <div class={"d-flex flex-row knbn-border mr-2" + (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-2x") + (this.state.isAdmin ? " knbn-remember" : "")}>
                                <img src="./images/save.svg" class="mx-auto my-auto"/>
                            </div>
                            <div class={"knbn-font-medium" + (this.props.themeToggled ?  " knbn-dark-color-2x" : " knbn-snow-color-2x")}>Is Administrator</div>
                        </div> */}

                        <div class="form-group">
                            <input 
                            type="text" 
                            class={"form-control knbn-font-medium knbn-no-box-shadow knbn-no-border-radius knbn-transition" + (this.props.themeToggled ? " knbn-dark-onselect knbn-dark-bg-2x knbn-dark-border-2x knbn-dark-color-5x" : " knbn-snow-onselect")}
                            placeholder="Companie" 
                            value={this.state.company} 
                            onChange={this.setCompany} 
                            title="Companie" 
                            />
                        </div>

                        <button 
                        class={"btn col-12 mb-2 knbn-no-border-radius knbn-font-medium knbn-no-box-shadow knbn-transition knbn-bg-transparent" + (this.props.themeToggled ? " knbn-dark-border-1x knbn-dark-onselect knbn-dark-bg-2x knbn-dark-color-5x" : " knbn-snow-border-1x knbn-snow-onselect")} 
                        title="Apasă pentru înregistrare" 
                        onClick={this.submit}>
                            Înregistrare
                        </button>
                            
                        <div class={"text-center w-100 knbn-font-small" + (this.props.themeToggled ? " knbn-dark-color-2x" : " knbn-snow-color-2x")}>Dacă ai cont deja, apasă <Link to='/login'>aici</Link></div>

                        {this.state.error ?
                            <div class={"col-xl-12 knbn-error text-center mt-1" + (this.props.themeToggled ? " knbn-dark-error-color knbn-dark-bg-error" : " knbn-snow-error-color knbn-snow-bg-error")}>
                                {this.state.error}
                            </div>
                            :
                            null
                        }

                        {this.state.success ?
                            <div class={"col-xl-12 knbn-error text-center" + (this.props.themeToggled ? " knbn-dark-success-color knbn-dark-bg-success" : " knbn-snow-success-color knbn-snow-bg-success")}>
                                Utilizator înregistrat în sistem
                            </div>
                            :
                            null
                        } 
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled, 
        saltRounds: state.saltRounds
    }
}

export default connect(mapStateToProps)(Register);