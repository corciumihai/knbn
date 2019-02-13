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
import crypto from 'crypto';

class Component extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            flip: false,
            tickets: [],
            reports: [],
            owner: {},
            category: {},
            release: {},
            wip: this.props.data.wip,
            showDesc: false,
        }

        this.toggle = this.toggle.bind(this);
        this.toggleDesc = this.toggleDesc.bind(this);
        this.pushTicket = this.pushTicket.bind(this);
        this.pushReport = this.pushReport.bind(this);
        this.shiftTicketForward = this.shiftTicketForward.bind(this);
        this.shiftTicketBackward = this.shiftTicketBackward.bind(this);
        this.shiftReportBackward = this.shiftReportBackward.bind(this);
        this.shiftReportForward = this.shiftReportForward.bind(this);
        this.filterItems = this.filterItems.bind(this);
        this.refresh = this.refresh.bind(this);
        this.remove = this.remove.bind(this);
    }

    componentDidMount(){
        if(this.props.data.id){
            axios.all([
                axios.get('/component/get/tickets/' + this.props.data.id),
                axios.get('/component/get/reports/' + this.props.data.id)
            ])
            .then(axios.spread((tickets, reports) => {
                this.setState({ 
                    tickets: tickets.data,
                    reports: reports.data
                }, () => {
                    this.filterItems();

                    if(this.props.data.owner){
                        axios.get('/user/' + this.props.data.owner)
                        .then(owner => {
                            if(owner.data){
                                this.setState({ owner: owner.data});
                            }
                        })
                        .catch(error => {
                            this.props.setError(error.response.data.error);
                        })
                    }

                    if(this.props.data.releaseID){
                        axios.get('/release/get/' + this.props.data.releaseID)
                        .then(release => {
                            if(release.data){
                                this.setState({ release: release.data});
                            }
                        })
                        .catch(error => {
                            this.props.setError(error.response.data.error);
                        })
                    }

                    if(this.props.data.category){
                        axios.get('/category/get/' + this.props.data.category)
                        .then(category => {
                            if(category.data){
                                
                                this.setState({category: category.data});
                            }
                        })
                        .catch(error => {
                            this.props.setError(error.response.data.error);
                        })
                    }

                    this.filterItems();
                })
            }))
            .catch(error => {
                this.props.setError(error.response.data.error);
            })
        }
    }

    toggle(){
        this.setState({flip: !this.state.flip});
    }

    toggleDesc(){
        this.setState({showDesc: !this.state.showDesc});
    }

    remove(){
        if(this.props.data.id){
            axios.post('/component/remove', {id: this.props.data.id})
            .then(response => {
                if(response.status == 200){
                    this.props.refresh();
                }
            })
            .catch(error => {
                this.props.setError(error.response.data.error)
            })
        }
    }

    pushTicket(ticket){
        if(ticket){
            axios.post('/ticket/update/lane', {lane: ticket.lane, id: ticket.id})
            .then(response => {
                if(response.status == 200){
                    this.setState({
                        tickets: update(this.state.tickets, {
                            $splice: [[this.state.tickets.indexOf(this.state.tickets.find(item => item.id == ticket.id)), 1]],
                            $push: [ticket],
                        })
                    })
                }
            })
            .catch(error => {
                this.props.setError(error.response.data.error);
            })
        }
    }

    pushReport(report){
        if(report){
            axios.post('/report/update/lane', {lane: report.lane, id: report.id})
            .then(response => {
                if(response.status == 200){
                    this.setState({
                        reports: update(this.state.reports, {
                            $splice: [[this.state.reports.indexOf(this.state.reports.find(item => item.id == report.id)), 1]],
                            $push: [report],
                        })
                    })
                }
            })
            .catch(error => {
                this.props.setError(error.response.data.error);
            })
        }
    }

    shiftTicketForward(ticket){
        let data;
        switch(ticket.lane){
            case 'backlog':
                data = Object.assign({}, ticket, {
                    lane: 'in_progress'
                });

                this.pushTicket(data);

                break;

            case 'in_progress':
                data = Object.assign({}, ticket, {
                    lane: 'done'
                });

                this.pushTicket(data);

                break;

            case 'done':
                data = Object.assign({}, ticket, {
                    lane: 'closed'
                });

                this.pushTicket(data);

                break;

            default:
                break;
        }
    }

    shiftReportForward(ticket){
        let data;
        switch(ticket.lane){
            case 'backlog':
                data = Object.assign({}, ticket, {
                    lane: 'in_progress'
                });

                this.pushReport(data);

                break;

            case 'in_progress':
                data = Object.assign({}, ticket, {
                    lane: 'done'
                });

                this.pushReport(data);

                break;

            case 'done':
                data = Object.assign({}, ticket, {
                    lane: 'closed'
                });

                this.pushReport(data);

                break;

            default:
                break;
        }
    }

    shiftTicketBackward(ticket){
        let data;
        switch(ticket.lane){
            case 'in_progress':
                data = Object.assign({}, ticket, {
                    lane: 'backlog'
                });

                this.pushTicket(data);

                break;

            case 'done':
            data = Object.assign({}, ticket, {
                    lane: 'in_progress'
                });

                this.pushTicket(data);

                break;

            default:
                break;
        }
    }

    shiftReportBackward(ticket){
        let data;
        switch(ticket.lane){
            case 'in_progress':
                data = Object.assign({}, ticket, {
                    lane: 'backlog'
                });

                this.pushReport(data);

                break;

            case 'done':
            data = Object.assign({}, ticket, {
                    lane: 'in_progress'
                });

                this.pushReport(data);

                break;

            default:
                break;
        }
    }

    filterItems(){
        if(this.props.userOnly && this.props.filterPR){
            this.state.tickets.forEach(item => {
                item.hide = !(item.assignee == this.props.currentUser || item.reporter == this.props.currentUser)
            });
            this.state.reports.forEach(item => {
                item.hide = !(item.assignee == this.props.currentUser || item.reporter == this.props.currentUser)
            });
        }

        else if(this.props.userOnly && this.props.filterTickets){
            this.state.tickets.forEach(item => {
                item.hide = !(item.assignee == this.props.currentUser || item.reporter == this.props.currentUser)
            });

            this.state.reports.forEach(item => {
                item.hide = !(item.assignee == this.props.currentUser || item.reporter == this.props.currentUser)
            });
        }

        else if(this.props.userOnly){
            this.state.tickets.forEach(item => {
                item.hide = !(item.assignee == this.props.currentUser || item.reporter == this.props.currentUser)
            });

            this.state.reports.forEach(item => {
                item.hide = !(item.assignee == this.props.currentUser || item.reporter == this.props.currentUser)
            });
        }

        else if(this.props.filterPR){
            this.state.tickets.forEach(item => {
                item.hide = true
            });

            this.state.reports.forEach(item => {
                item.hide = false;
            });
        }

        else if(this.props.filterTickets){
            this.state.tickets.forEach(item => {
                item.hide = false
            });

            this.state.reports.forEach(item => {
                item.hide = true;
            });
        }

        else{
            this.state.tickets.forEach(item =>{
                item.hide = false
            });

            this.state.reports.forEach(item =>{
                item.hide = false
            });
        }
        
    }

    refresh(){
        axios.all([
            axios.get('/component/get/tickets/' + this.props.data.id),
            axios.get('/component/get/reports/' + this.props.data.id)
        ])
        .then(axios.spread((tickets, reports) => {
            this.setState({ 
                tickets: tickets.data,
                reports: reports.data
            })
        }))
        .catch(error => {
            this.props.setError(error.response.data.error)
        })
    }

    componentWillReceiveProps(nextProps, nextState){
        this.filterItems();
    }

    render(){
        let helpers = {ticketForward: this.shiftTicketForward, ticketBackward: this.shiftTicketBackward, reportForward: this.shiftReportForward, reportBackward: this.shiftReportBackward}

        return(
            <div class={'knbn-section col-xl-12 mb-2 knbn-transition knbn-border-top knbn-border-bottom' + (this.props.themeToggled ? " knbn-dark-bg-2x knbn-dark-shadow-1x knbn-dark-border-2x" : " knbn-snow-bg-2x knbn-snow-shadow-1x knbn-snow-border-2x")}>
                <div class="row">
                    <div class="col-xl-12">
                        <div class="row">
                            <div    class={(!this.props.data.priority ? 'no-prio' : this.props.data.priority == 'low' ? "prio-1" : this.props.data.priority == 'medium' ? "prio-2" : "prio-3") + " mr-2"} 
                                    title={!this.props.data.priority ? 'Nicio prioritate' : this.props.data.priority == 'low' ? "Prioritate mică" : this.props.data.priority == 'medium' ? "Prioritate medie" : "Prioritate înaltă"}/>
                            
                            <div class={"section-head col py-2 knbn-transition" + (!this.state.flip ? " knbn-border-bottom" +  (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-2x") : " ")}>
                                <div class="row">
                                    <div class="d-flex flex-row mb-1">
                                        {
                                            this.state.tickets.length || this.state.reports.length ? 
                                            <div class={'toggle d-flex knbn-transition knbn-transition' + 
                                            (this.props.themeToggled ? 
                                                " knbn-dark-bg-3x knbn-dark-bg-3x-active knbn-dark-shadow-3x" 
                                                : 
                                                " knbn-snow-bg-4x knbn-snow-bg-3x-active knbn-snow-shadow-3x")} onClick={this.toggle} title='Ascunde modul'>
                                                <img src={!this.state.flip ? (this.props.themeToggled  ? "./images/reducer.svg" : "./images/bReducer.svg") : (this.props.themeToggled  ? "./images/expand.svg" : "./images/bExpand.svg")} class={"d-block mx-auto"}/>
                                            </div>
                                            :null
                                        }
                                        {
                                            this.props.data.description.length ? 
                                            <div class={'toggle d-flex knbn-transition knbn-transition' + 
                                            (this.props.themeToggled ? 
                                                " knbn-dark-bg-3x knbn-dark-bg-3x-active knbn-dark-shadow-3x" 
                                                : 
                                                " knbn-snow-bg-4x knbn-snow-bg-3x-active knbn-snow-shadow-3x")} onClick={this.toggleDesc} title='Arată descriere'>
                                                <img src={this.props.themeToggled ? "./images/description.svg" : "./images/bDescription.svg"} class={"d-block mx-auto"}/>
                                            </div>
                                            :null
                                        }

                                        <Link to={"/edit/component/" + this.props.data.id}>
                                            <div class={'toggle d-flex knbn-transition knbn-transition' + 
                                            (this.props.themeToggled ? 
                                                " knbn-dark-bg-3x knbn-dark-bg-3x-active knbn-dark-shadow-3x" 
                                                : 
                                                " knbn-snow-bg-4x knbn-snow-bg-3x-active knbn-snow-shadow-3x")} title='Editează modul'>
                                                <img src={this.props.isAdmin || this.props.data.owner == this.props.currentUser ? (this.props.themeToggled ? "./images/edit.svg" : "./images/bEdit.svg") : (this.props.themeToggled ? "./images/view.svg" : "./images/bView.svg")} class={"d-block mx-auto"}/>
                                            </div>
                                        </Link>

                                    </div>

                                    <div class="col">
                                        <div class="row">
                                            <div class={"d-flex knbn-transition ml-2"}><img src="./images/module.svg" class="my-auto" /></div>

                                            <div class={"col text-truncate knbn-transition my-auto" + (this.props.themeToggled ? " knbn-dark-color-3x" : " knbn-snow-color-3x")}>{this.props.data.name}</div>
                                        {
                                            this.state.release.name ? 
                                            <div class="knbn-transition knbn-font-small my-auto">
                                                <div title="Versiune" class={"mr-3 knbn-border knbn-border-radius-50 px-2 knbn-transition" + (this.props.themeToggled ? " knbn-dark-color-3x knbn-dark-border-3x" : " knbn-snow-color-3x knbn-snow-border-3x")}>
                                                    {this.state.release.name}
                                                </div>
                                            </div>
                                            :null
                                        }
                                        {
                                            this.state.category.name ? 
                                            <div class="knbn-transition knbn-font-small my-auto">
                                                <div title="Categorie" class={"mr-3 knbn-border knbn-border-radius-50 px-2 knbn-transition" + (this.props.themeToggled ? " knbn-dark-color-3x knbn-dark-border-3x" : " knbn-snow-color-3x knbn-snow-border-3x")}>
                                                    {this.state.category.name}
                                                </div>
                                            </div>
                                            :null
                                        }

                                        {
                                            this.state.owner.name ? 
                                            <div class="knbn-transparent mr-3 knbn-transition my-auto ml-auto" title="Proprietar">
                                                <Link to={"/edit/profile/" +  this.state.owner.email}>
                                                    <div class={"knbn-transition my-auto" + (this.props.themeToggled ? " knbn-dark-color-3x" : " knbn-snow-color-3x")}>
                                                        <img src={'https://www.gravatar.com/avatar/' + crypto.createHash('md5').update(String(this.props.data.owner).toLowerCase().trim()).digest('hex')} class="my-auto knbn-profile-pic-medium mr-2"/>
                                                        {this.state.owner.name ? this.state.owner.name : "Nicio persoană"}
                                                    </div>
                                                </Link>
                                            </div>
                                            :
                                            null
                                        }
                                        {
                                            this.props.isAdmin?
                                            <div class='d-flex'>
                                                <div onClick={this.remove} class={"mr-2 knbn-pointer knbn-border-left knbn-transition my-auto ml-auto" + (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-2x")} title="Elimină modul">
                                                    <img src="./images/adminRemove.svg" class="my-auto"/>
                                                </div>
                                            </div>
                                            :null
                                        }
                                        </div>
                                    </div>

                                    <div class={"knbn-comp-desc comp-desc col-12" + (this.props.themeToggled ? " knbn-dark-color-2x" : " knbn-snow-color-2x") + (!this.state.showDesc ? " hide" : "")}>{ReactHtmlParser(this.props.data.description)}</div>

                                </div>

                            </div>                            
                        </div>
                    </div>  
                </div>
                {
                <div class="row">
                    <div class={
                        !this.state.flip && (this.state.tickets.length || this.state.reports.length) ? "section-body col" : "section-body col reduce"}>
                        <div class="row">
                            {/* BACKLOG */}
                            <LaneBacklog 
                                tickets={this.state.tickets.filter(item => item.lane == 'backlog')}
                                reports={this.state.reports.filter(item => item.lane == 'backlog')} 
                                compID={this.props.data.id} 
                                helpers={helpers}
                                setError={this.props.setError}
                                pushTicket={this.pushTicket}
                                pushReport={this.pushReport}
                                refresh={this.refresh}
                            />

                            {/* IN PROGRESS */}
                            <LaneProgress 
                                tickets={this.state.tickets.filter(item => item.lane == 'in_progress')}
                                reports={this.state.reports.filter(item => item.lane == 'in_progress')}
                                compID={this.props.data.id} 
                                wip={this.props.wip}
                                helpers={helpers}
                                setError={this.props.setError}
                                pushTicket={this.pushTicket}
                                pushReport={this.pushReport}
                                refresh={this.refresh}
                            />

                            {/* DONE */}
                            <LaneDone 
                                tickets={this.state.tickets.filter(item => item.lane == 'done')}
                                reports={this.state.reports.filter(item => item.lane == 'done')}   
                                compID={this.props.data.id}
                                helpers={helpers}
                                setError={this.props.setError}
                                pushTicket={this.pushTicket}
                                pushReport={this.pushReport}
                                refresh={this.refresh}
                            />

                            {/* CLOSED */}
                            <LaneClosed 
                                tickets={this.state.tickets.filter(item => item.lane == 'closed')}
                                reports={this.state.reports.filter(item => item.lane == 'closed')}
                                compID={this.props.data.id}
                                helpers={helpers}
                                setError={this.props.setError}
                                pushTicket={this.pushTicket}
                                pushReport={this.pushReport}
                                refresh={this.refresh}
                            />
                        </div>
                    </div>
                </div>
            }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
        filterPR: state.filterPR,
        userOnly: state.userOnly,
        currentUser: state.currentUser,
        filterTickets: state.filterTickets,
        isAdmin: state.isAdmin
    }
}

export default connect(mapStateToProps)(Component);