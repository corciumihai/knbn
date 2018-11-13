import React from 'react';
import ReactDom from 'react-dom';
import axios from 'axios';

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

    toggle(){
        this.setState({toggle: !this.state.toggle});
    }

    render(){
        return(
            <nav class="navbar  navbar-expand-xl navbar-expand-lg navbar-expand-md navbar-dark mb-3">
                <a class="navbar-brand" href="/">KNBN Dashboard</a>
                <div class="navbar-toggler" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"
                    onClick={this.toggle}>
                    {
                        this.state.toggle ? <img src="/images/menu-close.svg"/> : <img src="/images/menu.svg"/>
                    }
                    
                </div>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item active">
                            <a class="nav-link" href='/create-project'>Setup new project <span class="sr-only">(current)</span></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/create">Create</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false" onClick={this.getProjects}>Projects</a>
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
                    </ul>
                    <div class="search-bar d-flex flex-row px-2">
                        <input class="form-control search-inpt col" placeholder="Search" aria-label="Search"/>
                        <div class="btn search-btn align-self-end mr-0"><img src="/images/search.svg" class="d-block mx-auto" title="Search"/></div>
                    </div>
                </div>
            </nav>

        );
    }
}

ReactDom.render(<Menu/>, document.getElementById('menu'));

export default Menu;



