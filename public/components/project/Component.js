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
            wip: this.props.data.wip,
            showDesc: false,
        }

        this.toggle = this.toggle.bind(this);
        this.toggleDesc = this.toggleDesc.bind(this);
        this.pushBacklog = this.pushBacklog.bind(this);
        this.pushProgress = this.pushProgress.bind(this);
        this.pushClosed = this.pushClosed.bind(this);
        this.pushDone = this.pushDone.bind(this);
        this.removeBacklog = this.removeBacklog.bind(this);
        this.removeProgress = this.removeProgress.bind(this);
        this.removeDone = this.removeDone.bind(this);
        this.shiftBackward = this.shiftBackward.bind(this);
        this.shiftForward = this.shiftForward.bind(this);
    }

    componentDidMount(){
        axios.get('/component/get-tickets/' + this.props.data.id).then(response => {
            let tickets = response.data;
            this.setState({
                ticketsBacklog: this.sortTickets(tickets.filter(item => (item.component == this.props.data.id && item.lane == 'backlog' && item.project == this.props.data.project))),
                ticketsProgress: this.sortTickets(tickets.filter(item => (item.component == this.props.data.id && item.lane == 'in_progress' && item.project == this.props.data.project))),
                ticketsDone: this.sortTickets(tickets.filter(item => (item.component == this.props.data.id && item.lane == 'done' && item.project == this.props.data.project))),
                ticketsClosed: this.sortTickets(tickets.filter(item => (item.component == this.props.data.id && item.lane == 'closed' && item.project == this.props.data.project))),
            });
        });
    }

    toggle(){this.setState({flip: !this.state.flip});}

    toggleDesc(){this.setState({showDesc: !this.state.showDesc});}

    pushBacklog(ticket){
        this.setState({ticketsBacklog: update(this.state.ticketsBacklog, {$push: [ticket]}) });
        axios.post('/update-lane', {lane: 'backlog', id: ticket.id});
    }

    pushProgress(ticket){
        this.setState({ticketsProgress: update(this.state.ticketsProgress, {$push: [ticket]}) });
        axios.post('/update-lane', {lane: 'in_progress', id: ticket.id});
    }

    pushDone(ticket){
        this.setState({ticketsDone: update(this.state.ticketsDone, {$push: [ticket]}) });
        axios.post('/update-lane', {lane: 'done', id: ticket.id});
    }

    pushClosed(ticket){
        this.setState({ticketsClosed: update(this.state.ticketsClosed, {$push: [ticket]}) });
        axios.post('/update-lane', {lane: 'closed', id: ticket.id});
    }

    removeBacklog(ticket){
        this.setState({ticketsBacklog: update(this.state.ticketsBacklog, {$splice: [[this.state.ticketsBacklog.indexOf(this.state.ticketsBacklog.find(item => {return item.id == ticket.id})), 1]] }) });
    }

    removeProgress(ticket){
        this.setState({ticketsProgress: update(this.state.ticketsProgress, {$splice: [[this.state.ticketsProgress.indexOf(this.state.ticketsProgress.find(item => {return item.id == ticket.id})), 1]] }) });
    }

    removeDone(ticket){
        this.setState({ticketsDone: update(this.state.ticketsDone, {$splice: [[this.state.ticketsDone.indexOf(this.state.ticketsDone.find(item => {return item.id == ticket.id})), 1]] }) });
    }

    shiftForward(ticket){
        switch(ticket.lane){
            case "backlog":{
                let data = ticket;
                data.lane = 'in_progress';
                this.pushProgress(data);
                this.removeBacklog(ticket);
                break;
            }

            case "in_progress":{
                let data = ticket;
                data.lane = 'done';
                this.pushDone(ticket);
                this.removeProgress(ticket);
                break;
            }

            case "done":{
                let data = ticket;
                data.lane = 'closed';
                this.pushClosed(ticket);
                this.removeDone(ticket);
                break;
            }

            default: {break;}
        }
    }

    shiftBackward(ticket, lane){
        switch(ticket.lane){
            case "in_progress":{
                let data = ticket;
                data.lane = 'backlog';
                this.pushBacklog(ticket);
                this.removeProgress(ticket);
                break;
            }

            case "done":{
                let data = ticket;
                data.lane = 'in_progress';
                this.pushProgress(ticket);
                this.removeDone(ticket);
                break;
            }

            default: {break;}
        }
    }

    sortTickets(tickets){return tickets.sort((first, second) => { return first.id - second.id; });}

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

                {this.state.ticketsBacklog.length > 0 || this.state.ticketsProgress.length > 0 || this.state.ticketsDone.length > 0 || this.state.ticketsClosed.length > 0 ?
                <div class="row">
                    <div class={!this.state.flip ? "section-body col" : "section-body col reduce"}>
                        <div class="row">
                            {/* BACKLOG */}
                            <LaneBacklog 
                                items={this.state.ticketsBacklog} 
                                compID={this.props.data.id} 
                                helpers={helpers}
                                push={this.pushBacklog}
                                remove={this.removeBacklog}
                            />

                            {/* IN PROGRESS */}
                            <LaneProgress 
                                items={this.state.ticketsProgress} 
                                compID={this.props.data.id} 
                                wip={this.state.wip}
                                helpers={helpers}
                                push={this.pushProgress}
                                remove={this.removeProgress}
                            />

                            {/* DONE */}
                            <LaneDone 
                                items={this.state.ticketsDone} 
                                compID={this.props.data.id}
                                helpers={helpers}
                                push={this.pushDone}
                                remove={this.removeDone}
                            />

                            {/* CLOSED */}
                            <LaneClosed 
                                items={this.state.ticketsClosed} 
                                compID={this.props.data.id}
                                helpers={helpers}
                                push={this.pushClosed}
                            />
                        </div>
                    </div>
                </div>
                : null}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(Component);