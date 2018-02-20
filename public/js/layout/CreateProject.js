import React from 'react';
import ReactDom from 'react-dom';
import ProjectName from './components/project/ProjectName';
import AddRoles from './components/project/AddRoles';
import Developers from './components/project/roles/Developers';
import TeamLeaders from './components/project/roles/TeamLeaders';
import Roles from './components/project/Roles';
import update from 'react-addons-update';

class CreateProject extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            roles: ["Software Developer", "Tester"],
        }

        this.addRoles = this.addRoles.bind(this);
        this.removeRole = this.removeRole.bind(this);
    }

    addRoles(roles){
        let array = roles.split(",");

        array.forEach(element => {
            element = element.trim();
            if(element.length == 0){
                return;
            }
            
            if(this.state.roles.includes(element)){
                console.log('Item already in the list');
                return;
            }

            this.setState({roles: update(this.state.roles, {$push: [element]})});
        });
    }

    removeRole(role){
        this.setState({roles: update(this.state.roles, {$splice: [[this.state.roles.indexOf(role), 1]]})});
    }

    render(){
        return(
            <div class='col project'>
                <div class="container">
                    <ProjectName />
                    <AddRoles add={this.addRoles}/>
                    <Roles roles={this.state.roles} remove={this.removeRole}/>
                </div>
            </div>
        );
    }
}

ReactDom.render(<CreateProject/>, document.getElementById('project'));

export default CreateProject;