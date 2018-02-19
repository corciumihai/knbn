import React from 'react';
import Search from '../Search';

class TeamLeaderName extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div class="row">
                <div class="col-xl-6 col-12">
                    <form class='name'>
                        <div class="form-group">
                            <label for="name">Team leader name</label>
                            <input type="text" class="form-control" id="name" aria-describedby="help" placeholder="Enter team leader name"/>
                            <small id="help" class="form-text text-muted">This is the team leader's name</small>
                        </div>
                    </form>
                </div>
            <Search/>
            </div>
        );
    }
}

export default TeamLeaderName;