import React from 'react';
import { connect } from 'react-redux';
import LoginForm from './login/LoginForm';
import store from '../storage/store';

class LoginPage extends React.Component {
    constructor(props){
        super(props);

        this.state = {}
    }

    render(){
        return(
            <div class={"knbn-container col-xl-12 d-flex" + (this.props.themeToggled ? " knbn-dark-bg-1x" : " knbn-snow-bg-1x")}>
                <div class="col-xl-2 offset-xl-5 col-lg-4 offset-lg-4 col-md-4 offset-md-4 col-sm-6 offset-sm-3 col-xs-8 offset-xs-2 align-self-center knbn-bg-transparent">
                    <LoginForm/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) =>{
    return {
        themeToggled: state.themeToggled
    }
}
export default connect(mapStateToProps)(LoginPage);