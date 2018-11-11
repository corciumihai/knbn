import React from 'react';
import {Switch, Route} from 'react-router-dom';
import ViewTicket from './ViewTicket';
import ViewProblemReport from './ViewProblemReport';
import ViewProject from './ViewProject';

class View extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <Switch>
                <Route path='/view/ticket/:id' component={ViewTicket}/>
                <Route path='/view/report/:id' component={ViewProblemReport}/>
                <Route path='/view/project/:id' component={ViewProject}/>
            </Switch>
        );
    }
}


export default View;