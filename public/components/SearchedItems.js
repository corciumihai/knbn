import React from 'react';
import Menu from './Menu';
import {connect} from 'react-redux';
import axios from 'axios';
import SearchItem from './SearchItem';
import Header3 from './editor/Header3';

class SearchedItems extends React.Component{
    constructor(){
        super();

        this.state = {
            param: '',
            projects: [],
            tickets: [],
            reports: [],
            components: []
        }
    }

    componentWillMount(){
        axios.get('/search/' + this.props.match.params.term)
        .then(response => {
            this.setState({
                param: this.props.match.params.term,
                projects: response.data.projects, 
                tickets: response.data.tickets,
                reports: response.data.reports,
                components: response.data.components
            })
        })
    }

    componentWillReceiveProps(nextProps, nextState){
        if(nextProps.match.params.term != this.state.param){
            axios.get('/search/' + nextProps.match.params.term)
            .then(response => {
                this.setState({
                    param: nextProps.match.params.term,
                    projects: response.data.projects, 
                    tickets: response.data.tickets,
                    reports: response.data.reports
                })
            })
        }
    }

    render(){
        console.log(this.state);
        return(
            <div>
                <Menu/>
                <div class="container-fluid mt-3">
                    <div class={"knbn-border-bottom" + (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-2x")}>
                        {
                            this.state.projects.length == 0 ? 
                            null
                            :
                            (
                                <div class="mb-2">
                                    <div>
                                        <Header3>Proiecte</Header3>
                                    </div>
                                
                                    { 
                                        this.state.projects.length > 0 ? 
                                        this.state.projects.map(project => {return <SearchItem key={project.id} data={project} imgSrc="./images/project.svg"/>})
                                        : null
                                    }
                                </div>
                            )
                        }
                        
                    </div>

                    <div class={"knbn-border-bottom" + (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-2x")}>
                        {
                            this.state.components.length == 0 ? 
                            null
                            :
                            (
                                <div class="mb-2">
                                    <div>
                                        <Header3>Componente</Header3>
                                    </div>
                                
                                    { 
                                        this.state.components.length > 0 ? 
                                        this.state.components.map(component => {return <SearchItem key={component.id} data={component} imgSrc="./images/comp.svg"/>})
                                        : null
                                    }
                                </div>
                            )
                        }
                        
                    </div>

                    <div class={"knbn-border-bottom" + (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-2x")}>
                        {
                            this.state.tickets.length == 0 ? 
                            null
                            :
                            (
                                <div class="mb-2">
                                    <div>
                                        <Header3>Tichete</Header3>
                                    </div>
                                
                                    { 
                                        this.state.tickets.length > 0 ? 
                                        this.state.tickets.map(ticket => {return <SearchItem key={ticket.id} data={ticket} imgSrc="./images/ticket.svg"/>})
                                        : null
                                    }
                                </div>
                            )
                        }
                        
                    </div>

                    <div class={"knbn-border-bottom" + (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-2x")}>
                        {
                            this.state.reports.length == 0 ? 
                            null
                            :
                            (
                                <div class="mb-2">
                                    <div>
                                        <Header3>Probleme</Header3>
                                    </div>
                                
                                    { 
                                        this.state.reports.length > 0 ? 
                                        this.state.reports.map(report => {return <SearchItem key={report.id} data={report} imgSrc="./images/pr.svg"/>})
                                        : null
                                    }
                                </div>
                            )
                        }
                        
                    </div>

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