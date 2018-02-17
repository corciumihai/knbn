import React from 'react';
import axios from 'axios';

class ProjectName extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            loading: true,
            projects: {},
        }

        this.onChange = this.onChange.bind(this);
    }

    onChange(element){
        this.props.onChange(element);
    }

    componentDidMount(){
        axios.get('/get-projects').then((response) => {
            this.setState({
                loading: false,
                projects: response.data,
            })
        });
    }

    render(){
        return(
            <div class="row">
                <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 modal-label">
                    <span class="align-middle">Project name</span>
                </div>
                {!this.state.loading ? 
                <div class="col">
                    <div class="container">
                    {this.state.projects.length || this.state.projects ? 
                        <div class="row">
                            <div class="col-xl-6 project-selection offset-xl-3" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <div class="container">
                                    <div class="row">
                                        <div class="col project-name">
                                            {this.props.project.name ? this.props.project.name : "Select project"}
                                        </div>
                                        <div class="d-flex project-small-button">
                                            <img src="/images/small-arrow-down.svg" class="mx-auto d-block align-self-center"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="dropdown-menu">
                                {   
                                this.state.projects.map((project) => {
                                    let boundClick = this.onChange.bind(this, project);
                                    return <a class="dropdown-item" key={project.id} href="#" onClick={ boundClick } id="create-card" >{project.name}</a>
                                })
                        
                                }
                            </div>
                        </div>
                        :
                        <div class="row">
                            <div class="col project-name">No projects are configured</div>
                        </div> 
                        }
                    </div>
                </div>
                :
                <div class="col">
                    Loading projects...
                </div>
                }
            </div>
        );
    }
}

export default ProjectName;