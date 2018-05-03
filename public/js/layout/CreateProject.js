import React from 'react';
import ReactDom from 'react-dom';
import ProjectName from './components/project/ProjectName';
import update from 'react-addons-update';
import ModuleTypes from './components/project/ModuleTypes';
import Releases from './components/project/Releases';
import DevelopmentTime from './components/project/DevelopmentTime';
import axios from 'axios';
import Cookies from 'universal-cookie';

const projectCookie = new Cookies();

class CreateProject extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            projectName: "",
            loadingMessage: "",
            disciplines: [],
            releases: [],
        }

        this.changeProjectName = this.changeProjectName.bind(this);
        this.addDiscipline = this.addDiscipline.bind(this);
        this.removeDiscipline = this.removeDiscipline.bind(this);
        this.addRelease = this.addRelease.bind(this);
        this.removeRelease = this.removeRelease.bind(this);
    }

    componentWillMount(){
        // fetch data from cookies
        let projectName = projectCookie.get('project-name');
        if(projectName != undefined){
            if(projectName.name.length > 0){
                this.setState({projectName: projectName.name});
            }
        }

        let disciplines = projectCookie.get('project-disciplines');
        if(disciplines != undefined){
            if(disciplines.disciplines.length > 0){
                this.setState({disciplines: disciplines.disciplines});
            }
        }

        let releases = projectCookie.get('project-releases');
        if(releases != undefined){
            if(releases.releases.length > 0){
                this.setState({releases: releases.releases});
            }
        }
        
    }

    changeProjectName(event, cookieChange=false){
        this.setState({projectName: event.target.value}, () => {
            projectCookie.set('project-name', {name: this.state.projectName});
        });
        
    }

    addDiscipline(discipline){
        this.setState({disciplines: update(this.state.disciplines, {$push: [discipline]})}, () => {
            projectCookie.set('project-disciplines', {disciplines: this.state.disciplines});
        });
    }

    removeDiscipline(discipline){
        this.setState({disciplines: update(this.state.disciplines, {$splice: [[this.state.disciplines.indexOf(discipline), 1]]})}, () => {
            projectCookie.set('project-disciplines', {disciplines: this.state.disciplines});
        });
    }

    addRelease(release){
        this.setState({releases: update(this.state.releases, {$push: [release]})}, () => {
            projectCookie.set('project-releases', {releases: this.state.releases});
        })
    }

    removeRelease(release){
        this.setState({releases: update(this.state.releases, {$splice: [[this.state.releases.indexOf(release), 1]]})}, () => {
            projectCookie.set('project-releases', {releases: this.state.releases});
        });
    }

    render(){
        return(
            !this.state.loadingUsers ? 
            <div class='project col-xl-6 offset-xl-3'>
                <form>
                    <ProjectName name={this.state.projectName} onChange={this.changeProjectName}/>
                    <DevelopmentTime/>
                    <ModuleTypes add={this.addDiscipline} remove={this.removeDiscipline} disciplines={this.state.disciplines}/>
                    <Releases remove={this.removeRelease} releases={this.state.releases} releases={this.state.releases} add={this.addRelease}/>
                </form>
                <div class="row">
                    <div class="col d-flex mb-2">
                        <button type="submit" class="next col-xl-2 offset-xl-10 col-md-4 offset-md-4 col-sm-12 col-12 button btn">Proceed</button>
                    </div>
                </div>
            </div>
            :
            <div class="col d-flex align-items-center justify-content-center loading">
                <div>{this.state.loadingMessage}</div>
            </div>
        );
    }
}

ReactDom.render(<CreateProject/>, document.getElementById('project'));

export default CreateProject;