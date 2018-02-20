import React from  'react';

class Role extends React.Component{
    constructor(props){
        super(props);

        this.remove = this.remove.bind(this);
    }

    remove(){
        this.props.remove(this.props.role);
    }

    render(){
        return(
            <div class="role d-flex flex-row">
                <div class="role-name col">{this.props.role}</div>
                <button class="remove-role btn" onClick={this.remove}>X</button>
            </div>
        );
    }
}

export default Role;