import React from 'react';
import axios from 'axios';
import crypto from 'crypto';
import EditButton from './EditButton';
import Label from './Label';
import DropdownItem from '../menu/DropdownItem';
import DropdownMenu from '../menu/DropdownMenu';
import TouchButtonRight from './TouchButtonRight';
import Small from './Small';
import { connect } from 'react-redux';

class EditUser extends React.Component{
    render(){
        var md5 = crypto.createHash('md5');
        var ownerHash = md5.update(String(this.state.currentUser.email).toLowerCase().trim()).digest('hex');

        return(
            <div class="form-group">
                <div class={"d-flex flex-row"}>  
                    <Label label="Owner"/>
                    <TouchButtonRight action={this.selfAssign}>Self assign</TouchButtonRight>
                </div>
                <div class={"knbn-input-grp knbn-fake-input-grp input-group dropdown knbn-bg-transparent knbn-transition"  + 
                (this.props.themeToggled ? " knbn-dark-border-2x knbn-dark-onselect" : " knbn-snow-border-2x knbn-snow-onselect")}>
                {
                    this.state.inEditMode ? 
                    <div class={"d-flex flex-row w-100"}>
                        <input type="text" class={"knbn-input form-control knbn-bg-transparent" + 
                        (this.props.themeToggled == true ? 
                            " knbn-dark-bg-2x knbn-dark-bg-2x-active knbn-dark-color-5x" 
                            : 
                            " knbn-snow-bg-2x knbn-snow-bg-2x-active knbn-snow-color-5x" )} id="knbnFieldLabel" aria-describedby="knbnHelp" 
                            placeholder={this.state.value == undefined || this.state.value.length == 0 ? "Enter user name" : ""}
                            value={this.state.value}
                            onChange={this.setFieldValue}
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"/>

                        <EditButton save={this.save} enableEditMode={this.enterEditMode} edit={this.state.inEditMode}/>
                        <DropdownMenu>
                        {
                            this.state.filteredUsers == undefined || this.state.filteredUsers.length == 0 ? 
                            <div class="col text-truncate">No users found</div>
                            :
                            (
                                this.state.filteredUsers.map(user => 
                                {
                                    var md5ForUser = crypto.createHash('md5');
                                    var hashForUser = md5ForUser.update(String(user.email).toLowerCase().trim()).digest('hex');
                                    
                                    return  <a href="#" key={user.email} onClick={(event)=>{event.preventDefault(); this.setUser(user)}}>
                                                <DropdownItem>
                                                    <div class="d-flex flex-row">
                                                        <div class="input-group-text mx-1 d-flex my-auto">
                                                            <img class="knbn-profile-pic-large" src={'https://www.gravatar.com/avatar/' + hashForUser}/>
                                                        </div>
                                                        <div class="d-flex w-100"><div class="w-100 my-auto text-truncate">{user.name + " \u00B7 " + user.email}</div></div>
                                                    </div>
                                                </DropdownItem>
                                            </a>
                                })
                            )
                        }
                        </DropdownMenu>
                    </div>
                    :
                    <div class="d-flex flex-row w-100">
                        <div class="knbn-input-grp-prepend input-group-prepend d-flex">
                            <div class="input-group-text mx-1 d-flex my-auto">
                                <img class="knbn-profile-pic" src={'https://www.gravatar.com/avatar/' + ownerHash}/>
                            </div>
                        </div>
                        <div class={"knbn-fake-input form-control text-truncate" + (this.props.themeToggled == true ? " knbn-dark-color-5x" : " knbn-snow-color-5x")}>
                        {
                            this.state.currentUser.name == undefined || this.state.currentUser.name.length == 0 ? "No owner configured" : this.state.currentUser.name + " \u00B7 " + this.state.currentUser.email
                        }
                        </div>

                        <EditButton  save={this.save} enableEditMode={this.enterEditMode} edit={this.state.inEditMode}/>
                    </div>
                }
                </div>
                <Small >The current owner of the component</Small>
            </div>
        );
    }

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

    componentWillMount(){
        axios.get('/users/get-users').then(response =>{
            this.setState({users: response.data, filteredUsers: response.data});
        });
    }

    componentWillReceiveProps(nextProps, nextState){
        if(nextProps.user != undefined && nextProps.user != this.state.currentUser){
            axios.get('/user/get-user-by-email/' + nextProps.user).then(response => {
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
        this.setState({currentUser: this.props.currentUser}, () => {this.save(this.state.currentUser)});
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
        currentUser: state.currentUser
    }
}

export default connect(mapStateToProps)(EditUser);