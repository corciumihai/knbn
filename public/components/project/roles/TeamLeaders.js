import React from 'react';
import ToggleButton from './ToggleButton';
import TeamLeadersContainer from './teamLeader/TeamLeadersContainer';
import TeamLeader from './teamLeader/TeamLeader';
import AddNew from './AddNew';


class TeamLeaders extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            isVisible: true,
        }

        this.flipVisibility = this.flipVisibility.bind(this);
    }

    flipVisibility(){
        this.setState({isVisible: !this.state.isVisible})
    }

    render(){
        return(
            <div class="row team-leaders">
                <div class="toggle-bar col d-flex flex-row">
                    <ToggleButton changeVisibility={this.flipVisibility}/>
                    <span class="align-self-center">Team Leaders</span>
                </div>

                <TeamLeadersContainer isVisible={this.state.isVisible}>
                    
                    <TeamLeader/>
                    <AddNew/>
                </TeamLeadersContainer>
            </div>
        );
    }
}

export default TeamLeaders;