import React from 'react';
import ReactDom from 'react-dom';
import ProjectName from './components/project/ProjectName';
import AddRoles from './components/project/AddRoles';
import Roles from './components/project/Roles';
import update from 'react-addons-update';
import Person from './components/project/roles/Person'
import PositionDropdown from './components/project/roles/PositionDropdown';
import People from './components/project/People';
import SelectAllButton from './components/project/SelectAllButton';
import DeselectAllButton from './components/project/DeselectAllButton';
import PeopleSelector from './components/project/PeopleSelector';
import Group from './components/project/Group';
import Disciplines from './components/project/Disciplines';
import axios from 'axios';
import Cookies from 'universal-cookie';

const projectCookie = new Cookies();

class CreateProject extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            positions: [],
            currentPeople: [],
            currentName: "",
            projectName: "",
            currentPosition: "",
            loadingMessage: "",
            selectedUser: {},
            disciplines: [],
        }

        this.addRoles = this.addRoles.bind(this);
        this.removeRole = this.removeRole.bind(this);
        this.changeProjectName = this.changeProjectName.bind(this);
        this.changeCurrentName = this.changeCurrentName.bind(this);
        this.changeCurrentPosition = this.changeCurrentPosition.bind(this);
        this.addPerson = this.addPerson.bind(this);
        this.setUser = this.setUser.bind(this);
        this.removePerson = this.removePerson.bind(this);
        this.addDiscipline = this.addDiscipline.bind(this);
    }

    componentDidMount(){
        // fetch data from cookies
        let disciplines = projectCookie.get('project-disciplines');
        if(disciplines.disciplines.length > 0){
            this.setState({disciplines: disciplines.disciplines});
        }
        
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

    changeProjectName(event, cookieChange=false){
        if(cookieChange){
            console.log(event);
            this.setState({projectName: event}); // if name was found in cookie
        }
        else{
            this.setState({projectName: event.target.value});
        }
    }

    changeCurrentName(event){
        this.setState({
            currentName: event.target.value,
            filteredUsers: event.target.value.length > 0 ? this.state.allUsers.filter(element => element.name.toLowerCase().includes(event.target.value.toLowerCase()
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
        // check if the selected user object has the needed attributes empty
        
    }

    removePerson(person){
        if (person.length == 0)
            return;
        
        this.setState({people: update(this.state.people, {$splice: [[this.state.people.indexOf(person), 1]]})});
        
    }

    addDiscipline(discipline){
        this.setState({disciplines: update(this.state.disciplines, {$push: [discipline]})}, () => {
            projectCookie.set('project-disciplines', {disciplines: this.state.disciplines});
        });
    }

    render(){
        return(
            !this.state.loadingUsers ? 
            <div class='project col-xl-6 offset-xl-3'>
                <form>
                    <ProjectName name={this.state.projectName} onChange={this.changeProjectName}/>
                    <Disciplines add={this.addDiscipline} disciplines={this.state.disciplines}/>
                    {/* <div class="form-group d-flex flex-row flex-wrap mb-2">
                        <Group/>
                    </div> */}
                    {/* <AddRoles add={this.addRoles}/> */}
                    {/* <Roles roles={this.state.positions} remove={this.removeRole}/> */}
                    {/* <div class="form-group d-flex flex-row flex-wrap mb-2"> */}
                        {/* make it so that you can select multiple persons for a role */}
                        {/* <Person name={this.state.currentName} changeName={this.changeCurrentName} users={this.state.filteredUsers} setUser={this.setUser}>
                            <AddButton add={this.addPerson}/>
                        </Person>
                        <People people={this.state.currentPeople}/> */}
                    {/* </div> */}
                </form>
                <div class="row">
                    <div class="col d-flex mb-2">
                        <button type="submit" class="next col-xl-2 offset-xl-10 col-md-4 offset-md-4 col-sm-12 col-12 button btn">Proceed</button>
                    </div>
                </div>
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