import React from 'react';


class ProjectName extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            projects: [{name: "Project 1"}, {name: "Project 2"}, {name: "Project 3"}, {name: "Project 4"}, {name: "Project 5"}],
        }

        this.onChange = this.onChange.bind(this);
    }

    onChange(element){
        this.props.onChange(element);
    }

    render(){
        return(
            <div class="row">
                <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 modal-label">
                    <span class="align-middle">Project name</span>
                </div>
                <div class="col">
                    <button class="btn btn-secondary dropdown-toggle col-12" type="button" id="dropdownMenuButtonProject" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {
                            this.props.project.length ? this.props.project.name : "Select project"
                        }
                    </button>
                    <div class="dropdown-menu">
                    {
                        this.state.projects.map((project) => {
                            let boundClick = this.onChange.bind(this, project);
                            return <a class="dropdown-item" key={project.name} href="#" onClick={ boundClick } id="create-card" >{project.name}</a>
                        })
                    }
                    </div>
                </div>
            </div>
        );
    }
}

export default ProjectName;