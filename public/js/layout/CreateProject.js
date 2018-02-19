import React from 'react';
import ReactDom from 'react-dom';
import ProjectName from './components/project/ProjectName';
import AssignRoles from './components/project/AssignRoles';
import Developers from './components/project/roles/Developers';
import TeamLeaders from './components/project/roles/TeamLeaders';
import Roles from './components/project/Roles';

class CreateProject extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class='col project'>
                <div class="container">
                    <ProjectName />
                    <Roles/>
                    <AssignRoles>
                        <Developers/>
                        <TeamLeaders/>
                    </AssignRoles>
                </div>
            </div>
        );
    }
}

ReactDom.render(<CreateProject/>, document.getElementById('project'));

export default CreateProject;