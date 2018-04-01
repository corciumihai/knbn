import React from 'react';

class ManageEmployee extends React.Component{
    constructor(props){
        super(props);


    }

    render(){
        return(
            <div class="employee-name ml-2 mb-2 d-flex flex-row">
                <div class="checkbox align-self-center">
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