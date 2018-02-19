import React from 'react';
import Role from './Role';
import update from 'react-addons-update';

class Roles extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            roles: ["Software Developer", "Tester", "Project Manager"],
        }

        this.removeRole = this.removeRole.bind(this);
    }

    removeRole(role){
        this.setState({ roles: update(this.state.roles, {$splice: [[this.state.roles.indexOf(role), 1]]}) });
    }

    render(){
        return(
            <div class="row">
                <div class="col">
                    <div class="container">
                        <div class="row">
                            <form class="add-role">
                                <div class="form-group">
                                    <label for="add-role">Add your roles</label>
                                    <input type="text" class="form-control" id="add-role" aria-describedby="help" placeholder="Enter a role"/>
                                    <small id="help" class="form-text text-muted"><a href="#">Help</a></small>
                                </div>
                            </form>
                        </div>
                        <div class="row d-flex">
                            {
                                !this.state.roles.length ? null :
                                    this.state.roles.map((role) => {
                                        return <Role key={role} role={role} remove={this.removeRole}/>
                                    })
        
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Roles;