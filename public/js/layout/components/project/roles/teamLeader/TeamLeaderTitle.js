import React from 'react';

class TeamLeaderTitle extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="row">
                <div class="col">
                    <form class='team-leader-title'>
                        <div class="form-group">
                            <label for="team-leader-title">Team leader title</label>
                            <input type="text" class="form-control" id="team-leader-title" aria-describedby="team-leader-title-help" placeholder="Enter team leader title"/>
                            <small id="team-leader-title-help" class="form-text text-muted">This is the team leader's title</small>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default TeamLeaderTitle;