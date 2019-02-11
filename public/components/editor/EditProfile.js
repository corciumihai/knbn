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
        this.refresh = this.refresh.bind(this);
    }

    componentDidMount(){
        Axios.get('/user/' + this.props.match.params.email)
        .then(response => {
            this.setState({
                name: response.data.name,
                company: response.data.company,
                role: response.data.role,
                isAdmin: response.data.isAdmin,
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
                    isAdmin: response.data.isAdmin,
                    canEdit: this.props.currentUser == nextProps.match.params.email
                })
            })
        }
    }

    refresh(){
        Axios.get('/user/' + this.props.match.params.email)
        .then(response => {
            this.setState({
                isAdmin: response.data.isAdmin,
            })
        })
        .catch(error => {
            this.setState({error: error.response.data.error})
        });
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

    saveUserRight(){        
        if(this.props.match.params.email){
            Axios.post('/user/set/admin', {email: this.props.match.params.email, isAdmin: 1})
            .then(response => {
                if(response.status == 200){
                    this.refresh();
                }
            })
            .catch(error => {
                this.setState({error: error.response.data.error});
            })
        }
    }

    disableUserRight(){
        if(this.props.match.params.email){
            Axios.post('/user/set/admin', {email: this.props.match.params.email, isAdmin: 0})
            .then(response => {
                if(response.status == 200){
                    if(this.props.currentUser == this.props.match.params.email){
                        this.props.setNoAdmin();
                    }
                    this.refresh();
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

                    <div class={"col-xl-4 offset-xl-4 mt-3"}>
                        <div class="row">
                            <div class="col-xl-12">
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
                        this.props.isAdmin && (this.props.currentUser != this.props.match.params.email) ? 
                        <div class={"col-xl-4 offset-xl-4 mt-3" + (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-3x")}>
                            <div class="row">
                                <div class="col-xl-8 offset-xl-2 d-flex">
                                {
                                    this.state.isAdmin ? 
                                    <button type="button" class="btn btn-danger knbn-font-small mx-auto knbn-no-box-shadow knbn-border-radius-50" onClick={this.disableUserRight}>Elimină dreptul de administrator</button>
                                    :
                                    <button type="button" class="btn btn-success knbn-font-small mx-auto knbn-no-box-shadow knbn-border-radius-50" onClick={this.saveUserRight}>Oferă dreptul de administrator</button>
                                }
                                </div>
                            </div>
                        </div>
                        :
                        (this.props.isAdmin && (this.props.currentUser == this.props.match.params.email)?
                        <div class={"col-xl-4 offset-xl-4 mt-3" + (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-3x")}>
                            <div class="row">
                                <div class="col-xl-8 offset-xl-2 d-flex">
                                    <button type="button" class="btn btn-danger knbn-font-small mx-auto knbn-no-box-shadow knbn-border-radius-50" onClick={this.disableUserRight}>Elimină-mi dreptul de administrator</button>
                                </div>
                            </div>
                        </div>
                        :null)
                    }
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setNoAdmin: () => {
            dispatch({
                type: 'KNBN_SET_ADMIN_DISABLED',
                payload: 0
            });
        }       
    }
}

const mapStateToProps = (state) => {
    return{
        themeToggled: state.themeToggled,
        currentUser: state.currentUser,
        isAdmin: state.isAdmin
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);