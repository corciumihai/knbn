import React from 'react';
import axios from 'axios';
import crypto from 'crypto';
import { NavLink } from 'react-router-dom';
import SearcBar from './menu/SearchBar';
import ProfileDrop from './profile/ProfileDrop';
import DropdownMenu from './menu/DropdownMenu';
import KNBNNavLink from './menu/KNBNNavLink';
import DropdownItem from './menu/DropdownItem';
import { connect } from 'react-redux';
import ThemeToggler from './menu/ThemeToggler';

const mapStatetoProps = (state) => {
    return {
        themeToggled: state.themeToggled,
        currentUser: state.currentUser
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadProfile: () => {
            dispatch({
                type: 'KNBN_LOAD_TOKEN',
            });
        },
    }
}

class Menu extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            toggle: false,
            projects: [],
            loadProj: false,
        }

        this.toggle = this.toggle.bind(this);
        this.getProjects = this.getProjects.bind(this);
    }

    getProjects(){
        axios.get('/get-projects').then(response => {
            this.setState({projects: response.data});
        });
    }

    toggle(){this.setState({toggle: !this.state.toggle});}

    componentWillMount(){
        this.getProjects();
        this.props.loadProfile();
    }

    render(){
        return(
            <div class="row">
                <nav class={"knbn-navbar navbar navbar-expand-xl navbar-expand-lg navbar-expand-md navbar-dark knbn-transition col-xl-12" + (this.props.themeToggled ? " knbn-dark-bg-2x" : " knbn-snow-bg-2x")}>
                    <a class={"knbn-navbar-brand navbar-brand knbn-transition" + (this.props.themeToggled ? " knbn-dark-color-2x knbn-dark-color-2x-active" : " knbn-snow-color-2x knbn-snow-color-2x-active")} href="/">Bord KNBN</a>

                    <div class="knbn-navbar-toggler navbar-toggler" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Comută navigație" onClick={this.toggle}>
                        {this.state.toggle ? <img src="/images/menu-close.svg"/> : <img src="/images/menu.svg"/>}
                    </div>

                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class={"navbar-nav mr-auto"}>
                            <li class={"knbn-nav-item nav-item dropdown knbn-no-border"} title='Arată proiectele curente'>
                                <KNBNNavLink onClick={() => {}}>Proiecte</KNBNNavLink>

                                <DropdownMenu>
                                {   this.state.projects.length > 0 ?
                                    this.state.projects.map(project => {
                                        return  <NavLink key={project.id} to={"/view-project/" + project.id}>
                                                    <DropdownItem imgSrc={'./images/project.svg'}>{project.name}</DropdownItem>
                                                </NavLink>
                                    })
                                    :
                                    "Niciun proiect configurat"
                                }
                                </DropdownMenu>
                                
                            </li>

                            <li class={"knbn-nav-item nav-item"} title='Creează proiect nou'>
                                <NavLink to='/create-project'>
                                    <KNBNNavLink>Creează proiect nou</KNBNNavLink>
                                </NavLink>
                            </li>

                            <li class={"knbn-nav-item nav-item dropdown knbn-no-border"}>

                                <KNBNNavLink onClick={() => {}}>Creează</KNBNNavLink>

                                <DropdownMenu>
                                    <NavLink to="/create-ticket">
                                        <DropdownItem imgSrc="./images/ticket.svg">Tichet</DropdownItem>
                                    </NavLink>
                                    <NavLink to="/create-pr">
                                        <DropdownItem imgSrc="./images/pr.svg">Raport de problemă</DropdownItem>
                                    </NavLink>
                                    <NavLink to="/create-cmp">
                                        <DropdownItem imgSrc="./images/comp.svg">Componentă</DropdownItem>
                                    </NavLink>
                                </DropdownMenu>

                            </li>
                            
                        </ul>
                        
                        <SearcBar/>
                        <ProfileDrop user={this.props.currentUser}/>
                        <ThemeToggler/>
                    </div>
                </nav>
            </div>
        );
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)(Menu);