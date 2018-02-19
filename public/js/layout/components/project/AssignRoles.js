import React from 'react';

class AssignRoles extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="row assign-roles">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col"><span>Assign roles</span></div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="container">
                                {this.props.children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AssignRoles;