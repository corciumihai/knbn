import React from 'react';
import axios from 'axios';

class User extends React.Component{
    constructor(props){
        super(props);

        this.state = {user: {}, enabled: false, users:[]}
        this.setEnabled  = this.setEnabled.bind(this);
    }

    componentWillMount(){
        this.setState({user: this.props.user}, () => {axios.get('/users/get-users').then(response => {this.setState({users: response.data, loading: false})})});
    }

    setEnabled(){
        this.setState({enabled: !this.state.enabled});
    }

    render(){
        return(
            <div class="col ticket-data modifiable py-1">
                <div class="row" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <div class="edit-field ml-1" title="Assignee"><img src="/images/user.svg" class="d-block mx-auto"/></div>
                    <div class="col">{this.state.user.name}</div>
                    <div class="edit-field mr-1" title="Edit" onClick={this.setEnabled}><img src="/images/arr-dwn.svg" class="d-block mx-auto"/></div>
                </div>
                <div class="dropdown-menu tag w-100 modifiable">
                {
                    this.state.users.length > 0 ?
                        this.state.users.map(user => {
                            let bound = this.props.set.bind(this, {email: user.key, name: user.value});
                            return <a class="dropdown-item" key={user.key} href="#" onClick={bound}>{user.value}</a>
                        })
                    :
                    "No users were found"
                }
                </div>
            </div>
        );
    }
}

export default User;