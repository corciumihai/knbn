import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

const projectCookie = new Cookies();

class ProjectName extends React.Component{
    constructor(props){
        super(props);
    }

    // html page section
    render(){
        return(
            <div class="form-group mb-2">
                <div class="col">
                    <label for="project-name">Project name</label>
                    <input type="text" class="form-control col" id="project-name" aria-describedby="project-help" placeholder="Enter project name"
                        onChange={this.props.onChange} value={this.props.name}/>
                    <small id="project-help" class="form-text text-muted mb-2">This is your project's name</small>
                </div>
            </div>
        );
    }
}

export default ProjectName;