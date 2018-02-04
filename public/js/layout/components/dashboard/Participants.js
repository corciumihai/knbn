import React from 'react';
import Participant from './Participant';
import axios from 'axios';

class Participants extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            databaseUsers: [],
            loading: true,
        }
    }

    componentDidMount(){
        axios.get('/users/get-users').then((response) => {
            this.setState({databaseUsers: response.data, loading: false});
        });
    }

    render(){
        return(
            <div class="form-group row">
                <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 modal-label">
                    <span class="align-middle">Participants</span>
                </div>
                <div class="col-xl-9 col-lg-9 col-md-9 col-sm-9 col-12 modal-label">
                    <div class="container participants-container">
                        { 
                            this.state.loading ? 
                                <div class="row">
                                    <div class="col">Loading users..</div>
                                </div>
                                :
                                <div class="row">
                                    <Participant role="Reporter" users={this.state.databaseUsers} callback={this.props.setReporter} />
                                    <Participant role="Assignee" users={this.state.databaseUsers} callback={this.props.setAssignee} />
                                    <div class="col"><a href="#">Assign to me</a></div>
                                </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Participants;