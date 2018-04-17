import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

const projectCookie = new Cookies();

class ProjectName extends React.Component{
    constructor(props){
        super(props);

        this.save = this.save.bind(this);
    }

    componentDidMount(){
        // check if there a name already configured and change it in the parent component
        let lastProjectName = projectCookie.get('project-name').name;
        if(lastProjectName.length > 0){
            console.log('Previous name found in cookie. Changing name in parent component...');
            this.props.onChange(lastProjectName, true);
        }
    }

    save(event){
        let projectName = event.target.value;
        if(projectName.length === 0){
            return;
        }
        // check previous cookie
        if(projectCookie.get('project-name').name === projectName){
            // do not save
            return;
        }
        // save new name to cookie
        console.log('Saving project name to cookies');
        projectCookie.set('project-name', {name: projectName});
    }

    // html page section
    render(){
        return(
            <div class="form-group mb-2">
                <div class="col">
                    <label for="project-name">Project name</label>
                    <input type="text" class="form-control col" id="project-name" aria-describedby="project-help" placeholder="Enter project name"
                        onChange={this.props.onChange} value={this.props.name} onBlur={this.save}/>
                    <small id="project-help" class="form-text text-muted mb-2">This is your project's name</small>
                </div>
            </div>
        );
    }
}

export default ProjectName;