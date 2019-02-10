import React from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
import Menu from '../Menu';
import Header3 from './Header3';
import crypto from 'crypto';
import EditField from './EditField';
import DismisableError from '../messages/DismisableError';
import { Link } from 'react-router-dom';
import Success from '../messages/Success';


class EditProfile extends React.Component{
    constructor(){
        super();

        this.state ={
            error: '',
            success: '',
            company: '',
            name: '',
        }

        this.saveName = this.saveName.bind(this);
        this.saveCompany = this.saveCompany.bind(this);
        this.offerAdmin = this.offerAdmin.bind(this);
    }

    componentDidMount(){
        Axios.get('/user/' + this.props.match.params.email)
        .then(response => {
            this.setState({
                name: response.data.name,
                company: response.data.company,
                canEdit: this.props.currentUser == this.props.match.params.email
            })
        })
        .catch(error => {
            this.setState({error: error.response.data.error})
        })
    }

    componentWillReceiveProps(nextProps, nextState){
        if(this.props.match.params.email != nextProps.match.params.email){
            Axios.get('/user/' + nextProps.match.params.email)
            .then(response => {
                this.setState({
                    name: response.data.name,
                    company: response.data.company,
                    canEdit: this.props.currentUser == nextProps.match.params.email
                })
            })
        }
    }

    saveName(value){
        if(value && value.length){
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
        if(value && value.length){
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
    }

    offerAdmin(){
        Axios.post('/user/set/admin/', {email: this.props.match.params.email})
        .then(response => {
            if(response.status == 200){
                this.setState({success: 'Utilizatorul a primit drepturi de administrator'})
            }
        })
        .catch(error => {
            this.setState({error: error.response.data.error});
        })
    }

    render(){
        return(
            <div class={"container-fluid knbn-bg-transparent knbn-transition knbn-container pb-3 h-100" + (this.props.themeToggled ? " knbn-dark-bg-1x" : " knbn-snow-bg-1x")}>
                <Menu/>

                <div class="knbn-mandatory-margin"></div>

                <DismisableError dismissError={()=>{this.setState({error: ''})}}>{this.state.error}</DismisableError>
                <Success>{this.state.success}</Success>

                <div class="row mb-2">
                    <div class="col-xl-12">
                        <div class="d-flex">
                            <img src={'https://www.gravatar.com/avatar/' + crypto.createHash('md5').update(String(this.props.match.params.email).toLowerCase().trim()).digest('hex')}
                                class="mx-auto my-auto knbn-profile-pic-xl knbn-border-radius-full"
                            />
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-xl-4 offset-xl-4">
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
                    <div class="col-xl-4 offset-xl-4">
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
                    <div class="col-xl-4 offset-xl-4">
                        <Link to='/forgot'>
                            <div class="knbn-font-small">Parolă uitată</div>
                        </Link>
                    </div>
                </div>

                {
                    this.props.isAdmin ? 
                    <div class="row">
                        <div class="col-xl-4 offset-xl-4">
                            
                            <div class={"knbn-font-small knbn-pointer" + (this.props.themeToggled ? " knbn-dark-color-2x" : " knbn-snow-color-2x")} onClick={this.offerAdmin}>
                            Ofera drepturi administrator
                            </div>
                            
                        </div>
                    </div>
                    :null
                }

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