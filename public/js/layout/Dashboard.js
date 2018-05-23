import React from 'react';
import ReactDom from 'react-dom';
import Component from './components/dashboard/Component';
import axios from 'axios';

// @DragDropContext(HTML5Backend)
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
            this.setState({components: response.data, loading: false})
        });
    }

    render(){
        
        return(
            <div class="container-fluid">
            {/* component */}
                {/* <Component name={"Component 1"}/> */}
            {/* ******************************* */}
            {
                this.state.components.map(comp => {
                    return <Component key={comp.id} name={comp.name} id={comp.id}/>
                })
            }
            </div>
        );
    }
}

ReactDom.render(<Dashboard/>, document.getElementById('dashboard'));

export default Dashboard;