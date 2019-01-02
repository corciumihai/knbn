import React from 'react';
import {render} from 'react-dom';
import {HashRouter, Switch, Route} from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import Menu from '../components/Menu';
import EditComponent from '../components/EditComponent';
import TicketSetup from '../components/create/TicketSetup';
import PRSetup from '../components/create/PRSetup';
import CmpSetup from '../components/create/CmpSetup';
import EditTicket from '../components/EditTicket';
import EditPR from '../components/EditPR';

render((
    <HashRouter>
        <div class="container-fluid px-0">
            <Menu/>
            <Switch>
                <Route exact path="/" component={Dashboard}/>
                <Route exact path="/edit-component/:compID" component={EditComponent}/>
                <Route exact path="/edit-ticket/:ticketID" component={EditTicket}/>
                <Route exact path="/edit-pr/:ticketID" component={EditPR}/>
                <Route exact path="/create-ticket" component={TicketSetup}/>
                <Route exact path="/create-pr" component={PRSetup}/>
                <Route exact path="/create-cmp" component={CmpSetup}/>
            </Switch>
        </div>
    </HashRouter>
    ), document.getElementById('app'));