import React from 'react';
import ReactDom from 'react-dom';
import Component from './components/dashboard/Component';
import axios from 'axios';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

@DragDropContext(HTML5Backend)
class Dashboard extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            components: [],
            loading: true,
        }
    }

    componentWillMount(){
        axios.get('/components').then(response => {
            this.setState({components: response.data})
        });
    }

    componentDidMount(){
        this.setState({loading:false});
    }

    render(){
        return(
            <div class="container-fluid">
            {/* components */}
            {
                this.state.loading ? 
                <img src="./images/bigloading.gif" class="d-block mx-auto"/>
                :
                this.state.components.map(comp => {
                    return <Component key={comp.id} name={comp.name} id={comp.id} edit={this.editTicket}/>
                })
            }
            </div>
        );
    }
}

ReactDom.render(<Dashboard/>, document.getElementById('dashboard'));

export default Dashboard;