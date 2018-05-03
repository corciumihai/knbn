import React from 'react';
import ReactDom from 'react-dom';
import CardPool from './components/dashboard/CardPool.js';
// import Menu from './components/dashboard/Menu.js';

class Dashboard extends React.Component{
    render(){
        return(
            <CardPool/>
        );
    }
}

ReactDom.render(<Dashboard/>, document.getElementById('dashboard'));

export default Dashboard;