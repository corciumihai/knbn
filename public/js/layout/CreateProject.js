import React from 'react';
import ReactDom from 'react-dom';
import ProjectName from './components/project/ProjectName';
import AddRoles from './components/project/AddRoles';
import Roles from './components/project/Roles';
import update from 'react-addons-update';
import Person from './components/project/roles/Person'
import PositionDropdown from './components/project/roles/PositionDropdown';
import People from './components/project/People';
import AddButton from './components/project/AddButton';
import axios from 'axios';

class CreateProject extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            positions: [],
            people: [   {name:"John Maverick", position: 'Software Developer', email: "lol@yahoo.com"}, 
                        {name:"Mihai Corciu", position: 'Software Developer', email: "free_roaming94@yahoo.com"}, 
                        {name:"Raluca Pojar", position: 'Team Leader', email: "raluca@yahoo.com"}
                    ],
            projectName: "",
            currentPosition: "",
            currentName: "",
            allUsers: [],
            filteredUsers: [],
            loadingUsers: true,
            loadingMessage: "",
            selectedUser: {},
        }

        this.addRoles = this.addRoles.bind(this);
        this.removeRole = this.removeRole.bind(this);
        this.changeProjectName = this.changeProjectName.bind(this);
        this.changeCurrentName = this.changeCurrentName.bind(this);
        this.changeCurrentPosition = this.changeCurrentPosition.bind(this);
        this.addPerson = this.addPerson.bind(this);
        this.setUser = this.setUser.bind(this);
        this.removePerson = this.removePerson.bind(this);
    }

    componentDidMount(){
        // fetch all users from database
        axios.get('/users/get-users').then(response => {
            this.setState({loadingUsers: false, allUsers: response.data}, () => {
                this.setState({filteredUsers: response.data}, 
                    this.setState({loadingMessage: "Loading users..."}))
            })
        });
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
        this.setState({
            currentName: event.target.value,
            filteredUsers: event.target.value.length || this.state.currentName > 0 ?    this.state.allUsers.filter(element => element.name.toLowerCase().includes(event.target.value.toLowerCase()
                                                                                            || element.email.toLowerCase().includes(event.target.value.toLowerCase()))) : 
                                                                                        this.state.allUsers})
    }

    setUser(user){
        this.setState({ selectedUser: user,
                        currentName: user.name,
                        filteredUsers: this.state.allUsers.filter(element => element.name.toLowerCase().includes(user.name.toLowerCase()
                                                                             || element.email.toLowerCase().includes(user.email.toLowerCase())))});
    }

    changeCurrentPosition(element, event){
        this.setState({currentPosition: element});
    }

    addPerson(event){
        event.preventDefault();
        // check if the person is not already in the list
        if(this.state.people.find(element => {
            return element.email == this.state.selectedUser.email
        })){
            console.log('User already in the list');
            return;
        }
        //some comment
        // add person to the list
        this.setState({ people: update(this.state.people, {$push: [{name: this.state.selectedUser.name, position: this.state.currentPosition, email: this.state.selectedUser.email}]}),
                        currentName: "",
                        currentPosition: "",
                        filteredUsers: this.state.allUsers},
                        () => {
                            console.log(this.state.people);
                        }
        );
    }

    removePerson(person){
        if (person.length == 0)
            return;
        
        this.setState({people: update(this.state.people, {$splice: [[this.state.people.indexOf(person), 1]]})});
        
    }

    render(){
        return(
            !this.state.loadingUsers ? 
            <div class='project col-xl-6 offset-xl-3'>
                <form>
                    <ProjectName name={this.state.name} onChange={this.changeProjectName}/>
                    <AddRoles add={this.addRoles}/>
                    <Roles roles={this.state.positions} remove={this.removeRole}/>
                    <div class="form-group d-flex flex-wrap">
                        <Person name={this.state.currentName} changeName={this.changeCurrentName} users={this.state.filteredUsers} setUser={this.setUser}/>
                        <PositionDropdown positions={this.state.positions} position={this.state.currentPosition} changePosition={this.changeCurrentPosition}/>
                        <AddButton add={this.addPerson}/>
                    </div>
                </form>
                <People people={this.state.people} remove={this.removePerson}/>
            </div>
            :
            <div class="col d-flex align-items-center justify-content-center loading">
                <div>{this.state.loadingMessage}</div>
            </div>
        );
    }
}

ReactDom.render(<CreateProject/>, document.getElementById('project'));

export default CreateProject;