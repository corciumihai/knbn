import React from 'react';
import Role from './Role';
import update from 'react-addons-update';

class Roles extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            !this.props.roles.length == 0 ? 
            <div class="roles row">
                {
                    this.props.roles.map(role => {
                        return <Role key={role} role={role} remove={this.props.remove}/>
                    })
                }
            </div>
            : null
        );
    }
}

export default Roles;