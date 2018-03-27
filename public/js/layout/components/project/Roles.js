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
            <div class="row"> 
            {!this.props.roles.length == 0 ?  
                <div class="col">
                    <div class="col d-flex justify-content-center">
                        <div class="toggle d-flex justify-content-center" onClick={this.flipToggle}>
                            <img src="./images/small-arrow-down.svg" class="mx-auto d-block" 
                                style={{transform: !this.state.toggled ? "rotate(180deg)": "rotate(0deg)"}}/>
                        </div>
                    </div>
                    <div class="roles col-xl-12 mb-2 d-flex flex-row flex-wrap">
                        {!this.state.toggled ? 
                            this.props.roles.map(role => {
                                return <Role key={role} role={role} remove={this.props.remove}/>
                            })
                            :
                            <span class="small-text">A total of <span class="highlight">{this.props.roles.length}</span> roles are being toggled</span>
                        }
                    </div>
                </div>
                : 
                <div class="col">
                    <div class="roles col mb-2">
                    <span class="small-text">No position added yet...</span>
                    </div>
                </div>
            }
            </div>
        );
    }
}

export default Roles;