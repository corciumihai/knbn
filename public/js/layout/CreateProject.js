import React from 'react';
import ReactDom from 'react-dom';
import ProjectName from './components/project/ProjectName';
import AddRoles from './components/project/AddRoles';
import Roles from './components/project/Roles';
import update from 'react-addons-update';
import Person from './components/project/roles/Person'
import PositionDropdown from './components/project/roles/PositionDropdown';
import People from './components/project/People';

class CreateProject extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            positions: [],
            people: [],
            projectName: "",
            currentPosition: "",
            currentName: "",
        }

        this.addRoles = this.addRoles.bind(this);
        this.removeRole = this.removeRole.bind(this);
        this.changeProjectName = this.changeProjectName.bind(this);
        this.changeCurrentName = this.changeCurrentName.bind(this);
        this.changeCurrentPosition = this.changeCurrentPosition.bind(this);
    }

    addRoles(roles){
        let array = roles.split(",");
        let newArray = [];

        array.forEach(element => {
            element = element.trim();
            if(element.length == 0){
                return;
            }
            
            if(this.state.positions.includes(element)){
                console.log('Item already in the list');
                return;
            }

            newArray.push(element);
        });

        this.setState({positions: update(this.state.positions, {$push: newArray})});
    }

    removeRole(role){
        this.setState({positions: update(this.state.positions, {$splice: [[this.state.positions.indexOf(role), 1]]})});
    }

    changeProjectName(event){
        this.setState({projectName: event.target.value});
    }

    changeCurrentName(event){
        this.setState({currentName: event.target.value});
    }

    changeCurrentPosition(element, event){
        this.setState({currentPosition: element});
    }

    // addPerson(){
    //     this.setState({people: update(this.state.people)})
    // }

    render(){
        return(
            <div class='project col-xl-6 offset-xl-3'>
                <form>
                    <ProjectName name={this.state.name} onChange={this.changeProjectName}/>
                    <AddRoles add={this.addRoles}/>
                    <Roles roles={this.state.positions} remove={this.removeRole}/>
                    <div class="form-group d-flex flex-wrap">
                        <Person name={this.state.currentName} changeName={this.changeCurrentName}/>
                        <PositionDropdown positions={this.state.positions} position={this.state.currentPosition} changePosition={this.changeCurrentPosition}/>
                        <div class="col-xl-12 col-12 mb-2">
                            <button type="submit" class="button btn button col-xl-2 col-12" onClick={this.addPerson}>Add person</button>
                        </div>
                    </div>
                </form>
                <People people={this.state.people}/>
            </div>
        );
    }
}

ReactDom.render(<CreateProject/>, document.getElementById('project'));

export default CreateProject;