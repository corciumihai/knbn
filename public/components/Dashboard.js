import React from 'react';
import { connect } from 'react-redux';
import Menu from './Menu';
import Header3 from './editor/Header3';
import Axios from 'axios';

class Dashboard extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            projects: []
        }
    }

    componentDidMount(){
        Axios.get("/")
        .catch(error => {
            
        })
    }

    render(){
        return(
            <div class={"container-fluid knbn-bg-transparent knbn-transition pb-3 knbn-container" + (this.props.themeToggled ? " knbn-dark-bg-1x" : " knbn-snow-bg-1x")}>
                <Menu/>

                <div class="row mt-3 knbn-mandatory-margin">
                    <div class="col-12">
                        <Header3>Pagina principală a proiectului de licență</Header3>
                    </div>
                    
                </div>
                <div class="row my-auto">
                    <div class={"col knbn-font-small d-flex" + (this.props.themeToggled ? " knbn-dark-color-2x" : " knbn-snow-color-2x")}>
                        <iframe class="mx-auto" width="1000" height="563" src="https://www.youtube.com/embed/UWLr2va3hu0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                </div>
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