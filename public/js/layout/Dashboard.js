import React from 'react';
import ReactDom from 'react-dom';
import Backlog from './components/dashboard/Backlog';
import Progress from './components/dashboard/Progress';
import Done from './components/dashboard//Done';
import Closed from './components/dashboard/Closed';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

@DragDropContext(HTML5Backend)
class Dashboard extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            tickets: [],
            loading: true,
        }
    }

    render(){
        
        return(
            <div class="container-fluid">
            {/* component */}
                <div class="row">
                    <div class="section col-xl-10 col-lg-10 col-md-10 col-sm-10 col-12 offset-xl-1 offset-lg-1 offset-md-1 offset-sm-1 px-2">
                        <div class="row">
                            <div class="section-head col-xl-12 py-2">
                                Component 1
                            </div>
                        </div>
                        <div class="row">
                            <div class="section-body col">
                                <div class="row">
                                <Backlog/>
                                <Progress/>
                                <Done/>
                                <Closed/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {/* ******************************* */}
            </div>
        );
    }
}

ReactDom.render(<Dashboard/>, document.getElementById('dashboard'));

export default Dashboard;