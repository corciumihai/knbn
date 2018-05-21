import React from 'react';

class Users extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="row mb-2 pt-3 pb-3">
                {
                    this.props.children
                }
                <div class="col"><a class="assign-to mt-1 pb-1 pl-2 pr-2" href="#">Assign to me</a></div>
            </div>
        );
    }
}

export default Users;