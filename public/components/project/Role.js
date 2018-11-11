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
                <button class="select-role btn"><img src="./images/remove.svg" class="mx-auto d-block"/></button>
                <div class="role-name col"><span class="align-self-center">{this.props.role}</span></div>
                <button class="remove-role btn" onClick={this.remove}><img src="./images/remove.svg" class="mx-auto d-block"/></button>
            </div>
        );
    }
}

export default Role;