import React from 'react';
import { NavLink } from 'react-router-dom';
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
        currentUser: state.currentUser
    }
}

class ProfileDrop extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <ul class={"navbar-nav"}>
                <li class={"knbn-nav-item nav-item dropdown knbn-no-border knbn-transition"}>
                    <KNBNNavLink onClick={() => {}}>
                        <img class="profile-pic my-auto mr-2" src={this.props.currentUser.gravatar} title={this.props.currentUser.name}></img>
                        {this.props.currentUser.name == undefined || this.props.currentUser.name.length == 0 ? 'Persoană nedefinită' : this.props.currentUser.name}
                    </KNBNNavLink>
            
                    <DropdownMenu>
                        <NavLink to="">
                            <DropdownItem dark={this.props.themeToggled}>Acțiune viitoare</DropdownItem>
                        </NavLink>
                        <a href="/logout"><DropdownItem dark={this.props.themeToggled}>Ieșire</DropdownItem></a>
                    </DropdownMenu>
                </li>
            </ul>
        );
    }
}

export default connect(mapStatetoProps)(ProfileDrop);