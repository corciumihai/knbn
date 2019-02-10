import React from 'react';
import ReactDom from 'react-dom';
import {HashRouter, Switch, Route, Redirect} from 'react-router-dom';
import Project from '../components/Project';
import EditComponent from '../components/EditComponent';
import TicketSetup from '../components/create/TicketSetup';
import PRSetup from '../components/create/PRSetup';
import CmpSetup from '../components/create/CmpSetup';
import store from '../storage/store';
import {Provider} from 'react-redux';
import ProjectSetup from '../components/create/ProjectSetup';
import Dashboard from '../components/Dashboard';
import EditTicket from '../components/editor/EditTicket';
import LoginPage from '../components/LoginPage';
import Register from '../components/Register';
import withAuth from './HighOrder';
import SearchedItems from '../components/SearchedItems';
import Forgot from '../components/login/Forgot';
import EditReport from '../components/editor/EditReport';
import EditProject from '../components/editor/EditProject';
import EditProfile from '../components/editor/EditProfile';
import Axios from 'axios';

class ReactHashRouter extends React.Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){
    }

    render(){
        return(
            <Provider store={store}>
                <HashRouter>
                    <Switch>
                        <Route exact path="/register" component={Register} />
                        <Route path="/login" component={LoginPage} />
                        <Route exact path="/forgot" component={Forgot} />
                        <Route exact path="/" component={withAuth(Dashboard)} />
                        <Route exact path="/view/project/:id" component={withAuth(Project)} />
                        <Route exact path="/create/pr" component={withAuth(PRSetup)} />
                        <Route exact path="/create/ticket" component={withAuth(TicketSetup)} />
                        <Route exact path="/create/cmp" component={withAuth(CmpSetup)} />
                        <Route exact path="/create/project" component={withAuth(ProjectSetup)} />
                        <Route exact path="/edit/project/:id" component={withAuth(EditProject)} />
                        <Route exact path="/edit/component/:id" component={withAuth(EditComponent)} />
                        <Route exact path="/edit/ticket/:id" component={withAuth(EditTicket)} />
                        <Route exact path="/edit/report/:id" component={withAuth(EditReport)} />
                        <Route exact path="/edit/profile/:email" component={withAuth(EditProfile)} />
                        <Route exact path="/search/value/:term" component={withAuth(SearchedItems)} />
                        <Route exact path="/search/value/" component={withAuth(SearchedItems)} />
                        <Route path="*" render={() => {
                            return <Redirect to="/"></Redirect>
                        }} />
                    </Switch>
                </HashRouter>
            </Provider>
        )
    }
}

ReactDom.render(<ReactHashRouter/>, document.getElementById('app'));