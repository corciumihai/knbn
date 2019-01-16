import React from 'react';
import Component from './project/Component';
import axios from 'axios';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import {connect} from 'react-redux';
import Header3 from './editor/Header3';

class Project extends React.Component{
    constructor(props){
        super(props);
        
        this.state = {
            components: [],
            data: {},
        }
    }

    componentWillMount(){
        axios.get('/get-project-details/' + this.props.match.params.id)
        .then(response => {
            var projectData = response.data;
            if(projectData != {} && projectData != undefined){
                axios.get('/get-components/' + this.props.match.params.id)
                .then(response => {
                    var components = response.data;
                    this.setState({components: components, data: projectData});
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
                    this.setState({components: response.data, data: projectData});
                });
            }
        }); 
    }

    render(){
        return(
            <div class="d-flex flex-column">
                <div class="col-12 mb-2">
                    <Header3>
                        {this.state.data.name}
                    </Header3>
                </div>
                {
                    this.state.components.length > 0 ?
                    this.state.components.map(comp => {
                        let data = comp;
                        data.project = this.props.match.params.id;
                        return <Component key={comp.id} data={comp}/>
                    })
                    :
                    <div class="col-12">
                        <span class={"knbn-font-medium" + (this.props.themeToggled ? " knbn-dark-color-2x" : " knbn-snow-color-2x")}>
                            Acest proiect nu conține componente/tichete. Începeți prin a adăuga o componentă și apoi una sau mai multe tichete.
                        </span> 
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled
    }
}

export default DragDropContext(HTML5Backend)(connect(mapStateToProps)(Project));