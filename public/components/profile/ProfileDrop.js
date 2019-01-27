import React from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import DropdownMenu from '../menu/DropdownMenu';
import KNBNNavLink from '../menu/KNBNNavLink';
import DropdownItem from '../menu/DropdownItem';
import {connect} from 'react-redux';
import axios from 'axios';
import crypto from 'crypto';


const mapStatetoProps = (state) => {
    return {
        gravatar: state.gravatar,
        themeToggled: state.themeToggled,
        currentUser: state.currentUser,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logOut: () => {
            dispatch({
                type: 'KNBN_SET_TOKEN_EXPIRE',
            });
        },
        setAdmin: (admin) => {
            dispatch({
                type: 'KNBN_SET_ADMIN_RIGHT',
                payload: admin
            });
        }
    }
}

class ProfileDrop extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            redirect: false,
            name: '',
            gravatar: '',
            isAdmin: false,
            email: ''
        }

        this.logout = this.logout.bind(this);
    }

    logout(){
        this.props.logOut();
        this.setState({redirect: true});
    }

    componentWillMount(){
        if(this.props.user){
            axios.get('/user/get-user-by-email/' + this.props.user)
            .then(response => {
                this.setState({
                    email: this.props.user, 
                    name: response.data.name,
                    isAdmin: response.data.isAdmin,
                    gravatar: 'https://www.gravatar.com/avatar/' + crypto.createHash('md5').update(String(response.data.email).toLowerCase().trim()).digest('hex')}, 
                    () => {this.props.setAdmin(this.state.isAdmin)});
            });
        }
    }

    componentWillReceiveProps(nextProps, nextState){
        if(nextProps.user){
            axios.get('/user/get-user-by-email/' + nextProps.user)
            .then(response => {
                
                this.setState({
                    email: this.props.user, 
                    name: response.data.name,
                    isAdmin: response.data.isAdmin,
                    gravatar: 'https://www.gravatar.com/avatar/' + crypto.createHash('md5').update(String(response.data.email).toLowerCase().trim()).digest('hex')},
                    () => {this.props.setAdmin(this.state.isAdmin)});
            });
        }
    }

    render(){
        return(
            this.state.redirect ? 
            <Redirect to="/login"/>
            :
            <ul class={"navbar-nav"}>
                <li class={"knbn-nav-item nav-item dropdown knbn-no-border knbn-transition"}>
                    <KNBNNavLink onClick={() => {}}>
                        <img class="profile-pic my-auto mr-2" src={this.state.gravatar} title={this.state.name}></img>
                        {this.state.name == undefined || this.state.name.length == 0 ? 'Persoană nedefinită' : this.state.name}
                    </KNBNNavLink>
            
                    <DropdownMenu>
                        <NavLink to="">
                            <DropdownItem>Profil</DropdownItem>
                        </NavLink>
                        <a onClick={this.logout}><DropdownItem imgSrc="./images/logout.svg">Ieșire</DropdownItem></a>
                    </DropdownMenu>
                </li>
            </ul>
        );
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)(ProfileDrop);