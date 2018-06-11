import React from 'react';
import ReactDom from 'react-dom';
import axios from 'axios';
import {Switch, Route} from 'react-router-dom';
import ViewTicket from './ViewTicket';
import ViewProblemReport from './ViewProblemReport';

class View extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <Switch>
                <Route path='/view/ticket/:id' component={ViewTicket}/>
                <Route path='/view/report/:id' component={ViewProblemReport}/>
            </Switch>
        );
    }
}


export default View;