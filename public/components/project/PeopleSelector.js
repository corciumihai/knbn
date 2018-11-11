import React from 'react';
import ManageEmployee from './ManageEmployee';

class PeopleSelector extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="people-selector col mt-2 mb-2">
                <div class="row">
                    {
                    this.props.users.length > 0 ?
                        this.props.users.map(person => {
                            return <ManageEmployee key={person.email} details={person} enableUser={this.props.enableUser} toggled={person.toggled}/>
                        })
                        :
                        <span class="no-users">There are no users in the database. Please add them before creating a new project</span>
                    }
                </div>
            </div>
        );
    }
}

export default PeopleSelector;