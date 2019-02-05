import React from 'react';
import Component from './project/Component';
import axios from 'axios';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import {connect} from 'react-redux';
import Header3 from './editor/Header3';
import Menu from './Menu';
import LoadingScreen from './LoadingScreen';
import Filters from './Filters';
import Filter from './filters/Filter';
import Error from './create/Error';
import DissmisableError from './messages/DismisableError';

class Project extends React.Component{
    constructor(props){
        super(props);
        
        this.state = {
            components: [],
            data: {},
            loading: true,
            error: ''
        }

        this.setError = this.setError.bind(this);
    }

    componentDidMount(){
        axios.get('/get-project-details/' + this.props.match.params.id)
        .then(response => {
            var projectData = response.data;
            if(projectData != {} && projectData != undefined){
                axios.get('/get-components/' + this.props.match.params.id)
                .then(response => {
                    var components = response.data;
                    this.setState({components: components, data: projectData, loading: false});
                });
            }
        }); 
    }

    componentWillReceiveProps(nextProps, nextState){
        axios.get('/get-project-details/' + nextProps.match.params.id)
        .then(response => {
            var projectData = response.data;

            if(projectData != {} && projectData != undefined){
                axios.get('/get-components/' + nextProps.match.params.id)
                .then(response => {
                    this.setState({components: response.data, data: projectData, loading: false});
                });
            }
        }); 
    }

    setError(error){
        this.setState({error: error});
    }

    render(){
        return(
            <div class={"container-fluid knbn-bg-transparent knbn-transition pb-3 h-100 knbn-container" + (this.props.themeToggled ? " knbn-dark-bg-1x" : " knbn-snow-bg-1x")}>
                <Menu/>
                
                <div class="row mt-3 knbn-mandatory-margin">
                    <div class="col-xl-12">
                        <DissmisableError dismissError={() => {this.setState({error: ''})}}>{this.state.error}</DissmisableError>

                        <Filters>
                            <Filter action={this.props.toggleTickets} trigger={this.props.filterTickets}>Arată doar tichete</Filter>
                            <Filter action={this.props.togglePR} trigger={this.props.filterPR}>Arată doar RP-uri</Filter>
                            <Filter action={this.props.onlyUserTickets} trigger={this.props.userOnly}>Doar tichetele mele</Filter>
                            <Filter action={this.props.hideClosed} trigger={this.props.hiddenClosed}>Ascunde tichetele închise</Filter>
                        </Filters>
                        
                        <div class="row">
                            <Header3>
                                {this.state.data.name}
                            </Header3>
                            {
                                this.state.loading ? 
                                <LoadingScreen/>
                                :
                                this.state.components.length > 0 ?
                                this.state.components.map(comp => {
                                    let data = comp;
                                    data.project = this.props.match.params.id;
                                    return <Component key={comp.id} data={comp} setError={(error) => {this.setState({error: error})}}/>
                                })
                                :
                                <div class="col-12">
                                    <span class={"knbn-font-medium" + (this.props.themeToggled ? " knbn-dark-color-2x" : " knbn-snow-color-2x")}>
                                        Acest proiect nu conține componente/tichete. Începeți prin a adăuga o componentă și apoi una sau mai multe tichete.
                                    </span> 
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
        filterPR: state.filterPR,
        userOnly: state.userOnly,
        hiddenClosed: state.hiddenClosed,
        filterTickets: state.filterTickets,
        collapseAll: state.collapseAll
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleTickets: () => {
            dispatch({
                type: 'KNNB_TOGGLE_TICKETS',
            });
        },

        togglePR: () => {
            dispatch({
                type: 'KNNB_TOGGLE_PR',
            });
        },

        onlyUserTickets: () => {
            dispatch({
                type: 'KNNB_TOGGLE_USER_ONLY',
            });
        },

        hideClosed: () => {
            dispatch({
                type: 'KNNB_TOGGLE_HIDE_CLOSED',
            });
        },

        collapseAllElements: () => {
            dispatch({
                type: 'KNNB_TOGGLE_COLLAPSE',
            });
        }
    }
}

export default DragDropContext(HTML5Backend)(connect(mapStateToProps, mapDispatchToProps)(Project));