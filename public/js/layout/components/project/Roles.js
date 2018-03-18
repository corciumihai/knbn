import React from 'react';
import Role from './Role';
import update from 'react-addons-update';

class Roles extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            toggled: false,
        }

        this.flipToggle = this.flipToggle.bind(this);
    }

    flipToggle(){
        this.setState({toggled: !this.state.toggled});
    }

    render(){
        return(
            !this.props.roles.length == 0 ?
                <div class="roles col-xl-12 mb-2">
                    <div class="roles-bar row d-flex">
                        <div class="roles-toggle ml-3 d-flex justify-content-center">
                            <img src="./images/small-arrow-down.svg" class="mx-auto d-block" 
                                onClick={this.flipToggle} style={!this.state.toggled ? {transform: "rotate(180deg)"} : {transform: "rotate(0deg)"}}/>
                        </div>
                        <div class="col d-flex"><span class="align-self-center">Roles</span></div>
                    </div>
                    <div class="row">
                        <div class={!this.state.toggled ? "col d-flex flex-row flex-wrap" : "d-none"}>
                        {
                            this.props.roles.map(role => {
                                return <Role key={role} role={role} remove={this.props.remove}/>
                            })
                        }
                        </div>
                    </div>
                </div>
                : 
                <div class="col mb-2">
                    <div class="row">
                        <div class="no-roles col">
                            <span>No roles added yet</span>
                        </div>
                    </div>
                </div>
        );
    }
}

export default Roles;