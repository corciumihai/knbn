import React from 'react';
import ReactDom from 'react-dom';
import update from 'react-addons-update';
// import ModuleTypes from './components/project/ModuleTypes';
import Releases from './components/project/Releases';
// import DevelopmentStart from './components/project/DevelopmentStart';
// import DevelopmentEnd from './components/project/DevelopmentEnd';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Dating from './components/create/Dating';

const projectCookie = new Cookies();

class CreateProject extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            projectName: "",
            disciplines: [],
            releases: [],

            id:'',
            releaseName: '',
            disciplineName: '',

            startDate: new Date(),
            endDate: new Date(),
            releaseStartDate: new Date(),
            releaseEndDate: new Date(),
        }

        this.changeProjectName = this.changeProjectName.bind(this);
        this.setProjectId = this.setProjectId.bind(this);
        this.addDiscipline = this.addDiscipline.bind(this);
        this.removeDiscipline = this.removeDiscipline.bind(this);
        this.setReleaseName = this.setReleaseName.bind(this);
        this.setDisciplineName = this.setDisciplineName.bind(this);
        this.addRelease = this.addRelease.bind(this);
        this.removeRelease = this.removeRelease.bind(this);

        this.setStartDate = this.setStartDate.bind(this);
        this.setEndDate = this.setEndDate.bind(this);
        this.setReleaseEndDate = this.setReleaseEndDate.bind(this);
        this.setReleaseStartDate = this.setReleaseStartDate.bind(this);
    }

    componentWillMount(){
        // fetch data from cookies
        // let projectName = projectCookie.get('project-name');
        // if(projectName != undefined){
        //     if(projectName.name.length > 0){
        //         this.setState({projectName: projectName.name});
        //     }
        // }

        // let disciplines = projectCookie.get('project-disciplines');
        // if(disciplines != undefined){
        //     if(disciplines.disciplines.length > 0){
        //         this.setState({disciplines: disciplines.disciplines});
        //     }
        // }

        // let releases = projectCookie.get('project-releases');
        // if(releases != undefined){
        //     if(releases.releases.length > 0){
        //         this.setState({releases: releases.releases});
        //     }
        // }
        
    }

    changeProjectName(event){ this.setState({projectName: event.target.value}, () => { projectCookie.set('project', { name: this.state.projectName }); }); }
    setProjectId(event){ this.setState( {id: event.target.value}, () => { projectCookie.set('project', { id: this.state.id }); }); }
    setReleaseName(event){ this.setState( {releaseName: event.target.value}, () => { projectCookie.set('project', {releaseName: this.state.releaseName}); }); }
    setDisciplineName(event){ this.setState( {disciplineName: event.target.value}, () => { projectCookie.set('project', {disciplineName: this.state.disciplineName}); }); }

    addDiscipline(){
        if(this.state.disciplineName == undefined || this.state.disciplineName.length == 0){console.log('empty discipline name'); return;}
        if(this.state.disciplines.find(element => {return element == this.state.disciplineName})){console.log('discipline already in list'); return;}
        
        this.setState({disciplines: update(this.state.disciplines, {$push: [this.state.disciplineName]})}, () => {
            this.setState({disciplineName: ''}, () => {projectCookie.set('project-disciplines', {disciplines: this.state.disciplines});})
        });
    }

    removeDiscipline(discipline){
        this.setState({disciplines: update(this.state.disciplines, {$splice: [[this.state.disciplines.indexOf(discipline), 1]]})}, () => {
            projectCookie.set('project', {disciplines: this.state.disciplines});
        });
    }

    addRelease(){
        if(this.state.releaseName == undefined || this.state.releaseName.length == 0){console.log('empty release name'); return;}
        if(this.state.releaseStartDate.getTime() > this.state.releaseEndDate.getTime()){console.log('start date higher than end date'); return;}
        if(this.state.releases.find(element => {return element.name == this.state.releaseName})){console.log('release already in list'); return}

        let release = {name: this.state.releaseName, startDate: this.state.releaseStartDate, endDate: this.state.releaseEndDate}
        this.setState({releases: update(this.state.releases, {$push: [release]})}, () => {
            this.setState({releaseName: ''}, () => {projectCookie.set('project', {releases: this.state.releases});})
        })
    }

    removeRelease(release){
        this.setState({releases: update(this.state.releases, {$splice: [[this.state.releases.indexOf(release), 1]]})}, () => {
            projectCookie.set('project', {releases: this.state.releases});
        });
    }

    // **********************
    setStartDate(date){this.setState({startDate: date});}
    setEndDate(date){this.setState({endDate: date});}
    setReleaseStartDate(date){this.setState({releaseStartDate: date});}
    setReleaseEndDate(date){this.setState({releaseEndDate: date});}

    render(){
        return(
            <div class='project col-xl-4 offset-xl-4'>
                <div class="row">
                {/* *************** [ project name] ******************************* */}
                    <div class="col-xl-12">
                        <div class="row py-3 dash mb-3">  
                            <div class="col-xl-2 pr-0 info"><span>Project name *</span></div>
                            <div class="col d-flex">
                                <input type="text" class="form-control my-0 align-self-center" placeholder="Enter project name" onChange={this.changeProjectName} value={this.state.name}/>
                            </div>
                        </div>
                    </div>
                {/* *************************************************************** */}

                {/* *************** [ project id] ********************************* */}
                    <div class="col-xl-12">
                        <div class="row py-3 dash mb-3">  
                            <div class="col-xl-2 pr-0 info"><span>Project ID *</span></div>
                            <div class="col-xl-4 d-flex">
                                <input type="text" class="form-control my-0 align-self-center" placeholder="Enter project id" onChange={this.props.setProjectId} value={this.props.id}/>
                            </div>
                        </div>
                    </div>
                {/* *************************************************************** */}

                {/* ************** [ development start date ]********************** */}
                    <div class="col-xl-12">
                        <div class="row py-3 dash mb-3">
                            <div class="col-xl-2 pr-0 info"><span>Development start date *</span></div>
                            <div class="col">
                                <Dating setDate={this.setStartDate} date={this.state.startDate}/>
                            </div>
                        </div>
                    </div>
                {/* *************************************************************** */}

                {/* ************** [ development end date ]************************ */}
                    <div class="col-xl-12">
                            <div class="row py-3 dash mb-3">
                                <div class="col-xl-2 pr-0 info"><span>Development end date *</span></div>
                                <div class="col">
                                    <Dating setDate={this.setEndDate} date={this.state.endDate}/>
                                </div>
                            </div>
                        </div>
                {/* *************************************************************** */}

                {/* ************** [ releases ]************************************ */}
                    <div class="col-xl-12">
                        <div class="row py-3 dash mb-3">
                            <div class="col-xl-2 pr-0 info"><span>Releases *</span></div>

                            <div class="col-xl-6 offset-xl-1">
                                <input type="text" class="form-control" onChange={this.setReleaseName} value={this.state.releaseName} placeholder="Release name"/>
                            </div>

                            <div class="col-xl-12">
                                <div class="row">
                                    <div class="col-xl-12 info ml-3"><span>Start date</span></div>
                                    <div class="col-xl-11 offset-xl-1">
                                        <Dating setDate={this.setReleaseStartDate} date={this.state.releaseStartDate}/>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-xl-12">
                                <div class="row">
                                    <div class="col-xl-12 info ml-3"><span>End date</span></div>
                                    <div class="col-xl-11 offset-xl-1">
                                        <Dating setDate={this.setReleaseEndDate} date={this.state.releaseEndDate}/>
                                    </div>
                                </div>
                            </div>

                            <div class="col-xl-12 d-flex justify-content-center mt-2"><button class="btn add-button" onClick={this.addRelease}>Add release</button></div>
                            <div class="col-xl-12 release-pool d-flex flex-row flex-wrap p-2 mx-3">
                            {
                                this.state.releases.length > 0 ?
                                    this.state.releases.map(release => {
                                        let bound = this.removeRelease.bind(this, release);
                                        return  <div key={release.name} class="btn-group py-1 mx-2" role="group">
                                                    <button type="button" class="btn release pb-2 pt-1 pl-3 pr-1" title={'From ' + release.startDate.toDateString() + ' to ' + release.endDate.toDateString()}><span>{release.name}</span></button>
                                                    <div type="button" class="btn close-btn pl-0 pr-2" onClick={bound}><img src="./images/close.svg" class="d-block mx-auto"/></div>
                                                </div>
                                    })
                                :
                                null
                            }
                            
                            </div>
                        </div>
                        
                    </div>
                {/* *************************************************************** */}

                {/* ************** [ disciplines ]********************************* */}
                    <div class="col-xl-12">
                        <div class="row py-3 dash mb-3">
                            <div class="col-xl-2 pr-0 info"><span>Disciplines *</span></div>

                            <div class="col-xl-6">
                                <input type="text" class="form-control" onChange={this.setDisciplineName} value={this.state.disciplineName} placeholder="Discipline name"/>
                            </div>

                            <div class="col-xl-4 mt-xl-0 mt-2"><button class="btn add-button" onClick={this.addDiscipline}>Add discipline</button></div>
                            <div class="col-xl-12 release-pool d-flex flex-row flex-wrap p-2 mx-3">
                            {
                                this.state.disciplines.length > 0 ?
                                    this.state.disciplines.map(discipline => {
                                        let bound = this.removeDiscipline.bind(this, discipline);
                                        return  <div key={discipline} class="btn-group py-1 mx-2" role="group">
                                                    <button type="button" class="btn release pb-2 pt-1 pl-3 pr-1"><span>{discipline}</span></button>
                                                    <div type="button" class="btn close-btn pl-0 pr-2" onClick={bound}><img src="./images/close.svg" class="d-block mx-auto"/></div>
                                                </div>
                                    })
                                :
                                null
                            }
                            
                            </div>
                        </div>
                        
                    </div>
                {/* *************************************************************** */}
                </div>
                
            </div>
                    
            //     <div class="row">
            //         <div class="col d-flex mb-2">
            //             <button type="submit" class="next col-xl-2 offset-xl-10 col-md-4 offset-md-4 col-sm-12 col-12 button btn">Proceed</button>
            //         </div>
            //     </div>
            // </div>
            // :
            // <div class="col d-flex align-items-center justify-content-center loading">
            //     <div>{this.state.loadingMessage}</div>
            // </div>
        );
    }
}

ReactDom.render(<CreateProject/>, document.getElementById('project'));

export default CreateProject;