import React from 'react';
import Component from './project/Component';
import axios from 'axios';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import {connect} from 'react-redux';
import Header3 from './editor/Header3';
import Menu from './Menu';
import Filters from './Filters';
import Filter from './filters/Filter';
import { Link } from 'react-router-dom';
import DismissableError from './messages/DismissableError';
import {Redirect} from 'react-router-dom';

class Project extends React.Component{
    constructor(props){
        super(props);
        
        this.state = {
            components: [],
            data: {},
            error: ''
        }

        this.setError = this.setError.bind(this);
        this.refresh = this.refresh.bind(this);
        this.remove = this.remove.bind(this);
    }

    componentDidMount(){
        axios.get('/project/get/' + this.props.match.params.id)
        .then(response => {
            var projectData = response.data;
            if(projectData != {} && projectData != undefined){
                axios.get('/project/get/components/' + this.props.match.params.id)
                .then(response => {
                    if(response.status == 200){
                        var components = response.data;
                        this.setState({components: components, data: projectData});
                    }
                })
                .catch(error => {
                    this.setError(error.response.data.error)
                })
            }
        }); 
    }

    componentWillReceiveProps(nextProps, nextState){
        axios.get('/project/get/' + nextProps.match.params.id)
        .then(response => {
            var projectData = response.data;

            if(projectData != {} && projectData != undefined){
                axios.get('/project/get/components/' + nextProps.match.params.id)
                .then(response => {
                    this.setState({components: response.data, data: projectData});
                })
                .catch(error => {
                    this.setError(error.response.data.error)
                })
            }
        }); 
    }

    setError(error){
        this.setState({error: error});
    }

    refresh(){
        axios.get('/project/get/components/' + this.props.match.params.id)
        .then(response => {
            this.setState({components: response.data});
        })
        .catch(error => {
            this.setError(error.response.data.error);
        })
    }

    remove(){
        if(this.props.match.params.id){
            axios.post('/project/remove', {id:this.props.match.params.id})
            .then(response => {
                if(response.status == 200){
                    this.setState({redirect: true});
                }
            })
            .catch(error => {
                this.setError(error.response.data.error);
            })
        }
    }

    render(){
        if(this.state.redirect){
            return <Redirect to="/"></Redirect>
        }
        else{
            return(
                <div class={"container-fluid knbn-bg-transparent knbn-transition pb-3 h-100 knbn-container" + (this.props.themeToggled ? " knbn-dark-bg-1x" : " knbn-snow-bg-1x")}>
                    <Menu/>
                    
                    <div class="row mt-3 knbn-mandatory-margin">
                        <div class="col-xl-12">
                            <DismissableError dismiss={() => {this.setState({error: ''})}}>{this.state.error}</DismissableError>

                            <Filters>
                                <Filter action={this.props.toggleTickets} trigger={this.props.filterTickets}>Arată doar tichete</Filter>
                                <Filter action={this.props.togglePR} trigger={this.props.filterPR}>Arată doar RP-uri</Filter>
                                <Filter action={this.props.onlyUserTickets} trigger={this.props.userOnly}>Doar tichetele mele</Filter>
                                <Filter action={this.props.hideClosed} trigger={this.props.hiddenClosed}>Ascunde tichetele închise</Filter>
                            </Filters>
                            
                            <div class="row knbn-mandatory-margin">
                                <div class="col">
                                    <div class="row">
                                        <div class="col-12 d-flex mb-3 px-2">
                                        {
                                            this.props.isAdmin ? 
                                            <Link to={"/edit/project/" + this.props.match.params.id}>
                                                <div class={"h-100 knbn-pointer d-flex mr-2"}>
                                                    <div class={"knbn-border-radius-5 knbn-border knbn-transition d-flex my-auto mb-1 knbn-padding-2" + (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-2x")}>
                                                        <img class="mx-auto my-auto" src={(this.props.themeToggled ? "./images/edit.svg" : "./images/bEdit.svg")}/>
                                                    </div>
                                                </div>
                                            </Link>
                                            :
                                            <Link to={"/edit/project/" + this.props.match.params.id}>
                                                <div class={"h-100 knbn-pointer d-flex mr-2"}>
                                                    <div class={"knbn-border-radius-5 knbn-border knbn-transition d-flex my-auto mb-1 knbn-padding-2" + (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-2x")}>
                                                        <img class="mx-auto my-auto" src={(this.props.themeToggled ? "./images/view.svg" : "./images/bView.svg")}/>
                                                    </div>
                                                </div>
                                            </Link>
                                        }
                                            <div class="d-flex">
                                                <Header3>
                                                    {this.state.data.name}
                                                </Header3>
                                            </div>
                                            {
                                                this.props.isAdmin ? 
                                                <div class={"ml-auto knbn-pointer knbn-border-left" + (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-2x ")} title="Elimină" onClick={this.remove}>
                                                    <img src="./images/adminRemove.svg"/>
                                                </div>
                                                :null
                                            }
                                        </div>
                                    </div>
                                </div>
                                
                                {
                                    this.state.components.length > 0 ?
                                    this.state.components.map(comp => {
                                        let data = comp;
                                        data.project = this.props.match.params.id;
                                        return <Component key={comp.id} data={comp} setError={(error) => {this.setState({error: error})}} wip={this.state.data.wip} refresh={this.refresh}/>
                                    })
                                    :
                                    <div class="col-12">
                                        <span class={"knbn-font-medium" + (this.props.themeToggled ? " knbn-dark-color-2x" : " knbn-snow-color-2x")}>
                                            Acest proiect nu conține componente/tichete. Începeți prin a adăuga un modul și apoi una sau mai multe tichete.
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
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
        filterPR: state.filterPR,
        userOnly: state.userOnly,
        hiddenClosed: state.hiddenClosed,
        filterTickets: state.filterTickets,
        collapseAll: state.collapseAll,
        isAdmin: state.isAdmin
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