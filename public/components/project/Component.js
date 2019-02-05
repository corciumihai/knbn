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

            tickets: [],
            filteredTickets: [],

            wip: this.props.data.wip,
            showDesc: false,
        }

        this.toggle = this.toggle.bind(this);
        this.toggleDesc = this.toggleDesc.bind(this);
        this.push = this.push.bind(this);
        this.shiftBackward = this.shiftBackward.bind(this);
        this.shiftForward = this.shiftForward.bind(this);
        this.filter = this.filter.bind(this);
    }

    componentDidMount(){
        axios.all([
            axios.get('/component/get-tickets/' + this.props.data.id),
            axios.get('/component/get-reports/' + this.props.data.id)
        ])
        .then(axios.spread((tickets, reports) => {
            this.setState({
                tickets: update(this.state.tickets, {
                    $push: tickets.data.concat(reports.data).sort((a, b) => a.startDate > b.startDate),
                })
            }, () => {
                this.setState({filteredTickets: this.filter( this.state.tickets )});
            })
        }))
    }

    toggle(){
        this.setState({flip: !this.state.flip});
    }

    toggleDesc(){
        this.setState({showDesc: !this.state.showDesc});
    }

    push(ticket){
        if(ticket){
            axios.post(ticket.isReport ? '/report/update-lane' : '/ticket/update-lane', {lane: ticket.lane, id: ticket.id})
            .then(response => {
                if(response.status == 200){
                    this.setState({
                        tickets: update(this.state.tickets, {
                            $splice: [[this.state.tickets.indexOf(this.state.tickets.find(item => item.id == ticket.id && item.isReport == ticket.isReport)), 1]],
                            $push: [ticket],
                        })
                    }, () => {
                        this.setState({ 
                            filteredTickets: this.filter( this.state.tickets.sort( (a, b) => a.startDate > b.startDate) ) 
                        });
                    });
                }
            })
            .catch(error => {
                this.props.setError(error.response.data.error);
            })
        }
        else{
            this.props.setError('Elementul selectat nu există')
        }
    }

    shiftForward(ticket){
        let data;
        switch(ticket.lane){
            case 'backlog':
                data = Object.assign({}, ticket, {
                    lane: 'in_progress'
                });

                break;

            case 'in_progress':
                data = Object.assign({}, ticket, {
                    lane: 'done'
                });

                break;

            case 'done':
                data = Object.assign({}, ticket, {
                    lane: 'closed'
                });

                break;

            case 'closed':
                //do nothing
                break;
        }

        this.push(data);
    }

    shiftBackward(ticket){
        let data;
        switch(ticket.lane){
            case 'backlog':
                break;

            case 'in_progress':
                data = Object.assign({}, ticket, {
                    lane: 'backlog'
                });

                break;

            case 'done':
                data = Object.assign({}, ticket, {
                    lane: 'in_progress'
                });

                break;

            case 'closed':
                //do nothing
                break;
        }

        this.push(data);
    }

    filter(set){
        if(this.props.userOnly && this.props.filterPR){
           return set.filter(item => (item.assignee == this.props.currentUser || item.reporter == this.props.currentUser) && (item.isReport))
        }
        else if(this.props.userOnly && this.props.filterTickets){
            return set.filter(item => (item.assignee == this.props.currentUser || item.reporter == this.props.currentUser) && (!item.isReport))
        }
        else if(this.props.userOnly){
            return set.filter(item => item.assignee == this.props.currentUser || item.reporter == this.props.currentUser)
        }
        else if(this.props.filterPR){
            return set.filter(item => item.isReport)
        }
        else if(this.props.filterTickets){
            return set.filter(item => !item.isReport)
        }
        else{
            return set;
        }
    }

    componentWillReceiveProps(nextProps, nextState){
        if(nextProps != this.props){
            this.setState({filteredTickets: this.filter(this.state.tickets)})
        }
    }

    render(){
        let helpers = {forward: this.shiftForward, backward: this.shiftBackward}

        return(
            <div class={'knbn-section col-xl-12 mb-2 knbn-transition knbn-border-top knbn-border-bottom' + (this.props.themeToggled ? " knbn-dark-bg-2x knbn-dark-shadow-1x knbn-dark-border-2x" : " knbn-snow-bg-2x knbn-snow-shadow-1x knbn-snow-border-2x")}>
                <div class="row">
                    <div class="col-xl-12">
                        <div class="row">
                            <div    class={(this.props.data.priority == 'low' ? "prio-1" : this.props.data.priority == 'medium' ? "prio-2" : "prio-3") + " mr-2"} 
                                    title={this.props.data.priority == 'low' ? "Prioritate mică" : this.props.data.priority == 'medium' ? "Prioritate medie" : "Prioritate înaltă"}/>
                            
                            <div class={"section-head col py-2 knbn-transition" + (!this.state.flip ? " knbn-border-bottom" +  (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-2x") : " ")}>
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
                <div class="row">
                    <div class={
                        !this.state.flip ? "section-body col" : "section-body col reduce"}>
                        <div class="row">
                            {/* BACKLOG */}
                            <LaneBacklog 
                                items={this.state.filteredTickets.filter(item => item.lane == 'backlog')} 
                                compID={this.props.data.id} 
                                helpers={helpers}
                                push={this.push}
                            />

                            {/* IN PROGRESS */}
                            <LaneProgress 
                                items={this.state.filteredTickets.filter(item => item.lane == 'in_progress')} 
                                compID={this.props.data.id} 
                                wip={this.state.wip}
                                helpers={helpers}
                                push={this.push}
                            />

                            {/* DONE */}
                            <LaneDone 
                                items={this.state.filteredTickets.filter(item => item.lane == 'done')} 
                                compID={this.props.data.id}
                                helpers={helpers}
                                push={this.push}
                            />

                            {/* CLOSED */}
                            <LaneClosed 
                                items={this.state.filteredTickets.filter(item => item.lane == 'closed')} 
                                compID={this.props.data.id}
                                helpers={helpers}
                                push={this.push}
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
        filterTickets: state.filterTickets
    }
}

export default connect(mapStateToProps)(Component);