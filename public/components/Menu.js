import React from 'react';
import ReactDom from 'react-dom';
import axios from 'axios';
import crypto from 'crypto';

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

    toggle(){
        this.setState({toggle: !this.state.toggle});
    }

    render(){
        return(
            <nav class="navbar navbar-expand-xl navbar-expand-lg navbar-expand-md navbar-dark">
                <a class="navbar-brand" href="/">KNBN Dashboard</a>

                <div 
                class="navbar-toggler"
                data-toggle="collapse" 
                data-target="#navbarSupportedContent" 
                aria-controls="navbarSupportedContent" 
                aria-expanded="false" 
                aria-label="Toggle navigation"
                onClick={this.toggle}>{this.state.toggle ? <img src="/images/menu-close.svg"/> : <img src="/images/menu.svg"/>}
                </div>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false" onClick={this.getProjects}>
                            Projects
                            </a> 
                            {   this.state.projects.length > 0 ?
                                <div class="dropdown-menu proj-drop">  
                                {
                                    this.state.projects.map(proj=>{
                                        return <a class="dropdown-item proj-item" href={"/view/project/" + proj.key} key={proj.key}>{proj.value}</a>
                                    })
                                }
                                </div>
                                : 
                                <div class="dropdown-menu proj-drop"> "No projects configured"</div>
                            }
                        </li>

                        <li class="nav-item active">
                            <a class="nav-link" href='/create-project'>Setup new project <span class="sr-only">(current)</span></a>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link" href="/create-ticket">Create</a>
                        </li>
                    </ul>
                    <form class="form-inline my-2 my-lg-0">
                        <input class="form-control search-inpt col" placeholder="Search" aria-label="Search"/>
                        <div class="btn search-btn align-self-end mr-0"><img src="/images/search.svg" class="d-block mx-auto" title="Search"/></div>
                    </form>
                    <form class="form-inline my-2 my-lg-0 d-flex justify-content-center">
                        <img class="profile-pic" src={'https://www.gravatar.com/avatar/' + this.state.gravatar} title={this.state.name}></img>
                        <a href="/profile" class="to-profile btn search-btn align-self-end mr-0">Profile options</a>
                    </form>
                </div>
            </nav>

        );
    }
}

ReactDom.render(<Menu/>, document.getElementById('menu'));

export default Menu;



