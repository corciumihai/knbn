import React from 'react';
import axios from 'axios';
import Comment from './Comment';
import update from 'react-addons-update';
import Worklog from './WorkLog';

class WorklogArea extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            input: '',
            worklogs: [],
            hours: '',
            error: '',
        }

        this.setWorklog = this.setWorklog.bind(this);
        this.insertWorklog = this.insertWorklog.bind(this);
        this.removeWorklog = this.removeWorklog.bind(this);
        this.saveWorklog = this.saveWorklog.bind(this);
        this.setHours = this.setHours.bind(this);
    }

    componentWillMount(){
        //get comments for this ticket
        axios.get('/get/worklogs/' + this.props.ticketId).then(response => {
            if(response.data.length > 0)
                this.setState({worklogs: response.data});
        })
    }

    setWorklog(event){
        this.setState({input: event.target.value, error: ''});
    }

    insertWorklog(){
        if((this.state.input.length == 0) || (this.state.hours.length == 0)){this.setState({error: 'Hours or text field empty'}); return;};
        if(isNaN(parseInt(this.state.hours))){this.setState({error: 'Hours are not a number'}); return;}
        if(parseInt(this.props.estimated) - (parseInt(this.state.hours) + parseInt(this.props.logged)) < 0){this.setState({error: 'Logged hours more than estimated. Please re-estimate'}); return;}
        let date = new Date().getTime();
        let worklog = {val: this.state.input, author: 1, ticketId: this.props.ticketId, created: date, lastModified: date, hours: this.state.hours}
        axios.post('/add/worklog', worklog).then(response => { 
            if(response.status == 200){
                this.setState({worklogs: update(this.state.worklogs, {$push: [worklog]}), input: ''}, () => {
                    // log hours in ticket
                    this.props.log(parseInt(this.state.hours));
                    this.setState({hours: ''});
                });
            }
         });
    }

    removeWorklog(work){
        axios.post('/remove/worklog', work).then(response => {
            if(response.status == 200){
                this.setState({worklogs: update(this.state.worklogs, {$splice: [[(this.state.worklogs.findIndex(worklog => {return worklog.created == work.created})), 1]]})}, () => {
                    this.props.unlog(parseInt(work.hours));
                });
            }
        });
        
    }

    saveWorklog(work){
        let date = new Date();
        work.lastModified = date;
        axios.post('/update/worklog', work).then(response => {
            if(response.status == 200){
                this.setState({worklogs: update(this.state.worklogs, {$splice: [[(this.state.worklogs.findIndex(worklog => {return worklog.created == work.created})), 1]]})}, () => {
                    this.setState({worklogs: update(this.state.worklogs, {$push: [work]}).sort((a, b) => {return a.created - b.created})}, () => {
                        this.props.log(work.hours - work.lastLog);
                });
            });}
        });        
    }

    setHours(event){
        this.setState({hours: event.target.value, error: ''});
    }

    render(){        
        return(
            <div class="container-fluid">
                <div class="col-xl-12 worklogs tag px-3 py-3">
                    {
                        this.props.disabled ? 
                        <div class="row">
                            <div class="col-xl-6 col-12 worklog">
                                Submitting worklogs is disabled when ticket is closed
                            </div>
                        </div> 
                        :
                        <div class="row">
                            <div class="col-xl-6 col-12">
                                <div class="row">
                                    <div class="col-xl-12"><input type="text" class="form-control worklog-text b-b-0" onChange={this.setHours} value={this.state.hours} placeholder="Hours"/></div>
                                    <div class="col-xl-12"><textarea type="text" class="form-control worklog-text b-t-0" onChange={this.setWorklog} value={this.state.input} placeholder="Worklog"/></div>
                                </div>
                            </div>
                        </div>
                    }
                    {
                        this.props.disabled ? null :
                        <div class="row ">
                            <div class="col-xl-8 col-12 mt-2">
                                <button type="button" class="submit btn btn-primary" onClick={this.insertWorklog}>Submit worklog</button>
                            </div>
                            {
                                this.state.error.length > 0 ?   <div class="col-xl-8 col-12 mt-2">
                                                                    <span class="error">{this.state.error}</span>
                                                                </div>
                                                                :
                                                                null
                            }
                        </div>
                    }
                    <div class="row">
                        <div class="container-fluid">
                        {
                            this.state.worklogs.length > 0 ? 
                                <div class="col mt-3 worklog-container">
                               { 
                                   this.state.worklogs.map(worklog => {
                                        return <Worklog key={worklog.created} data={worklog} remove={this.removeWorklog} save={this.saveWorklog} disabled={this.props.disabled}/>
                                    })
                                }
                                </div>
                            : null
                        }
                        </div>
                    </div>
                </div>
            </div>
            
        );
    }
}

export default WorklogArea;