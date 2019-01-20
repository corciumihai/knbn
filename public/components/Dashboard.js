import React from 'react';
import { connect } from 'react-redux';
import Menu from './Menu';

class Dashboard extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            projects: []
        }
    }

    componentWillMount(){
    }

    render(){
        return(
            <div class={"container-fluid knbn-bg-transparent knbn-transition pb-3 knbn-container" + (this.props.themeToggled ? " knbn-dark-bg-1x" : " knbn-snow-bg-1x")}>
                <Menu/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return{
        themeToggled: state.themeToggled,
        jwtToken: state.jwtToken
    }
}

export default connect(mapStateToProps)(Dashboard);