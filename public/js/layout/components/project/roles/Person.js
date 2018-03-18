import React from 'react';
import PositionDropdown from './PositionDropdown';

class Person extends React.Component{
    constructor(props){
        super(props);

        this.setUser = this.setUser.bind(this);
    }

    setUser(user){
        this.props.setUser(user);
    }

    render(){
        return(
            <div class="col-xl-6 col-12">
                <label for="name">Name</label>
                <input type="text" class="form-control col" id="name" aria-describedby="name" placeholder="Enter name" onChange={this.props.changeName} value={this.props.name}
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="dropdownMenuButton"/>
                
                <div class="dropdown-menu">
                {
                 this.props.users == undefined || this.props.users.length == 0 ? 
                    <a href="#" class="dropdown-item">No users in the system</a>
                    :
                    this.props.users.map(user => {
                        let click = this.setUser.bind(this, user);
                        return <a href="#" key={user.email} class="dropdown-item" onClick={click}>{user.name}({user.email})</a>
                    })
                }
            </div>
                <small id="name-help" class="form-text text-muted">This is the name</small>
            </div>
        );
    }
}

export default Person;