import React from 'react';
import axios from 'axios';
import crypto from 'crypto';
import Label from '../editor/Label';
import TouchButtonRight from '../editor/TouchButtonRight';
import DropdownMenu from '../menu/DropdownMenu';
import DropdownItem from '../menu/DropdownItem';
import Small from '../editor/Small';
import { connect } from 'react-redux';
import SelectionRemover from './SelectionRemover';
import RemoveItem from './RemoveItem';

class UserField extends React.Component{
    render(){
        return(
            <div class="form-group">
                <div class={"d-flex flex-row"}>  
                    <Label label="Owner"/>
                    <TouchButtonRight action={this.selfAssign}>Assign myself</TouchButtonRight>
                </div>
                <div class={"knbn-input-grp knbn-fake-input-grp input-group dropdown knbn-bg-transparent knbn-transition"  + 
                (this.props.themeToggled ? " knbn-dark-border-2x knbn-dark-onselect" : " knbn-snow-border-2x knbn-snow-onselect")}>
                {
                    <div class={"d-flex flex-row w-100"}>
                    {this.state.currentUser.email != undefined && this.state.currentUser.email.length > 0 ?
                        <SelectionRemover>
                            <RemoveItem item={this.state.currentUser.name + ' \u00b7 ' + this.state.currentUser.email} remove={this.removeUser}/>
                        </SelectionRemover>
                        :
                        <input type="text" class={"knbn-input form-control knbn-bg-transparent" + 
                        (this.props.themeToggled == true ? 
                            " knbn-dark-bg-2x knbn-dark-bg-2x-active knbn-dark-color-5x" 
                            : 
                            " knbn-snow-bg-2x knbn-snow-bg-2x-active knbn-snow-color-5x" )} id="knbnFieldLabel" aria-describedby="knbnHelp" 
                            placeholder={this.state.value == undefined || this.state.value.length == 0 ? "Enter user name" : ""}
                            value={this.state.value}
                            onChange={this.setFieldValue}
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                        />
                    }
                        <DropdownMenu classes="col-xl-12">
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
                }
                </div>
                <Small>{this.props.label}</Small>
            </div>
        );
    }

    constructor(props){
        super(props);

        this.state = {
            value: '',
            filteredUsers: [],
            users: [],
            currentUser: {}, 
        }

        this.setFieldValue = this.setFieldValue.bind(this);
        this.selfAssign = this.selfAssign.bind(this);
        this.setUser = this.setUser.bind(this);
        this.removeUser = this.removeUser.bind(this);
    }

    componentWillMount(){
        axios.get('/users/get-users').then(response =>{
            this.setState({
                users: response.data, 
                filteredUsers: response.data,
            });
        });
    }

    componentWillReceiveProps(nextProps, nextState){
        axios.get('/user/get-user-by-email/' + nextProps.user.email).then(response =>{
            this.setState({
                currentUser: response.data, value: response.data.name
            });
        });
    }

    setFieldValue(event){this.setState({value: event.target.value}, () => {this.setState({filteredUsers: this.state.users.filter(user => {return (user.name.includes(this.state.value)) || (user.email.includes(this.state.value));})})});}
    
    setUser(user){
        this.props.action(user);
    }

    removeUser(){
        this.setUser({});
    }

    selfAssign(event){
        event.preventDefault();
        axios.get('/current-user').then(response => {
            if(response.data.success == false){
                this.setState({currentUser: {}, value: '', filteredUsers: this.state.users})
            }
            else{
                if(response.data.email != this.state.currentUser.email){
                    this.setState({currentUser: response.data, value: response.data.name, filteredUsers: this.state.users}, () => {this.setUser(this.state.currentUser)});
                }
            }
        });
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(UserField);