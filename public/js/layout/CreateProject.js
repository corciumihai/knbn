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
            projectName: '',
            disciplines: [],
            releases: [],

            projectId:'',
            releaseName: '',
            disciplineName: '',

            startDate: new Date(),
            endDate: new Date(),
            releaseStartDate: new Date(),
            releaseEndDate: new Date(),

            projectNameErr: '',
            projectIdErr: '',
            projectReleaseErr: '',
            projectDateErr: '',
            projectDisciplineErr: ''
        }

        this.setProjectName = this.setProjectName.bind(this);
        this.setProjectId = this.setProjectId.bind(this);
        this.addDiscipline = this.addDiscipline.bind(this);
        this.removeDiscipline = this.removeDiscipline.bind(this);
        this.setReleaseName = this.setReleaseName.bind(this);
        this.setDisciplineName = this.setDisciplineName.bind(this);
        this.addRelease = this.addRelease.bind(this);
        this.removeRelease = this.removeRelease.bind(this);
        this.submit = this.submit.bind(this);
        this.resetState = this.resetState.bind(this);

        this.setStartDate = this.setStartDate.bind(this);
        this.setEndDate = this.setEndDate.bind(this);
        this.setReleaseEndDate = this.setReleaseEndDate.bind(this);
        this.setReleaseStartDate = this.setReleaseStartDate.bind(this);
        this.keyAddDiscipline = this.keyAddDiscipline.bind(this);
        this.keyAddRelease = this.keyAddRelease.bind(this);

        this.saveCookie = this.saveCookie.bind(this);
    }

    componentWillMount(){
        // fetch data from cookies
        let cookieData = projectCookie.get('project');
        if(cookieData == undefined){return;}
        if(cookieData.projectName != undefined && cookieData.projectName.length > 0){ this.setState({projectName: cookieData.projectName}); }
        if(cookieData.projectId != undefined && cookieData.projectId.length > 0){ this.setState({projectId: cookieData.projectId}); }
        if(cookieData.startDate != undefined && cookieData.startDate.length > 0){ this.setState({startDate: new Date(cookieData.startDate)}); }
        if(cookieData.endDate != undefined && cookieData.endDate.length > 0){ this.setState({endDate: new Date(cookieData.endDate)}); }
        if(cookieData.releases != undefined && cookieData.releases.length > 0){ this.setState({releases: cookieData.releases}); }
        if(cookieData.releaseName != undefined && cookieData.releaseName.length > 0){ this.setState({releaseName: cookieData.releaseName}); }
        if(cookieData.disciplines != undefined && cookieData.disciplines.length > 0){ this.setState({disciplines: cookieData.disciplines}); }
        if(cookieData.disciplineName != undefined && cookieData.disciplineName.length > 0){ this.setState({disciplineName: cookieData.disciplineName}); }
        if(cookieData.releaseStartDate != undefined && cookieData.releaseStartDate.length > 0){ this.setState({releaseStartDate: new Date(cookieData.releaseStartDate)}); }
        if(cookieData.releaseEndDate != undefined && cookieData.releaseEndDate.length > 0){ this.setState({releaseEndDate: new Date(cookieData.releaseEndDate)}); }
    }

    componentDidUpdate(){ this.saveCookie(); }

    setProjectName(event){ this.setState({projectName: event.target.value, projectNameErr: ''}); }
    setProjectId(event){ this.setState( {projectId: event.target.value, projectIdErr: ''}); }
    setReleaseName(event){ this.setState( {releaseName: event.target.value, projectReleaseErr: ''}); }
    setDisciplineName(event){ this.setState( {disciplineName: event.target.value, projectDisciplineErr: ''}); }

    addDiscipline(){
        if(this.state.disciplineName == undefined || this.state.disciplineName.length == 0){this.setState({projectDisciplineErr: 'Empty discipline name'}); return;}
        if(this.state.disciplines.find(element => {return element == this.state.disciplineName})){this.setState({projectDisciplineErr: 'Discipline already in the list'}); return;}
        
        this.setState({disciplines: update(this.state.disciplines, {$push: [this.state.disciplineName]})}, () => {
            this.setState({disciplineName: '', projectDisciplineErr: ''})
        });
    }

    keyAddDiscipline(event){ if(event.charCode != 13){ return; } this.addDiscipline(); }
    removeDiscipline(discipline){ this.setState({disciplines: update(this.state.disciplines, {$splice: [[this.state.disciplines.indexOf(discipline), 1]]})}); }

    addRelease(){
        if(this.state.releaseName == undefined || this.state.releaseName.length == 0){this.setState({projectReleaseErr: 'Empty release name'}); return;}
        if(this.state.releaseStartDate.getTime() > this.state.releaseEndDate.getTime()){this.setState({projectReleaseErr: 'Invalid date - start date is higher than end date'}); return;}
        if(this.state.releases.find(element => {return element.name == this.state.releaseName})){this.setState({projectReleaseErr: 'Release already in the list'}); return}

        let release = {name: this.state.releaseName, startDate: this.state.releaseStartDate.getTime(), endDate: this.state.releaseEndDate.getTime()}
        this.setState({releases: update(this.state.releases, {$push: [release]})}, () => {
            this.setState({releaseName: '', projectReleaseErr: ''});
        })
    }

    keyAddRelease(event){ if(event.charCode != 13){ return; } this.addRelease(); }
    removeRelease(release){ this.setState({releases: update(this.state.releases, {$splice: [[this.state.releases.indexOf(release), 1]]})}); }

    resetState(){
        this.setState({ projectName: '', disciplines: [], releases: [], projectId: '', releaseName: '', disciplineName: '', startDate: new Date(), endDate: new Date(),
            releaseStartDate: new Date(), releaseEndDate: new Date(), projectNameErr: '', projectIdErr: '', projectReleaseErr: '', projectDateErr: '', projectDisciplineErr: '' });
    }

    submit(){
        if(this.state.projectName == undefined || this.state.projectName.length == 0){this.setState({projectNameErr: 'Empty project name'}); return;}
        if(this.state.projectId == undefined || this.state.projectId.length == 0){this.setState({projectIdErr: 'Empty project id name'}); return;}
        if(this.state.startDate.getTime() > this.state.endDate.getTime()){this.setState({projectDateErr: 'Start development date cannot be higher than end development date'}); return;}
        if(this.state.releases == undefined || this.state.releases.length == 0){this.setState({projectReleaseErr: 'You must have at least one release'}); return;}
        if(this.state.disciplines == undefined || this.state.disciplines.length == 0){this.setState({projectDisciplineErr: 'You must have at least one discipline'}); return;}

        /* all state has enough info to be created */
        axios.post('/add/project', {
            projectName: this.state.projectName,
            projectShortName: this.state.projectId,
            startDate: this.state.startDate.getTime(),
            endDate: this.state.endDate.getTime(),
            releases: this.state.releases,
            disciplines: this.state.disciplines
        }).then(response => {
            if(response.status == 200){
                console.log('Project successfully added to database!');
                this.resetState();
            }
        });

    }

    /* ***************************************************************************** */
    setStartDate(date){this.setState({startDate: date, projectDateErr: ''});}
    setEndDate(date){this.setState({endDate: date, projectDateErr: ''});}
    setReleaseStartDate(date){this.setState({releaseStartDate: date, projectReleaseErr: ''});}
    setReleaseEndDate(date){this.setState({releaseEndDate: date, projectReleaseErr: ''});}
    saveCookie(){projectCookie.set('project', this.state);}

    render(){
        return(
            <div class='project col-xl-4 offset-xl-4'>
            {/* <form> */}
                <div class="row">
                    {/* *************** [ project name] ******************************* */}
                    <div class="col-xl-12">
                        <div class="row py-3 dash mb-3">  
                            <div class="col-xl-3 pr-0 info mb-xl-0 mb-2">
                                <div class="row d-flex h-100">
                                    <div class="warning ml-3 align-self-center" title="This is a mandatory field"><img src="./images/warning.svg" class="d-block mx-auto"/></div>
                                    <div class="col d-flex"><span class="align-self-center">Project name</span></div>
                                </div>
                            </div>
                            <div class="col-xl-9">
                                <div class="row">
                                    <div class="col-xl-12">
                                        <input type="text" class={
                                            this.state.projectNameErr.length > 0 ? "form-control bad" : "form-control"
                                        } placeholder="Enter project name" 
                                            onChange={this.setProjectName} value={this.state.projectName}/>
                                    
                                    </div>
                                    {
                                        this.state.projectNameErr.length > 0 ? 
                                            <div class="col-xl-12" class="error"><span class="px-3">{this.state.projectNameErr}</span></div>
                                            :
                                            null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* *************************************************************** */}

                    {/* *************** [ project id] ********************************* */}
                    <div class="col-xl-12">
                        <div class="row py-3 dash mb-3">  
                            <div class="col-xl-3 pr-0 info  mb-xl-0 mb-2">
                                <div class="row d-flex h-100">
                                        <div class="warning ml-3 align-self-center" title="This is a mandatory field"><img src="./images/warning.svg" class="d-block mx-auto"/></div>
                                        <div class="col d-flex"><span class="align-self-center">Project ID</span></div>
                                </div>
                            </div>
                            <div class="col-xl-4 d-flex">
                                <div class="row">
                                    <div class="col-xl-12">
                                        <input type="text" class={
                                            this.state.projectIdErr.length > 0 ? "form-control bad" : "form-control"
                                        } placeholder="Enter project id" 
                                            onChange={this.setProjectId} value={this.state.projectId}/>
                                    </div>
                                    {
                                        this.state.projectIdErr.length > 0 ?
                                        <div class="col-xl-12" class="error"><span class="px-3">{this.state.projectIdErr}</span></div>
                                        :
                                        null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* *************************************************************** */}

                    {/* ************** [ development start date ]********************** */}
                    <div class="col-xl-12">
                        <div class="row py-3 dash mb-3">
                            <div class="col-xl-3 pr-0 info mb-xl-0 mb-2">
                                <div class="row d-flex h-100">
                                    <div class="warning ml-3 align-self-center" title="This is a mandatory field"><img src="./images/warning.svg" class="d-block mx-auto"/></div>
                                    <div class="col d-flex"><span class="align-self-center">Development start date</span></div>
                                </div>
                            </div>
                            <div class="col">
                                <Dating setDate={this.setStartDate} date={this.state.startDate}/>
                            </div>
                        </div>
                    </div>
                    {/* *************************************************************** */}

                    {/* ************** [ development end date ]************************ */}
                    <div class="col-xl-12">
                        <div class="row py-3 dash mb-3">
                            <div class="col-xl-3 pr-0 info mb-xl-0 mb-2">
                                <div class="row d-flex h-100">
                                    <div class="warning ml-3 align-self-center" title="This is a mandatory field"><img src="./images/warning.svg" class="d-block mx-auto"/></div>
                                    <div class="col d-flex"><span class="align-self-center">Development end date</span></div>
                                </div>
                            </div>
                            <div class="col">
                                <Dating setDate={this.setEndDate} date={this.state.endDate}/>
                            </div>
                        </div>
                    </div>
                    {/* *************************************************************** */}

                    {/* ************** [ releases ]************************************ */}
                    <div class="col-xl-12">
                        <div class="row py-3 dash mb-3">
                            <div class="col-xl-3 pr-0 info mb-xl-0 mb-2">
                                <div class="row d-flex h-100">
                                    <div class="warning ml-3 align-self-center" title="This is a mandatory field"><img src="./images/warning.svg" class="d-block mx-auto"/></div>
                                    <div class="col d-flex"><span class="align-self-center">Releases</span></div>
                                </div>
                            </div>

                            <div class="col-xl-6">
                                <div class="row">
                                    <div class="col-xl-12">
                                        <input type="text" class={
                                            this.state.projectReleaseErr.length > 0 ? "form-control bad" : "form-control"} 
                                            onChange={this.setReleaseName} value={this.state.releaseName} onKeyPress={this.keyAddRelease} placeholder="Release name"/>
                                </div>
                                {
                                    this.state.projectReleaseErr.length > 0 ?
                                    <div class="col-xl-12" class="error"><span class="px-3">{this.state.projectReleaseErr}</span></div>
                                    :
                                    null
                                }
                                </div>
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
                                                    <button type="button" class="btn release pb-2 pt-1 pl-3 pr-1" title={'From ' + new Date(release.startDate).toDateString() + ' to ' + new Date(release.endDate).toDateString()}><span>{release.name}</span></button>
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
                            <div class="col-xl-3 pr-0 info mb-xl-0 mb-2">
                                <div class="row d-flex h-100">
                                    <div class="warning ml-3 align-self-center" title="This is a mandatory field"><img src="./images/warning.svg" class="d-block mx-auto"/></div>
                                    <div class="col d-flex"><span class="align-self-center">Disciplines</span></div>
                                </div>
                            </div>

                            <div class="col-xl-5">
                                <div class="row">
                                    <div class="col-xl-12">
                                        <input type="text" class={
                                            this.state.projectDisciplineErr.length > 0 ? "form-control bad" : "form-control"
                                        } onChange={this.setDisciplineName} onKeyPress={this.keyAddDiscipline} value={this.state.disciplineName} placeholder="Discipline name"/>
                                    </div>
                                    {
                                        this.state.projectDisciplineErr.length > 0 ?
                                        <div class="col-xl-12" class="error"><span class="px-3">{this.state.projectDisciplineErr}</span></div>
                                        :
                                        null
                                    }
                                </div>
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
                
                {/* ****************** [ submit button ] ****************************** */}
                <div class="row">
                    <div class="col d-flex justify-content-center mb-3">
                        <button class="btn submit" onClick={this.submit}>Submit</button>
                    </div>
                </div>
                {/* ******************************************************************* */}
                {/* </form> */}
            </div>
        );
    }
}

ReactDom.render(<CreateProject/>, document.getElementById('project'));

export default CreateProject;