import React from 'react';
import ReactDom from 'react-dom';
import {HashRouter, Switch, Route} from 'react-router-dom';
import Project from '../components/Project';
import Menu from '../components/Menu';
import EditComponent from '../components/EditComponent';
import TicketSetup from '../components/create/TicketSetup';
import PRSetup from '../components/create/PRSetup';
import CmpSetup from '../components/create/CmpSetup';
import store from '../storage/store';
import {Provider} from 'react-redux';
import ProjectSetup from '../components/create/ProjectSetup';
import Dashboard from '../components/Dashboard';
import EditTicket from '../components/editor/EditTicket';
import Wrapper from './Wrapper';

class ReactRouter extends React.Component{
    render(){
        return(
            <Provider store={store}>

                <Wrapper> 

                    <HashRouter>
                        <div>

                            <Menu/>
                            <Switch>
                                <Route exact path="/" component={Dashboard} />
                                <Route exact path="/view-project/:id" component={Project} />
                                <Route exact path="/create-pr" component={PRSetup}/>
                                <Route exact path="/create-ticket" component={TicketSetup}/>
                                <Route exact path="/create-cmp" component={CmpSetup}/>
                                <Route exact path="/create-project" component={ProjectSetup}/>
                                
                                <Route exact path="/edit-component/:id" component={EditComponent}/>
                                <Route exact path="/edit-ticket/:id" component={EditTicket}/>
                            </Switch>
                            
                        </div>
                    </HashRouter>

                </Wrapper>

            </Provider>
        )
    }
}

ReactDom.render(<ReactRouter/>, document.getElementById('app'));