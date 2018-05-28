import React from 'react';
import DropdownSearch from './DropdownSearch';
import axios from 'axios';

class Assignee extends React.Component{
    constructor(props){
        super(props);

        this.state = {users: [], loadingUsers: true}
    }

    componentWillMount(){
        axios.get('/users/get-users').then(response => {this.setState({users: response.data, loadingUsers: false});});
    }

    render(){
        return(
            <div class="row">
                <div class="col-xl-12">
                    <DropdownSearch list={this.state.users} item={{value: this.props.name, key: this.props.id}} 
                        onClick={this.props.set} loading={this.state.loading} placeholder="Assignee"/>
                </div>
            {
                this.props.error != undefined && this.props.error.length > 0 ?
                    <div class="col-xl-12"><span class="error">{this.props.error}</span></div>
                    :   
                    null
            }
            </div>          
        );
    }
}

export default Assignee;