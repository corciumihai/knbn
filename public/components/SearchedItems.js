import React from 'react';
import Menu from './Menu';
import {connect} from 'react-redux';
import axios from 'axios';
import SearchItem from './SearchItem';
import Header3 from './editor/Header3';
import DismisableError from './messages/DismisableError';
import { Link } from 'react-router-dom';

class SearchedItems extends React.Component{
    constructor(){
        super();

        this.state = {
            param: '',
            projects: [],
            tickets: [],
            reports: [],
            components: [],

            error: ''
        }
    }

    componentDidMount(){
        axios.all([
            axios.get('/search/project/' + this.props.match.params.term),
            axios.get('/search/component/' + this.props.match.params.term),
            axios.get('/search/ticket/' + this.props.match.params.term),
            axios.get('/search/report/' + this.props.match.params.term),
        ])
        .then(axios.spread((project, component, ticket, report) => {
            this.setState({
                param: this.props.match.params.term,
                projects: project.data, 
                tickets: ticket.data,
                reports: report.data,
                components: component.data
            })
        }))
        .catch(error => {
            this.setState({error: error.response.data.error});
        })
    }

    componentWillReceiveProps(nextProps, nextState){        
        axios.all([
            axios.get('/search/project/' + nextProps.match.params.term),
            axios.get('/search/component/' + nextProps.match.params.term),
            axios.get('/search/ticket/' + nextProps.match.params.term),
            axios.get('/search/report/' + nextProps.match.params.term),
        ])
        .then(axios.spread((project, component, ticket, report) => {
            this.setState({
                param: nextProps.match.params.term,
                projects: project.data, 
                tickets: ticket.data,
                reports: report.data,
                components: component.data
            })
        }))
        .catch(error => {
            this.setState({error: error.response.data.error});
        })
    }

    render(){
        let numberOfItems = this.state.projects.length + this.state.tickets.length + this.state.components.length + this.state.reports.length;
        return(
            <div class={"container-fluid knbn-bg-transparent knbn-transition knbn-container pb-3 h-100" + (this.props.themeToggled ? " knbn-dark-bg-1x" : " knbn-snow-bg-1x")}>
                <Menu/>

                <div class="row knbn-mandatory-margin">
                    <div class="col-xl-6 offset-xl-3">
                        <Header3>{'Număr de elemente găsite: ' + numberOfItems}</Header3>
                    </div>
                </div>

                <DismisableError dismissError={()=>{this.setState({error: ''})}}>{this.state.error}</DismisableError>

                <div class={"knbn-border-top col-xl-6 offset-xl-3 pt-1" + (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-2x")}>
                    {
                        !this.state.projects.length ? 
                        null
                        :
                        (
                            <div class="mb-1">
                                { 
                                    this.state.projects.length ? 
                                    this.state.projects.map(project => {
                                        return  <Link to={"/edit/project/" + project.id} key={"proj" + project.id}>
                                                    <SearchItem key={"proj" + project.id} data={project} imgSrc="./images/project.svg"/>
                                                </Link>
                                    })
                                    : null
                                }
                            </div>
                        )
                    }
                    {
                        !this.state.components.length ? 
                        null
                        :
                        (
                            <div class="mb-1">
                                { 
                                    this.state.components.length ? 
                                    this.state.components.map(component => {
                                        return  <Link to={"/edit/component/" + component.id} key={"comp" + component.id}>
                                                    <SearchItem key={"comp" + component.id} data={component} imgSrc="./images/module.svg"/>
                                                </Link>
                                    })
                                    : null
                                }
                            </div>
                        )
                    }
                    {
                        !this.state.tickets.length ? 
                        null
                        :
                        (
                            <div class="mb-1">
                                { 
                                    this.state.tickets.length ? 
                                    this.state.tickets.map(ticket => {
                                        return  <Link to={"/edit/ticket/" + ticket.id} key={"ticket" + ticket.id}>
                                                    <SearchItem key={"ticket" + ticket.id} data={ticket} imgSrc="./images/ticket.svg"/>
                                                </Link>
                                    })
                                    : null
                                }
                            </div>
                        )
                    }
                    {
                        !this.state.reports.length ? 
                        null
                        :
                        (
                            <div class="mb-1">
                                { 
                                    this.state.reports ? 
                                    this.state.reports.map(report => {
                                        return  <Link to={"/edit/report/" + report.id} key={"report" + report.id}>
                                                    <SearchItem key={"report" + report.id} data={report} imgSrc="./images/pr.svg"/>
                                                </Link>
                                    })
                                    : null
                                }
                            </div>
                        )
                    }
                    
                </div>

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(SearchedItems);