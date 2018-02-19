import React from 'react';
import TeamLeaderTitle from './TeamLeaderTitle';
import TeamLeaderName from './TeamLeaderName';

class TeamLeader extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div class="row">
                <div class="team-leader col-xl-12">
                    <div class="container">
                        <TeamLeaderTitle/>
                        <TeamLeaderName/>
                    </div>
                </div>
            </div>
        );
    }
}

export default TeamLeader;