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
            <div class="col-xl-3 col-12">
                <label for="name">Select names</label>
                <input type="text" class="form-control col" id="name" placeholder="Enter name" onChange={this.props.changeName} value={this.props.name}/>

                <small id="name-help" class="form-text text-muted mb-2">Search name in the database</small>

                {this.props.children}
            </div>
        );
    }
}

export default Person;