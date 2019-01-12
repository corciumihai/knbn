import React from 'react';
import { connect } from 'react-redux';
import crypto from 'crypto';
import Axios from 'axios';
import dateformat from 'dateformat';
import { Link } from 'react-router-dom';

class ViewComponent extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            owner: {}
        }
    }

    componentWillMount(){
        Axios.get('/user/get-user-by-email/' + this.props.data.owner)
        .then(response => {
            this.setState({owner: response.data})
        })
    }

    render(){
        return (
            <Link to={"edit-component/" + this.props.data.id}>
            <div class={"knbn-view-comp col-xl-12 mb-1 py-2 knbn-border knbn-transition" + (this.props.themeToggled ? " knbn-dark-color-3x knbn-dark-bg-3x knbn-dark-onselect knbn-dark-border-2x" : "")}>

                <div class="d-flex flex-row">

                    <div class="col-xl-2 px-0 d-flex flex-row">
                        <div class="h-100 d-flex mr-1">
                            <img src="./images/comp.svg" class="mx-auto my-auto" />
                        </div>
                        <div class="mr-2">Name</div>
                        <div class={"knbn-font-medium text-truncate" + (this.props.themeToggled ? " knbn-dark-color-5x" : "")}>{this.props.data.name}</div>
                    </div>
                    
                    <div class="col-xl-2 px-0 d-flex flex-row">
                        <div class="mr-2">Owner</div>
                        {
                            this.state.owner.name != undefined && this.state.owner.name.length > 0 ?
                            (
                            <div class="h-100 d-flex mr-2">
                                <img src={'https://www.gravatar.com/avatar/' + crypto.createHash('md5').update(String(this.state.owner.email).toLowerCase().trim()).digest('hex')} class="mx-auto my-auto knbn-profile-pic" />
                            </div>
                            )
                            :
                            null
                        }
                        
                        <div class={"knbn-font-medium" + (this.props.themeToggled ? " knbn-dark-color-5x" : "")}>
                            {this.state.owner.name != undefined && this.state.owner.name.length > 0 ? this.state.owner.name : "No owner assigned"}
                        </div>
                    </div>

                    <div class="col-xl-2 px-0 d-flex flex-row">
                        <div class="mr-2">Created on</div>
                       
                            <div class={"h-100 d-flex mr-2" + (this.props.themeToggled ? " knbn-dark-color-5x" : "")}>
                            {  
                                this.props.data.startDate != undefined && this.props.data.startDate.length > 0 ?
                                    dateformat(new Date(parseInt(this.props.data.startDate)), "dd \u00B7 mmmm \u00B7 yyyy")
                                    :
                                    "No creation date"
                            }
                            </div>
                        
                    </div>

                    <div class="col-xl-2 px-0 d-flex flex-row">
                        <div class="mr-2">Due date on</div>
                       
                            <div class={"h-100 d-flex mr-2" + (this.props.themeToggled ? " knbn-dark-color-5x" : "")}>
                            {  
                                this.props.data.dueDate != undefined && this.props.data.dueDate.length > 0 ?
                                    dateformat(new Date(parseInt(this.props.data.dueDate)), "dd \u00B7 mmmm \u00B7 yyyy")
                                    :
                                    "No due date"
                            }
                            </div>
                        
                    </div>

                    <div class="col-xl-2 px-0 d-flex flex-row">
                        <div class="mr-2">Priority</div>
                       
                            <div class={"h-100 d-flex mr-2" + (this.props.themeToggled ? " knbn-dark-color-5x" : "")}>
                            {  
                                this.props.data.priority != undefined && this.props.data.priority.length > 0 ?
                                    this.props.priorities.find(item => item.dbName == this.props.data.priority).name
                                    :
                                    "No priority configured"
                            }
                            </div>
                        
                    </div>

                </div>
                
            </div>
            </Link>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
        priorities: state.priorities
    }
}

export default connect(mapStateToProps)(ViewComponent);