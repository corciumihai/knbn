import React from 'react';
import ReactDom from 'react-dom';
import axios from 'axios';
import crypto from 'crypto';
import { NavLink } from 'react-router-dom'
import SearcBar from './search/SearchBar';

class Menu extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            toggle: false,
            projects: [],
            loadProj: false,
            email: '',
            name: '',
            gravatar: ''
        }

        this.toggle = this.toggle.bind(this);
        this.getProjects = this.getProjects.bind(this);
    }

    getProjects(){
        axios.get('/get-projects').then(response => {
            this.setState({projects: response.data});
        });
    }

    componentDidMount(){
        // get gravatar hash
        axios.get('/current-user').then(response => {
            if(response.data.success){this.setState({email: response.data.email, name: response.data.name}, () => {
                var md5 = crypto.createHash('md5');
                this.setState({gravatar: md5.update(String(this.state.email).toLowerCase().trim()).digest('hex')});
            })}
        });
    }

    toggle(){this.setState({toggle: !this.state.toggle});}

    render(){
        return(
            <nav class="knbn-navbar navbar navbar-expand-xl navbar-expand-lg navbar-expand-md navbar-dark">
                <a class="knbn-navbar-brand navbar-brand" href="/">KNBN Dashboard</a>

                <div class="knbn-navbar-toggler navbar-toggler" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" onClick={this.toggle}>
                    {this.state.toggle ? <img src="/images/menu-close.svg"/> : <img src="/images/menu.svg"/>}
                </div>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto">
                        <li class="knbn-nav-item nav-item dropdown">
                            <a class="knbn-nav-link nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false" onClick={this.getProjects}>
                                Projects
                            </a> 
                            {   this.state.projects.length > 0 ?
                                <div class="knbn-dropdown-menu dropdown-menu">  
                                {
                                    this.state.projects.map(proj=>{
                                        return <a class="knbn-dropdown-item dropdown-item" href={"/view/project/" + proj.id} key={proj.id}>{proj.name}</a>
                                    })
                                }
                                </div>
                                : 
                                <div class="knbn-dropdown-menu knbn-no-configuration dropdown-menu px-2">No projects configured</div>
                            }
                        </li>

                        <li class="knbn-nav-item nav-item">
                            <a class="knbn-nav-link nav-link" href='/create-project'>Setup new project</a>
                        </li>

                        <li class="knbn-nav-item nav-item">
                            <div class="dropdown knbn-dropdown">
                                <a class="knbn-nav-link nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                                    Create ...
                                </a>
                                <div class="knbn-dropdown-menu dropdown-menu">
                                    <NavLink to="/create-ticket"><div class="knbn-dropdown-item dropdown-item">Ticket</div></NavLink>
                                    <NavLink to="/create-pr"><div class="knbn-dropdown-item dropdown-item">Problem report</div></NavLink>
                                    <NavLink to="/create-cmp"><div class="knbn-dropdown-item dropdown-item">Component</div></NavLink>
                                </div>
                            </div>
                        </li>
                    </ul>
                    
                    <SearcBar/>

                    <form class="form-inline my-2 my-lg-0 d-flex justify-content-center">
                        <img class="profile-pic" src={'https://www.gravatar.com/avatar/' + this.state.gravatar} title={this.state.name}></img>
                        <a href="/profile" class="to-profile btn search-btn align-self-end mr-0">Profile options</a>
                    </form>
                </div>
            </nav>

        );
    }
}

// ReactDom.render(<Menu/>, document.getElementById('menu'));

export default Menu;



