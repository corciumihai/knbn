import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

class LoginForm extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            email: '', 
            password: 'A12345678',
            error: '',
            redirect: false,
        };

        this.setEmail = this.setEmail.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.remember = this.remember.bind(this);
        this.submit = this.submit.bind(this);
        this.resetError = this.resetError.bind(this);
        this.validate = this.validate.bind(this);
    }

    componentDidMount(){
        let email = cookies.get('knbn-email');
        if(email){
            this.setState({email: email})
        }
    }

    setEmail(event){
        this.setState({email: event.target.value}, this.resetError);
    }

    setPassword(event){
        this.setState({password: event.target.value}, this.resetError);
    }

    validate(callback){
        if(!this.state.email){
            this.setState({error: 'Introdu un e-mail'})
        }
        else if(!this.state.password){
            this.setState({error: 'Introdu o parolă'})
        }
        else{
            callback();
        }
    }

    remember(){
        this.setState({remember: !this.state.remember});
    }

    resetError(){
        this.setState({error: '', fromCookie: false});
    }

    submit(event){
        event.preventDefault();

        this.validate(() => {
            axios.post('/login', {username: this.state.email, password: this.state.password})
            .then(response => {
                if(response.status == 200){
                    cookies.set('knbn-email', this.state.email, {path: '/'});
                    this.props.setToken(response.data.jwtToken);
                    this.setState({redirect: true});
                }
            })
            .catch(error => {
                if(error.response.status == 500 || error.response.status == 404){
                    this.setState({error: error.response.data.error});
                }
            });
        });
    }

    render(){
        return(
            <div>
                {this.state.redirect ? 
                    <Redirect to="/"/>
                :
                    <form>
                        <div class={"col text-center knbn-font-medium mb-3" + (this.props.themeToggled ? " knbn-dark-color-3x" : " knbn-snow-color-3x")}>Autentificare</div>
                        <div class="form-group">
                            <input 
                            type="email" 
                            class={"form-control knbn-font-medium knbn-no-box-shadow knbn-no-border-radius knbn-transition" + (this.props.themeToggled ? " knbn-dark-onselect knbn-dark-bg-2x knbn-dark-border-2x knbn-dark-color-5x" : " knbn-snow-onselect")}
                            placeholder="E-mail" 
                            value={this.state.email} 
                            onChange={this.setEmail} title="E-mail" 
                            onBlur={this.validateEmail}/>
                        </div>
                        
                        <div class="form-group">
                            <input 
                            type="password" 
                            class={"form-control knbn-font-medium knbn-no-box-shadow knbn-no-border-radius knbn-transition" + (this.props.themeToggled ? " knbn-dark-onselect knbn-dark-bg-2x knbn-dark-border-2x knbn-dark-color-5x" : " knbn-snow-onselect")}
                            placeholder="Parolă" 
                            value={this.state.password} 
                            onChange={this.setPassword} 
                            title="Parolă" 
                            onBlur={this.validatePassword}/>
                        </div>

                        <button 
                        class={"btn col-12 mb-2 knbn-no-border-radius knbn-font-medium knbn-no-box-shadow knbn-transition knbn-bg-transparent" + (this.props.themeToggled ? " knbn-dark-border-1x knbn-dark-onselect knbn-dark-bg-2x knbn-dark-color-5x" : " knbn-snow-border-1x knbn-snow-onselect")} 
                        title="Apasă pentru logare" 
                        onClick={this.submit}>
                            Autentificare
                        </button>

                        <div class="d-flex justify-content-center">
                            <Link to='/forgot'>
                                <div class="knbn-font-small">Parolă uitată</div>
                            </Link>
                        </div>

                        <div class={"text-center w-100 knbn-font-small" + (this.props.themeToggled ? " knbn-dark-color-2x" : " knbn-snow-color-2x")}>Dacă nu ai cont, apasă <Link to='/register'>aici</Link></div>

                        {this.state.error ?
                            <div class={"col-xl-12 knbn-error text-center mt-1" + (this.props.themeToggled ? " knbn-dark-error-color knbn-dark-bg-error" : " knbn-snow-error-color knbn-snow-bg-error")}>
                                {this.state.error}
                            </div>
                            :
                            null
                        }
                    </form>
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
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