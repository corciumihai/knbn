import React from 'react';


class ProjectName extends React.Component{
    constructor(props){
        super(props);

    }

    render(){
        return(
            <div class="form-group row">
                <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 modal-label">
                    <span class="align-middle">Project name</span>
                </div>
                <div class="col-xl-9 col-lg-9 col-md-9 col-sm-9 col-12">
                    <button class="btn btn-secondary dropdown-toggle col-12" type="button" id="dropdownMenuButtonProject" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Select project</button>
                    <div class="dropdown-menu">
                        <a class="dropdown-item" href="#" id="create-card" onClick={this.changeDropdownValue}>Project 1</a>
                        <a class="dropdown-item" href="#" id="create-component" onClick={this.changeDropdownValue}>Project 2</a>
                        <a class="dropdown-item" href="#" id="create-project" onClick={this.changeDropdownValue}>Project 3</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProjectName;