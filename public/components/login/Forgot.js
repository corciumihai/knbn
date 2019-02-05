import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import axios from 'axios';

class Forgot extends React.Component {
    constructor(){
        super();

        this.state = {
            email: '',
            newPass: '',
            confirmPass: '',
            success: false
        }

        this.setEmail = this.setEmail.bind(this);
        this.setNewPass = this.setNewPass.bind(this);
        this.setConfirmPass = this.setConfirmPass.bind(this);
        this.submit = this.submit.bind(this);
        this.validate = this.validate.bind(this);
        this.resetError = this.resetError.bind(this);
    }

    setEmail(event){
        this.setState({email: event.target.value}, this.resetError);
    }

    setNewPass(event){
        this.setState({newPass: event.target.value}, this.resetError);
    }

    setConfirmPass(event){
        this.setState({confirmPass: event.target.value}, this.resetError);
    }

    submit(event){
        event.preventDefault();
        this.validate(() => {
            axios.post('forgot', {
                email: this.state.email,
                password: this.state.newPass
            })
            .then(response => {
                if(response.status == 200){
                    this.setState({success: true});
                }
            })
            .catch(error => {
                this.setState({error: error.response.data.error});
            })
        })
    }

    resetError(){
        this.setState({error: '', success: ''})
    }

    resetState(){
        this.setState({
            email: '',
            newPass: '',
            confirmPass: '',
            error: ''
        })
    }

    validate(callback){
        var num = /[0-9]/;
        var upper = /[A-Z]/;

        if(!this.state.email){
            this.setState({error: 'Câmpul e-mail-ului nu poate fi gol'});
        }
        else if(!this.state.newPass || !this.state.confirmPass){
            this.setState({error: 'Câmpul unei parole nu poate fi gol'});
        }
        else if(this.state.newPass != this.state.confirmPass){
            this.setState({error: 'Parolele nu sunt la fel'});
        }
        else if(!this.state.newPass.match(num)){
            this.setState({error: 'Parola trebuie să conțină cel puțin o cifră'});
        }
        else if(!this.state.newPass.match(upper)){
            this.setState({error: 'Parola trebuie să conțină cel puțin o literă mare'})
        }
        else if(this.state.newPass.length < 7){
            this.setState({error: 'Parola trebuie să aibă o lungime mai mare de 7 caractere'})
        }
        else{
            callback();
        }
    }

    render(){
        return (
            <div class={"knbn-container col-xl-12 d-flex" + (this.props.themeToggled ? " knbn-dark-bg-1x" : " knbn-snow-bg-1x")}>
                <div class="col-xl-2 offset-xl-5 col-lg-4 offset-lg-4 col-md-4 offset-md-4 col-sm-6 offset-sm-3 col-xs-8 offset-xs-2 align-self-center knbn-bg-transparent">
                    <form>
                        <div class={"col text-center knbn-font-medium mb-3" + (this.props.themeToggled ? " knbn-dark-color-3x" : " knbn-snow-color-3x")}>Resetare parolă</div>
                        <div class="form-group">
                            <input 
                                type="email" 
                                class={"form-control knbn-font-medium knbn-no-box-shadow knbn-no-border-radius knbn-transition" + (this.props.themeToggled ? " knbn-dark-onselect knbn-dark-bg-2x knbn-dark-border-2x knbn-dark-color-5x" : " knbn-snow-onselect")}
                                placeholder="E-mail"
                                title="E-mail"
                                value={this.state.email}
                                onChange={this.setEmail}
                            />
                        </div>
                        <div class="form-group">
                            <input 
                                type="password" 
                                class={"form-control knbn-font-medium knbn-no-box-shadow knbn-no-border-radius knbn-transition" + (this.props.themeToggled ? " knbn-dark-onselect knbn-dark-bg-2x knbn-dark-border-2x knbn-dark-color-5x" : " knbn-snow-onselect")}
                                placeholder="Parolă nouă" 
                                title="Parolă nouă"
                                value={this.state.newPass}
                                onChange={this.setNewPass}
                            />
                        </div>

                        <div class="form-group">
                            <input 
                                type="password" 
                                class={"form-control knbn-font-medium knbn-no-box-shadow knbn-no-border-radius knbn-transition" + (this.props.themeToggled ? " knbn-dark-onselect knbn-dark-bg-2x knbn-dark-border-2x knbn-dark-color-5x" : " knbn-snow-onselect")}
                                placeholder="Confirmă parolă" 
                                title="Confirmare parolă"
                                value={this.state.confirmPass}
                                onChange={this.setConfirmPass}
                            />
                        </div>

                        <button 
                            class={"btn col-12 mb-2 knbn-no-border-radius knbn-font-medium knbn-no-box-shadow knbn-transition knbn-bg-transparent" + (this.props.themeToggled ? " knbn-dark-border-1x knbn-dark-onselect knbn-dark-bg-3x knbn-dark-color-5x" : " knbn-snow-border-1x knbn-snow-onselect")} 
                            title="Apasă pentru logare" 
                            onClick={this.submit}
                        >
                            Resetare parolă
                        </button>

                        {
                            this.state.success ? 
                            <Link to="/login">
                                <div class="knbn-font-small w-100 text-center">
                                    Continuă către pagina de logare
                                </div>
                            </Link>
                            :
                            <Link to="/login">
                                <div class="knbn-font-small w-100 text-center">
                                    Înapoi la pagina de logare
                                </div>
                            </Link>
                        }

                        {this.state.error ?
                            <div class={"col-xl-12 knbn-error text-center" + (this.props.themeToggled ? " knbn-dark-error-color knbn-dark-bg-error" : " knbn-snow-error-color knbn-snow-bg-error")}>
                                {this.state.error}
                            </div>
                            :
                            null
                        }

                        {this.state.success ?
                            <div class={"col-xl-12 knbn-error text-center" + (this.props.themeToggled ? " knbn-dark-success-color knbn-dark-bg-success" : " knbn-snow-success-color knbn-snow-bg-success")}>
                                Parolă resetată cu succes
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

const mapStateToProps = (state) =>{
    return {
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(Forgot);