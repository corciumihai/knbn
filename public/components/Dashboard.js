import React from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
import ViewProject from './dashboard/ViewProject';

class Dashboard extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            projects: []
        }
    }

    componentWillMount(){
        Axios.get('/get-projects')
        .then(response => {
            this.setState({projects: response.data})
        });
    }

    render(){
        return(
            <div class="container-fluid d-flex flex-column">
                <div class={"knbn-dashboard knbn-font-medium" + (this.props.themeToggled ? " knbn-dark-color-2x" : "knbn-snow-color-2x")}>
                {
                    this.state.projects.length > 0 ? 
                    this.state.projects.map(item => {
                        return <ViewProject data={item} key={item.id}/>
                    })
                    :
                    "Niciun proiect configurat. Configurează un proiect, apoi o componentă și tichete"
                }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return{
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(Dashboard);