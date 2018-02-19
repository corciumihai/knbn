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
            <div class="role">
                <div class="container">
                    <div class="row">
                        <div class="col d-flex"><span class="align-self-center">{this.props.role}</span></div>
                        <div class="remove-role" onClick={this.remove}>X</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Role;