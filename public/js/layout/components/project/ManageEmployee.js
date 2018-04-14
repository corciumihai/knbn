import React from 'react';

class ManageEmployee extends React.Component{
    constructor(props){
        super(props);

        this.toggle = this.toggle.bind(this);
    }

    toggle(user){
        this.props.enableUser({user: user, toggled: !this.props.toggled});
    }

    render(){
        let boundClick = this.toggle.bind(this, this.props.details);
        return(
            <div class="employee-name ml-2 mb-2 d-flex flex-row" onClick={boundClick}>
                <div class={this.props.toggled ? "checkbox checkbox-green align-self-center" : "checkbox align-self-center"}>
                </div>
                <div class="col d-flex flex-column">
                    <div>{this.props.details.name}</div>
                    <div>{this.props.details.email}</div>
                </div>
            </div>
        );
    }
}

export default ManageEmployee;