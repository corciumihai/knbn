import React from 'react';
import Role from './Role';
import update from 'react-addons-update';

class Roles extends React.Component{
    constructor(props){
        super(props);
    }

    // removeRole(role){
    //     this.setState({ roles: update(this.state.roles, {$splice: [[this.state.roles.indexOf(role), 1]]}) });
    // }

    render(){
        return(
            <div class="roles row">
                {
                    this.props.roles.map(role => {
                        return <Role key={role} role={role} remove={this.props.remove}/>
                    })
                }
            </div>
        );
    }
}

export default Roles;