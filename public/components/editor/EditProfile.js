import React from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
import Menu from '../Menu';
import Header3 from './Header3';
import crypto from 'crypto';
import EditField from './EditField';
import DismissableError from '../messages/DismissableError';
import { Link } from 'react-router-dom';
import Success from '../messages/Success';
import EditUser from './EditUser';
import DismissableSuccess from '../messages/DismissableSuccess';

class EditProfile extends React.Component{
    constructor(){
        super();

        this.state ={
            error: '',
            successEliminated: '',
            successEnabled: '',
            company: '',
            role: '',
            name: '',
            userToOffer: {}
        }

        this.saveName = this.saveName.bind(this);
        this.saveCompany = this.saveCompany.bind(this);
        this.saveRole = this.saveRole.bind(this);
        this.saveUserRight = this.saveUserRight.bind(this);
        this.disableUserRight  = this.disableUserRight.bind(this);
    }

    componentDidMount(){
        Axios.get('/user/' + this.props.match.params.email)
        .then(response => {
            this.setState({
                name: response.data.name,
                company: response.data.company,
                role: response.data.role,
                canEdit: this.props.currentUser == this.props.match.params.email
            })
        })
        .catch(error => {
            this.setState({error: error.response.data.error})
        });
    }

    componentWillReceiveProps(nextProps, nextState){
        if(this.props.match.params.email != nextProps.match.params.email){
            Axios.get('/user/' + nextProps.match.params.email)
            .then(response => {
                this.setState({
                    name: response.data.name,
                    company: response.data.company,
                    role: response.data.role,
                    canEdit: this.props.currentUser == nextProps.match.params.email
                })
            })
        }
    }

    saveName(value){
        if(value.length){
            Axios.post('/user/set/name', {email: this.props.match.params.email, value: value})
            .then(response => {
                if(response.status == 200){
                    this.setState({name: value})
                }
            })
            .catch(error => {
                this.setState({error: error.response.data.error});
            })
        }
    }

    saveCompany(value){
        Axios.post('/user/set/company', {email: this.props.match.params.email, value: value})
        .then(response => {
            if(response.status == 200){
                this.setState({company: value})
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error});
        })
    }

    saveRole(value){
        Axios.post('/user/set/role', {email: this.props.match.params.email, value: value})
        .then(response => {
            if(response.status == 200){
                this.setState({role: value})
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error});
        })
    }

    saveUserRight(user){
        let tempUser = user;
        tempUser.isAdmin = true;

        if(user.email){
            Axios.post('/user/set/admin', tempUser)
            .then(response => {
                if(response.status == 200){
                    this.setState({success: "Drepturi oferite pentru " + (user.name ? user.name : user.email)});
                }
            })
            .catch(error => {
                this.setState({error: error.response.data.error});
            })
        }
    }

    disableUserRight(user){
        let tempUser = user;
        tempUser.isAdmin = false;

        if(user.email){
            Axios.post('/user/set/admin', tempUser)
            .then(response => {
                if(response.status == 200){
                    this.setState({success: "Drepturi eliminate pentru " + (user.name ? user.name : user.email)})
                }
            })
            .catch(error => {
                this.setState({error: error.response.data.error});
            })
        }
    }


    render(){
        return(
            <div class={"container-fluid knbn-bg-transparent knbn-transition knbn-container pb-3 h-100" + (this.props.themeToggled ? " knbn-dark-bg-1x" : " knbn-snow-bg-1x")}>
                <Menu/>

                <div class="knbn-mandatory-margin"></div>

                <DismissableError dismiss={()=>{this.setState({error: ''})}}>{this.state.error}</DismissableError>

                <div class="row">
                    <div class="col-xl-12">
                        <div class="d-flex">
                            <img src={'https://www.gravatar.com/avatar/' + crypto.createHash('md5').update(String(this.props.match.params.email).toLowerCase().trim()).digest('hex')}
                                class="mx-auto my-auto knbn-profile-pic-xl knbn-border-radius-full"
                            />
                        </div>
                    </div>

                    <div class={"col-xl-6" + (!this.props.isAdmin ? " offset-xl-3" : "")}>
                        <div class="row">
                            <div class="col-xl-8 offset-xl-2">
                                <div class="row">
                                    <div class="col-xl-12">
                                        <EditField
                                            value={this.state.name}
                                            label='Nume' 
                                            save={this.saveName}
                                            description='Numele utilizatorului'
                                            canEdit={this.state.canEdit}
                                        />
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-xl-12">
                                        <EditField
                                            
                                            value={this.state.company}
                                            label='Companie' 
                                            save={this.saveCompany}
                                            description='Compania la care lucrezi'
                                            canEdit={this.state.canEdit}
                                        />
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-xl-12">
                                        <EditField
                                            value={this.state.role}
                                            label='Rol' 
                                            save={this.saveRole}
                                            description='Rolul în cadrul proiectului'
                                            canEdit={this.state.canEdit}
                                        />
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-xl-12 knbn-font-small">
                                        <Link to='/forgot'>
                                            Parolă uitată
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        this.props.isAdmin ? 
                        <div class={"col-xl-6" + (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-3x")}>
                            <div class="row">
                                <div class="col-xl-12 text-center">
                                    <Header3>
                                        Panou administrator
                                    </Header3>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-xl-6 offset-xl-3">
                                    <EditUser
                                        selfAlloc={false}
                                        label='Oferă drepturi administrator'
                                        user={this.state.userToOffer}
                                        save={this.saveUserRight}
                                        description=""
                                        canEdit={this.props.isAdmin}
                                    />
                                </div>

                                <div class="col-xl-6 offset-xl-3">
                                    <EditUser
                                        selfAlloc={false}
                                        label='Elimină drepturi administrator'
                                        user={this.state.userToOffer}
                                        save={this.disableUserRight}
                                        description=""
                                        canEdit={this.props.isAdmin}
                                    />
                                </div>
                                <div class="col-xl-6 offset-xl-3">
                                    <DismissableSuccess dismiss={() => {this.setState({success: ''})}}>{this.state.success}</DismissableSuccess>
                                </div>
                            </div>

                            <div class="row">
                            </div>
                           
                        </div>
                        :null
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        themeToggled: state.themeToggled,
        currentUser: state.currentUser,
        isAdmin: state.isAdmin
    }
}

export default connect(mapStateToProps)(EditProfile);