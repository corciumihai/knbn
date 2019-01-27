import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import LaneBacklog from './LaneBacklog';
import LaneProgress from './LaneProgress';
import LaneDone from './LaneDone';
import LaneClosed from './LaneClosed';
import update from 'react-addons-update';
import axios from 'axios';

class Component extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            flip: false,
            ticketsBacklog: [],
            ticketsProgress: [],
            ticketsDone: [],
            ticketsClosed: [],

            reportsBacklog: [],
            reportsProgress: [],
            reportsDone: [],
            reportsClosed: [],

            wip: this.props.data.wip,
            showDesc: false,

            showPRs: false
        }

        this.toggle = this.toggle.bind(this);
        this.toggleDesc = this.toggleDesc.bind(this);
        this.push = this.push.bind(this);
        this.removeBacklog = this.removeBacklog.bind(this);
        this.removeProgress = this.removeProgress.bind(this);
        this.removeDone = this.removeDone.bind(this);
        this.shiftBackward = this.shiftBackward.bind(this);
        this.shiftForward = this.shiftForward.bind(this);
        this.showPR = this.showPR.bind(this);
        this.refresh = this.refresh.bind(this);
    }

    componentDidMount(){
        this.refresh();
    }

    refresh(){
        axios.get('/component/get-tickets/' + this.props.data.id)
        .then(response => {
            if(response.status == 200){
                let tickets = response.data;

                this.setState({
                    ticketsBacklog: tickets.filter(item => (item.component == this.props.data.id && item.lane == 'backlog' && item.project == this.props.data.project)),
                    ticketsProgress: tickets.filter(item => (item.component == this.props.data.id && item.lane == 'in_progress' && item.project == this.props.data.project)),
                    ticketsDone: tickets.filter(item => (item.component == this.props.data.id && item.lane == 'done' && item.project == this.props.data.project)),
                    ticketsClosed: tickets.filter(item => (item.component == this.props.data.id && item.lane == 'closed' && item.project == this.props.data.project)),
                });
            }
        })
        .catch(error => {
            console.log(error.response.data.error);
        })

        axios.get('/component/get-reports/' + this.props.data.id)
        .then(response => {
            if(response.status == 200){
                let tickets = response.data;

                this.setState({
                    reportsBacklog: tickets.filter(item => (item.component == this.props.data.id && item.lane == 'backlog' && item.project == this.props.data.project)),
                    reportsProgress: tickets.filter(item => (item.component == this.props.data.id && item.lane == 'in_progress' && item.project == this.props.data.project)),
                    reportsDone: tickets.filter(item => (item.component == this.props.data.id && item.lane == 'done' && item.project == this.props.data.project)),
                    reportsClosed: tickets.filter(item => (item.component == this.props.data.id && item.lane == 'closed' && item.project == this.props.data.project)),
                });
            }
        })
        .catch(error => {
            console.log(error.response.data.error);
        })
    }

    showPR(){
        this.setState({showPRs: !this.state.showPRs});
    }

    toggle(){this.setState({flip: !this.state.flip});}

    toggleDesc(){this.setState({showDesc: !this.state.showDesc});}

    push(ticket){
        axios.post('/ticket/update-lane', {lane: ticket.lane, id: ticket.id, isReport: ticket.isReport})
        .then(response => {
            if(response.status == 200){
                this.refresh();
            }
        })
        .catch(error => {
            console.log(error.response.data.error);
        })
    }

    removeBacklog(ticket){
        ticket.isReport ? 
        this.setState({ticketsBacklog: update(this.state.ticketsBacklog, {$splice: [[this.state.ticketsBacklog.indexOf(this.state.ticketsBacklog.find(item => {return item.id == ticket.id})), 1]] }) })
        :
        this.setState({reportsBacklog: update(this.state.reportsBacklog, {$splice: [[this.state.reportsBacklog.indexOf(this.state.reportsBacklog.find(item => {return item.id == ticket.id})), 1]] }) })
    }

    removeProgress(ticket){
        ticket.isReport ?
        this.setState({ticketsProgress: update(this.state.ticketsProgress, {$splice: [[this.state.ticketsProgress.indexOf(this.state.ticketsProgress.find(item => {return item.id == ticket.id})), 1]] }) })
        :
        this.setState({reportsProgress: update(this.state.reportsProgress, {$splice: [[this.state.reportsProgress.indexOf(this.state.reportsProgress.find(item => {return item.id == ticket.id})), 1]] }) })
    }

    removeDone(ticket){
        ticket.isReport ?
        this.setState({ticketsDone: update(this.state.ticketsDone, {$splice: [[this.state.ticketsDone.indexOf(this.state.ticketsDone.find(item => {return item.id == ticket.id})), 1]] }) })
        :
        this.setState({reportsDone: update(this.state.reportsDone, {$splice: [[this.state.reportsDone.indexOf(this.state.reportsDone.find(item => {return item.id == ticket.id})), 1]] }) })
    }

    shiftForward(ticket){
        let data = ticket;

        switch(ticket.lane){
            case "backlog":{
                data.lane = 'in_progress';
                
                this.removeBacklog(ticket);
                break;
            }

            case "in_progress":{
                data.lane = 'done';

                this.removeProgress(ticket);
                break;
            }

            case "done":{
                data.lane = 'closed';

                this.removeDone(ticket);
                break;
            }

            default: {break;}
        }

        this.push(data);
    }

    shiftBackward(ticket, lane){
        let data = ticket;

        switch(ticket.lane){
            case "in_progress":{
                data.lane = 'backlog';

                this.removeProgress(ticket);
                break;
            }

            case "done":{                
                data.lane = 'in_progress';

                this.removeDone(ticket);
                break;
            }

            default: {break;}
        }

        this.push(data);
    }

    render(){
        let helpers = {forward: this.shiftForward, backward: this.shiftBackward}

        return(
            <div class={'knbn-section col-xl-12 mb-2 knbn-transition' + (this.props.themeToggled ? " knbn-dark-bg-2x knbn-dark-shadow-1x" : " knbn-snow-bg-2x knbn-snow-shadow-1x")}>
                <div class="row">
                    <div class="col-xl-12">
                        <div class="row">
                            <div    class={(this.props.data.priority == 'low' ? "prio-1" : this.props.data.priority == 'medium' ? "prio-2" : "prio-3") + " mr-2"} 
                                    title={this.props.data.priority == 'low' ? "Prioritate mică" : this.props.data.priority == 'medium' ? "Prioritate medie" : "Prioritate înaltă"}/>
                            
                            <div class={"section-head col py-2 knbn-transition"}>
                                <div class="row">
                                    <div class="d-flex flex-row">
                                        <div class={'toggle d-flex knbn-transition knbn-transition' + 
                                        (this.props.themeToggled ? 
                                            " knbn-dark-bg-3x knbn-dark-bg-3x-active knbn-dark-shadow-3x" 
                                            : 
                                            " knbn-snow-bg-3x knbn-snow-bg-3x-active knbn-snow-shadow-3x")} onClick={this.toggle} title='Ascunde componentă'>
                                            <img src={!this.state.flip ? "./images/expandLight.svg" : "./images/showLight.svg"} class={"d-block mx-auto" + (this.props.themeToggled ? " knbn-img-inverted" : '')}/>
                                        </div>

                                        <div class={'toggle d-flex knbn-transition knbn-transition' + 
                                        (this.props.themeToggled ? 
                                            " knbn-dark-bg-3x knbn-dark-bg-3x-active knbn-dark-shadow-3x" 
                                            : 
                                            " knbn-snow-bg-3x knbn-snow-bg-3x-active knbn-snow-shadow-3x")} onClick={this.toggleDesc} title='Arată descriere'>
                                            <img src={"./images/showDescLight.svg"} class={"d-block mx-auto" + (this.props.themeToggled ? " knbn-img-inverted" : '')}/>
                                        </div>

                                        <Link to={"/edit-component/" + this.props.data.id}>
                                            <div class={'toggle d-flex knbn-transition knbn-transition' + 
                                            (this.props.themeToggled ? 
                                                " knbn-dark-bg-3x knbn-dark-bg-3x-active knbn-dark-shadow-3x" 
                                                : 
                                                " knbn-snow-bg-3x knbn-snow-bg-3x-active knbn-snow-shadow-3x")} title='Editează componentă'>
                                                <img src={"./images/editLight.svg"} class={"d-block mx-auto" + (this.props.themeToggled ? " knbn-img-inverted" : '')}/>
                                            </div>
                                        </Link>

                                    </div>
                                    <div class="col">
                                        <div class="row">
                                            <div class="col-12">
                                                <div class="row">
                                                    <div class={"col text-truncate knbn-transition" + (this.props.themeToggled ? " knbn-dark-color-3x" : " knbn-snow-color-3x")}>{this.props.data.name}</div>
                                                </div>
                                            </div>
                                            <div class={"knbn-comp-desc comp-desc col-12" + (this.props.themeToggled ? " knbn-dark-color-2x" : " knbn-snow-color-2x") + (!this.state.showDesc ? " hide" : "")}>{ReactHtmlParser(this.props.data.description)}</div>
                                        </div> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>  
                </div>

                {
                    !this.props.filterPR ? 
                    this.state.ticketsBacklog.length > 0 || this.state.ticketsProgress.length > 0 || this.state.ticketsDone.length > 0 || this.state.ticketsClosed.length > 0 ?
                    <div class="row">
                        <div class={!this.state.flip ? "section-body col" : "section-body col reduce"}>
                            <div class="row">
                                {/* BACKLOG */}
                                <LaneBacklog 
                                    items={this.state.ticketsBacklog} 
                                    compID={this.props.data.id} 
                                    helpers={helpers}
                                    push={this.push}
                                    remove={this.removeBacklog}
                                />

                                {/* IN PROGRESS */}
                                <LaneProgress 
                                    items={this.state.ticketsProgress} 
                                    compID={this.props.data.id} 
                                    wip={this.state.wip}
                                    helpers={helpers}
                                    push={this.push}
                                    remove={this.removeProgress}
                                />

                                {/* DONE */}
                                <LaneDone 
                                    items={this.state.ticketsDone} 
                                    compID={this.props.data.id}
                                    helpers={helpers}
                                    push={this.push}
                                    remove={this.removeDone}
                                />

                                {/* CLOSED */}
                                <LaneClosed 
                                    items={this.state.ticketsClosed} 
                                    compID={this.props.data.id}
                                    helpers={helpers}
                                    push={this.push}
                                />
                            </div>
                        </div>
                    </div>
                    : null

                    :
                    
                    this.state.reportsBacklog.length > 0 || this.state.reportsProgress.length > 0 || this.state.reportsDone.length > 0 || this.state.reportsClosed.length > 0 ?
                    <div class="row">
                        <div class={!this.state.flip ? "section-body col" : "section-body col reduce"}>
                            <div class="row">
                                {/* BACKLOG */}
                                <LaneBacklog 
                                    items={this.state.reportsBacklog} 
                                    compID={this.props.data.id} 
                                    helpers={helpers}
                                    push={this.push}
                                    remove={this.removeBacklog}
                                />

                                {/* IN PROGRESS */}
                                <LaneProgress 
                                    items={this.state.reportsProgress} 
                                    compID={this.props.data.id} 
                                    wip={this.state.wip}
                                    helpers={helpers}
                                    push={this.push}
                                    remove={this.removeProgress}
                                />

                                {/* DONE */}
                                <LaneDone 
                                    items={this.state.reportsDone} 
                                    compID={this.props.data.id}
                                    helpers={helpers}
                                    push={this.push}
                                    remove={this.removeDone}
                                />

                                {/* CLOSED */}
                                <LaneClosed 
                                    items={this.state.reportsClosed} 
                                    compID={this.props.data.id}
                                    helpers={helpers}
                                    push={this.push}
                                />
                            </div>
                        </div>
                    </div>
                    :null
            }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
        filterPR: state.filterPR
    }
}

export default connect(mapStateToProps)(Component);