import React from 'react';
import ReactDom from 'react-dom';
import Component from './dashboard/Component';
import axios from 'axios';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

@DragDropContext(HTML5Backend)
class Dashboard extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            components: [],
        }
    }

    componentDidMount(){
        axios.get('/get-components').then(response => {
            this.setState({components: response.data});
        });
    }

    render(){
        return(
            <div class="container-fluid d-flex flex-column p-0">
                {this.state.components.map(comp => {return <Component key={comp.id} data={comp}/>})}
            </div>
        );
    }
}

// ReactDom.render(<Dashboard/>, document.getElementById('dashboard'));

export default Dashboard;