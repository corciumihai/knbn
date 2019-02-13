import React from 'react';
import { connect } from 'react-redux';
import Menu from './Menu';
import Header3 from './editor/Header3';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
const cookies = new Cookies();

class Dashboard extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            projects: [],
            redirect: false,
            lastProject: 0
        }
    }

    componentWillMount(){
        let lastProject = cookies.get('knbn-lastProject');
        if(lastProject){
            this.setState({lastProject: lastProject, redirect: true})
        }
        else{
            
        }
    }

    render(){
        return(
            this.state.redirect ? 
            <Redirect to={"/view/project/" + this.state.lastProject} />
            :
            <div class={"container-fluid knbn-bg-transparent knbn-transition pb-3 knbn-container" + (this.props.themeToggled ? " knbn-dark-bg-1x" : " knbn-snow-bg-1x")}>
                <Menu/>

                <div class="row mt-3 knbn-mandatory-margin">
                    <div class="col-12">
                        <Header3>Pagina proiectului de licență</Header3>
                    </div>
                    
                    <div class="col-12">
                        <a  href="https://github.com/Justplayit/knbn">
                            <div class={"knbn-font-small"}>
                                Link catre repository
                            </div>
                        </a>
                    </div>
                </div>
                {

                }
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