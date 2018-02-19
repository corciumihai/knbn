import React from 'react';

class ProjectName extends React.Component{
    constructor(props){
        super(props);

    }

    render(){
        return(
            <div class="row">
                <div class="col">
                    <form class='project-name'>
                        <div class="form-group">
                            <label for="project-name">Project name</label>
                            <input type="text" class="form-control" id="project-name" aria-describedby="project-help" placeholder="Enter project name"/>
                            <small id="project-help" class="form-text text-muted">This is the project's name</small>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default ProjectName;