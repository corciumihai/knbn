import React from 'react';
import Axios from 'axios';
import crypto from 'crypto';

class EditUser extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            inEditMode: false,
            users: [],
            value: '',
            filteredUsers: [],
            currentUser: {}, 
            user: {}
        }

        this.enterEditMode = this.enterEditMode.bind(this);
        this.save = this.save.bind(this);
        this.setFieldValue = this.setFieldValue.bind(this);
        this.selfAssign = this.selfAssign.bind(this);
    }

    componentDidMount(){
        Axios.get('/users/get-users').then(response =>{
            this.setState({users: response.data, filteredUsers: response.data});
        });
    }

    componentWillReceiveProps(nextProps, nextState){
        if(nextProps.user != this.state.currentUser){
            Axios.get('/user/get-user-by-email/' + nextProps.user).then(response => {
                this.setState({currentUser: response.data});
            });
        }
    }

    enterEditMode(){this.setState({inEditMode: true, value: ''});}
    save(){this.setState({inEditMode: false}); this.props.save != undefined || this.props.save != null ? this.props.save(this.state.currentUser) : {};}
    setFieldValue(event){this.setState({value: event.target.value}, () => {this.setState({filteredUsers: this.state.users.filter(user => {return (user.name.includes(this.state.value)) || (user.email.includes(this.state.value));})})});}
    setUser(user){this.setState({currentUser: user, value: user.name})}

    selfAssign(event){
        event.preventDefault();
        Axios.get('/current-user').then(response => {
            if(response.data.email != this.state.currentUser.email){
                this.setState({currentUser: response.data}, () => {this.save(this.state.currentUser)});
            }
        });
    }

    render(){
        var md5 = crypto.createHash('md5');
        var ownerHash = md5.update(String(this.state.currentUser.email).toLowerCase().trim()).digest('hex');
        return(
            <div class="form-group">
                <div class="d-flex flex-row">  
                    <label for="knbnFieldLabel" class="knbn-edit-field">Owner</label>
                    <div class="w-100 text-right"><a href="" class="knbn-self-assign knbn-edit-field w-100 px-2 py-1" onClick={this.selfAssign}>Self assign</a></div>
                </div>
                <div class="knbn-input-grp knbn-fake-input-grp input-group dropdown">
                {
                    this.state.inEditMode ? 
                    <input type="text" class="knbn-input form-control" id="knbnFieldLabel" aria-describedby="knbnHelp" 
                    placeholder={this.state.value == undefined || this.state.value.length == 0 ? "Enter user name" : ""}
                    value={this.state.value}
                    onChange={this.setFieldValue}
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"/>
                    :
                    <div class="d-flex flex-row w-100">
                        <div class="knbn-input-grp-prepend input-group-prepend d-flex">
                            <div class="input-group-text mx-1 d-flex my-auto">
                                <img class="knbn-profile-pic" src={'https://www.gravatar.com/avatar/' + ownerHash}/>
                            </div>
                        </div>
                        <div class="knbn-fake-input form-control text-truncate">
                        {
                            this.state.currentUser.name == undefined || this.state.currentUser.name.length == 0 ? "No owner configured" : this.state.currentUser.name
                        }
                        </div>
                    </div>
                }
                    <div class="knbn-input-grp-append input-group-append d-flex">
                        <div class="input-group-text mx-1 d-flex my-auto">
                        {
                            this.state.inEditMode ? 
                            <img class="knbn-edit-btn mx-auto" src="./images/save.svg" onClick={this.save}></img>
                            :
                            <img class="knbn-edit-btn mx-auto" src="./images/edit.svg" onClick={this.enterEditMode}></img>
                        }
                            
                        </div>
                    </div>
                    <div id="knbnDropdownMenu" class="knbn-dropdown-menu dropdown-menu w-100">
                        {
                            this.state.filteredUsers == undefined || this.state.filteredUsers.length == 0 ? 
                            <div class="col text-truncate">No users found</div>
                            :
                            this.state.filteredUsers.map(user => 
                                {
                                    var md5ForUser = crypto.createHash('md5');
                                    var hashForUser = md5ForUser.update(String(user.email).toLowerCase().trim()).digest('hex');
                                    return <a class="knbn-dropdown-item dropdown-item text-truncate d-flex flex-row" href="#" key={user.email} onClick={(event)=>{event.preventDefault(); this.setUser(user)}}>
                                        <div class="input-group-text mx-1 d-flex my-auto">
                                            <img class="knbn-profile-pic-large" src={'https://www.gravatar.com/avatar/' + hashForUser}/>
                                        </div>
                                        <div class="d-flex w-100"><div class="w-100 my-auto text-truncate">{user.name + " \u00B7 " + user.email}</div></div>
                                    </a>
                                })
                        }
                    </div>
                </div>
                <small id="knbnHelp" class="knbn-edit-help form-text text-muted">The current owner of the component</small>
            </div>
        );
    }
}

export default EditUser;