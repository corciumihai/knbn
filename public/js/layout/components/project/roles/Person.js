import React from 'react';
import PositionDropdown from './PositionDropdown';

class Person extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="col-xl-6 col-12">
                <label for="name">Name</label>
                <input type="text" class="form-control" id="name" aria-describedby="name" placeholder="Enter name" onChange={this.props.changeName} value={this.props.name}/>
                <small id="name-help" class="form-text text-muted">This is the name</small>
            </div>
        );
    }
}

export default Person;