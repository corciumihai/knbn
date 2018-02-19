import React from 'react';

class TeamLeadersContainer extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="container-fluid" style={this.props.isVisible ? {display: ""} : {display: "none"}}>
                {this.props.children}
            </div>
        );
    }
}

export default TeamLeadersContainer;