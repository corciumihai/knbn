import React from 'react';
import axios from 'axios';

class Participant extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            users: this.props.users,
            userName: "",
            userEmail: "",
        }

        this.changeName = this.changeName.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    changeName(element){
        this.setState({ userName: element.name, userEmail: element.email }, () => {
            this.props.callback(element);
            // TODO: optionally filter the users after this userName
        });
    }

    onChange(event){
        this.setState({ userName: event.target.value }, () => {
            this.setState({ users : this.props.users.filter((element) => {
                return element.name.toLowerCase().includes(this.state.userName.toLowerCase()) || 
                    element.email.toLowerCase().includes(this.state.userName.toLocaleLowerCase());
            }) });
        });
    }

    render(){
        return(
            <div class="participant col-xl-6 col-12">
                <div class="container">
                    <div class="row">
                        <div class="col participant-role">{this.props.role}</div>
                    </div>
                    <div class="row participant-wrapper">
                        <div class="col no-pad">
                            <input class="form-control participant-name" placeholder="Choose user" onChange={this.onChange} value={this.state.userName}/>
                        </div>
                        <div class="participant-dropdown-button d-flex" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <img class="mx-auto d-block align-self-center" src="./images/small-arrow-down.svg" />
                        </div>

                        <div class={"dropdown-menu dropdown-menu-right"}>
                        {   this.state.users.length ? 
                                this.state.users.map((element) => {
                                    //use this for other maps as well
                                    let boundClick = this.changeName.bind(this, element);
                                    return  <button key={ element.email } className="dropdown-item" type="text" onClick={ boundClick }>
                                                <div class="row">
                                                    <div class="col-12">{ element.name }</div>
                                                    <div class="dropdown-email col-12">{ element.email }</div>
                                                </div>
                                            </button>                                   
                                })
                                :
                                <div class="col dropdown-item disabled">No users found</div>
                        }
                        </div>      
                    </div>
                </div>
            </div>
        );
    }
}

export default Participant;