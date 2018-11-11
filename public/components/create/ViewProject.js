import React from 'react';
import axios from 'axios';
import dateformat from 'dateformat';
import SetDate from './view/SetDate';
import update from 'react-addons-update';

class ViewProject extends React.Component{
    constructor(props){
        super(props);

        let date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        date = date.getTime();
        this.state = {
            name: '',
            tempName: '',
            startDate: date,
            dueDate: date,
            shortName: '',
            releases: [],
            categories: [],

            editName: false,
            editShortName: false,
            shortNameCnt: 20,
            charCounter: 100,
            errorName: '',
            errorShortName: '',
            editStartDate: false,
            editDueDate: false,
            errorStartDate: '',
            errorDueDate: '',
            
            releaseName: '',
            categoryName: '',
            description: '',
            tempDescription: '',

            editReleaseStartDate: false,
            editReleaseEndDate: false,
            releaseStartDate: date,
            releaseEndDate: date,
            editDescription: false,

            errorReleaseStartDate: '',
            errorReleaseEndDate: '',
            errorRelease: '',
            errorCategory: '',


        }

        this.setEditName = this.setEditName.bind(this);
        this.changeTempName = this.changeTempName.bind(this);
        this.setName = this.setName.bind(this);
        this.setEditShortName = this.setEditShortName.bind(this);
        this.setShortName = this.setShortName.bind(this);
        this.changeTempShortName = this.changeTempShortName.bind(this);
        this.setEditDueDate = this.setEditDueDate.bind(this);
        this.setEditStartDate = this.setEditStartDate.bind(this);
        this.setStartDate = this.setStartDate.bind(this);
        this.setDueDate = this.setDueDate.bind(this);
        this.setReleaseStartDate = this.setReleaseStartDate.bind(this);
        this.setReleaseEndDate = this.setReleaseEndDate.bind(this);
        this.setEditReleaseStartDate = this.setEditReleaseStartDate.bind(this);
        this.setEditReleaseEndDate = this.setEditReleaseEndDate.bind(this);
        this.setReleaseName = this.setReleaseName.bind(this);
        this.addRelease = this.addRelease.bind(this);
        this.setCategory = this.setCategory.bind(this);
        this.addCategory = this.addCategory.bind(this);
        this.setEditDescription = this.setEditDescription.bind(this);
        this.saveDescription = this.saveDescription.bind(this);
        this.setDescription = this.setDescription.bind(this);
        this.removeCategory = this.removeCategory.bind(this);
    }
    
    componentWillMount(){
        axios.get('/get/project/' + this.props.match.params.id).then(response => {
            let proj = response.data.project;
            let releases = response.data.releases;
            let categories = response.data.categories;
            this.setState({
                name: proj.name,
                startDate: parseInt(proj.startDate),
                dueDate: parseInt(proj.endDate),
                id: proj.id, 
                shortName: proj.shortName,
                releases: releases,
                categories: categories,
                description: proj.description,
            });
        });
    }

    setEditName(){this.setState({editName: !this.state.editName, tempName: this.state.name});}
    setEditShortName(){this.setState({editShortName: !this.state.editShortName, tempShortName: this.state.shortName});}

    changeTempName(event){
        this.setState({tempName: event.target.value});
    }

    changeTempShortName(event){
        this.setState({tempShortName: event.target.value});
    }

    setName(){
        let date = new Date().getTime().toString();
        axios.post('/project/setname', {name: this.state.tempName, lastModified: date, id: this.state.id}).then(response => {
            if(response.status == 200){this.setState({name: this.state.tempName, editName: false});}
        });
        
    }

    setShortName(){
        let date = new Date().getTime().toString();
        axios.post('/project/setshortname', {name: this.state.tempShortName, lastModified: date, id: this.state.id}).then(response => {
            if(response.status == 200){this.setState({shortName: this.state.tempShortName, editShortName: false});}
        });
    }

    setEditStartDate(){this.setState({editStartDate: !this.state.editStartDate});}
    setEditDueDate(){this.setState({editDueDate: !this.state.editDueDate});}

    setStartDate(date){
        let lDate = new Date().getTime().toString();
        if(date > this.state.dueDate){this.setState({errorStartDate: 'Start date cannot be higher than due date'}); return;}
        axios.post('/project/setstartdate', {date: date, lastModified: lDate, id: this.state.id}).then(response => {
            if(response.status == 200){
                this.setState({startDate: date, editStartDate: false, errorStartDate: ''});
            }
        });
    }
    setDueDate(date){
        let lDate = new Date().getTime().toString();
        if(date < this.state.startDate){this.setState({errorDueDate: 'Due date cannot be higher than start date'}); return;}
        axios.post('/project/setduedate', {date: date, lastModified: lDate, id: this.state.id}).then(response => {
            if(response.status == 200){
                this.setState({dueDate: date, editDueDate: false});
            }
        });
        
    }

    removeRelease(release){
        let date = new Date().getTime().toString();
        axios.post('/project/removerelease', {rid: release.id, lastModified: date, id: this.state.id}).then(response => {
            if(response.status == 200){
                this.setState({releases: response.data.releases});
            }
        });
    }

    setReleaseStartDate(date){
        if(date > this.state.releaseEndDate){this.setState({errorReleaseStartDate: 'Start date cannot be higher than due date'}); return;}
        this.setState({releaseStartDate: date, editReleaseStartDate: false, errorReleaseStartDate: ''});
    }
    setReleaseEndDate(date){
        if(date < this.state.releaseStartDate){this.setState({errorReleaseEndDate: 'Due date cannot be lower than start date'}); return;}
        this.setState({releaseEndDate: date, editReleaseEndDate: false, errorReleaseEndDate: ''});
    }

    setEditReleaseStartDate(){this.setState({editReleaseStartDate: !this.state.editReleaseStartDate});}
    setEditReleaseEndDate(){this.setState({editReleaseEndDate: !this.state.editReleaseEndDate});}

    setReleaseName(event){
        this.setState({releaseName: event.target.value});
    }

    addRelease(){
        if(this.state.releaseName.length == 0){this.setState({errorRelease: "Empty release name"}); return;}
        if(this.state.releases.find(release => {return release.name.toLowerCase() == this.state.releaseName.toLowerCase()})){this.setState({errorRelease: 'Release name already in list'}); return;}
        let date = new Date().getTime().toString();
        axios.post('/project/addrelease', {release: {name: this.state.releaseName, startDate: this.state.releaseStartDate, endDate: this.state.releaseEndDate, project: this.state.id}, 
            lastModified: date, id: this.state.id}).then(response => {
                if(response.status == 200){
                    this.setState({releases: response.data.releases, releaseName: '', errorRelease: ''});
                }
        });
    }

    setCategory(event){
        this.setState({categoryName: event.target.value});
    }

    addCategory(){
        if(this.state.categoryName.length == 0){this.setState({errorCategory: "Empty category name"}); return;}
        if(this.state.categories.find(category => {return category.name.toLowerCase() == this.state.categoryName.toLowerCase()})){ this.setState({errorCategory: "Category name already in the list"});return;}
        let date = new Date().getTime().toString();
        axios.post('/project/addcategory', {category:{name: this.state.categoryName, project: this.state.id}, lastModified: date, id: this.state.id}).then(response => {
            if(response.status == 200){
                this.setState({categories: response.data.categories, categoryName: ''});
            }
        });
    }

    removeCategory(category){
        let date = new Date().getTime().toString();
        axios.post('/project/removecategory', {cid: category.id, lastModified: date, }).then(response => {
            if(response.status == 200){
                this.setState({categories: response.data.categories});
            }
        });

    }

    setDescription(event){
        this.setState({tempDescription: event.target.value});
    }

    setEditDescription(){
        this.setState({editDescription: !this.state.editDescription, tempDescription: this.state.description});
    }

    saveDescription(){
        let date = new Date().getTime().toString();
        axios.post('/project/setdescription', {description: this.state.tempDescription, lastModified: date, id: this.state.id}).then(response => {
            if(response.status == 200){
                this.setState({description: this.state.tempDescription, editDescription: false});
            }
        });
    }

    render(){
        return(
            <div class="view-ticket col-xl-6 offset-xl-3">
                <div class="row mb-3">
                    <div class="col-xl-6">
                        <div class="col-xl-12 header mb-1 tag py-1">Project short name</div>
                        <div class={this.state.editShortName ? "col name px-3 permanent-border": "col name px-3"}> 
                            {!this.state.editShortName ?
                            <div class="row">
                                <div class="col text-truncate">{this.state.shortName} </div>
                                <div class="d-flex">
                                    <div class="edit align-self-center d-flex mr-2" onClick={this.setEditShortName}>
                                        <img src="/images/edit.svg" class="d-block mx-auto"/>
                                    </div>
                                </div>
                            </div>
                            :
                            <div class="row">
                                <div class="col text-truncate">
                                    <input type="text" class="form-control form-big-font py-0 px-0" onChange={this.changeTempShortName} value={this.state.tempShortName} onKeyPress={this.setNameOnKeyPess}/>
                                </div>
                                <div class="d-flex">
                                    <div class="edit align-self-center d-flex mr-2" onClick={this.setShortName}>
                                        <img src="/images/save.svg" class="d-block mx-auto"/>
                                    </div>
                                </div>
                                {/* {
                                    this.state.errorName.length > 0 ? <div class="col-xl-12 error-input"><span class="error">{this.state.errorName}</span></div> : null
                                } */}
                            </div>
                            }
                        </div>
                
                    {
                        this.state.editShortName ? 
                        <div class="col-xl-12 info justify-content-end d-flex">{(this.state.shortNameCnt - this.state.tempShortName.length) + " chars remaining"}</div>
                        :null
                    }  
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="container-fluid">
                        <div class="col-xl-12 header mb-1 tag py-1">Project name</div>
                        <div class={this.state.editName ? "col name px-3 permanent-border": "col name px-3"}> 
                            {!this.state.editName ?
                            <div class="row">
                                <div class="col text-truncate">{this.state.name} </div>
                                <div class="d-flex">
                                    <div class="edit align-self-center d-flex mr-2" onClick={this.setEditName}>
                                        <img src="/images/edit.svg" class="d-block mx-auto"/>
                                    </div>
                                </div>
                            </div>
                            :
                            <div class="row">
                                <div class="col text-truncate">
                                    <input type="text" class="form-control form-big-font py-0 px-0" onChange={this.changeTempName} value={this.state.tempName} onKeyPress={this.setNameOnKeyPess}/>
                                </div>
                                <div class="d-flex">
                                    <div class="edit align-self-center d-flex mr-2" onClick={this.setName}>
                                        <img src="/images/save.svg" class="d-block mx-auto"/>
                                    </div>
                                </div>
                                {/* {
                                    this.state.errorName.length > 0 ? <div class="col-xl-12 error-input"><span class="error">{this.state.errorName}</span></div> : null
                                } */}
                            </div>
                            }
                        </div>
                
                    {
                        this.state.editName ? 
                        <div class="col-xl-12 info justify-content-end d-flex">{(this.state.charCounter - this.state.tempName.length) + " chars remaining"}</div>
                        :null
                    }  
                    </div>
                </div>

                <div class="col-xl-12 mb-3">
                    <div class="row">
                        <div class="col-xl-12 header mb-1 tag py-1">Static attributes</div>
                        <div class="col-xl-12 tag">
                            <div class="row my-1">
                                <div class="col-xl-2 info align-self-center">Last modified on</div><div class="col text-truncate ticket-data py-1 align-self-center">{dateformat(this.state.lastModified, 'dd.mm.yyyy')}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xl-12">
                    <div class="row">
                        <div class="col-xl-12 header mb-1 tag py-1">Development dates</div>
                        <div class="col-xl-6">
                            <div class="row mb-1">
                                <div class="col tag"> 
                                    <div class="row my-1">
                                        <div class="col-xl-5 info d-flex"><span class="align-self-center">Development start date</span></div>
                                        {
                                        !this.state.editStartDate ?
                                        <div class="col ticket-data modifiable py-1">
                                            <div class="row">
                                                <div class="col text-center">{dateformat(this.state.startDate, "dd . mmmm . yyyy")}</div>
                                                <div class="edit-field mr-1 d-flex" onClick={this.setEditStartDate}><img src="/images/edit.svg" class="d-block mx-auto"/></div>
                                            </div>
                                        </div>
                                        :
                                        <SetDate date={this.state.startDate} set={this.setStartDate} error={this.state.errorStartDate}/>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-6">
                            <div class="row mb-3">
                                <div class="col tag"> 
                                    <div class="row my-1">
                                        <div class="col-xl-5 info d-flex"><span class="align-self-center">Development end date</span></div>
                                        {
                                        !this.state.editDueDate ?
                                        <div class="col ticket-data modifiable py-1">
                                            <div class="row">
                                                <div class="col text-center">{dateformat(this.state.dueDate, "dd . mmmm . yyyy")}</div>
                                                <div class="edit-field mr-1 d-flex" onClick={this.setEditDueDate}><img src="/images/edit.svg" class="d-block mx-auto"/></div>
                                            </div>
                                        </div>
                                        :
                                        <SetDate date={this.state.dueDate} set={this.setDueDate} error={this.state.errorDueDate}/>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row mb-3">
                        <div class="col-xl-12">
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="col-xl-12 mb-1 header tag">
                                        <div class="row">
                                            <div class="col py-1">Description</div>
                                            {
                                                !this.state.editDescription ? <div class="edit-field edit d-flex alig-self-end align-self-center mr-2" onClick={this.setEditDescription} title="Edit"><img src="/images/edit.svg" class="d-block mx-auto"/></div>
                                                :
                                                <div class="edit-field edit d-flex alig-self-end align-self-center mr-2" title="Save" onClick={this.saveDescription}><img src="/images/save.svg" class="d-block mx-auto"/></div>
                                            }
                                        </div>
                                    </div>
                                    <div class="col tag"> 
                                        <div class="row">
                                        {
                                            !this.state.editDescription ? <div class="col ticket-data px-3 py-2">{this.state.description.length > 0 ? this.state.description : "No description yet"}</div>
                                            :
                                            <textarea type="text" class="form-control rp-edit px-3 py-2" value={this.state.tempDescription} onChange={this.setDescription}/>
                                        }
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                <div class="col-xl-12 mb-3">
                    <div class="row ">
                        <div class="col-xl-12 header mb-1 tag py-1">Releases</div>
                        <div class="col-xl-12">
                            <div class="row">
                                <div class="col-xl-6">
                                    <div class="row mb-1">
                                        <div class="col tag"> 
                                            <div class="row my-1">
                                                <div class="col-xl-5 info d-flex"><span class="align-self-center">Release start date</span></div>
                                                {
                                                !this.state.editReleaseStartDate ?
                                                <div class="col ticket-data modifiable py-1">
                                                    <div class="row">
                                                        <div class="col text-center">{dateformat(this.state.releaseStartDate, "dd . mmmm . yyyy")}</div>
                                                        <div class="edit-field mr-1 d-flex" onClick={this.setEditReleaseStartDate}><img src="/images/edit.svg" class="d-block mx-auto"/></div>
                                                    </div>
                                                </div>
                                                :
                                                <SetDate date={this.state.releaseStartDate} set={this.setReleaseStartDate} error={this.state.errorReleaseStartDate}/>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xl-6">
                                    <div class="row">
                                        <div class="col tag"> 
                                            <div class="row my-1">
                                                <div class="col-xl-5 info d-flex"><span class="align-self-center">Release end date</span></div>
                                                {
                                                !this.state.editReleaseEndDate ?
                                                <div class="col ticket-data modifiable py-1">
                                                    <div class="row">
                                                        <div class="col text-center">{dateformat(this.state.releaseEndDate, "dd . mmmm . yyyy")}</div>
                                                        <div class="edit-field mr-1 d-flex" onClick={this.setEditReleaseEndDate}><img src="/images/edit.svg" class="d-block mx-auto"/></div>
                                                    </div>
                                                </div>
                                                :
                                                <SetDate date={this.state.releaseEndDate} set={this.setReleaseEndDate} error={this.state.errorReleaseEndDate}/>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-6 text-truncate">
                            <div class="row">
                                <input type="text" class="form-control font-medium-size py-0 px-3 highlight release-box col" placeholder="New release" onChange={this.setReleaseName} value={this.state.releaseName}/>
                                <div class="btn insert-release d-flex flex-row" onClick={this.addRelease}>Add<img src="/images/lanechange.svg" class="d-block mx-auto ml-2"/></div>
                            </div>
                            <div class="row"><div class="col-xl-12 error">{this.state.errorRelease}</div></div>
                        </div>
                        <div class="col-xl-12 mt-2 mb-1 release-container">
                            <div class="row">
                                {
                                    this.state.releases.map(release => {
                                        let bound = this.removeRelease.bind(this, release);
                                        return  <div class="release mx-1 my-1 d-flex flex-row" key={release.id}>
                                                    <div class="px-4 py-1">{release.name}</div>
                                                    <div class="d-flex pr-1 remove" onClick={bound} title="Remove"><img src="/images/close.svg" class="d-block mx-auto"/></div>
                                                </div>
                                    })
                                }
                            </div>
                        </div>
                        
                    </div>
                </div>

                <div class="col-xl-12 mb-3">
                    <div class="row ">
                        <div class="col-xl-12 header mb-1 tag py-1">Categories</div>
                        <div class="col-xl-6 text-truncate">
                            <div class="row">
                                <input type="text" class="form-control font-medium-size py-0 px-3 highlight release-box col" placeholder="New category" onChange={this.setCategory} value={this.state.categoryName}/>
                                <div class="btn insert-release d-flex flex-row" onClick={this.addCategory}>Add<img src="/images/lanechange.svg" class="d-block mx-auto ml-2"/></div>
                            </div>
                            <div class="row"><div class="col-xl-12 error">{this.state.errorCategory}</div></div>
                        </div>
                        <div class="col-xl-12 mt-2 release-container">
                            <div class="row">
                                {
                                    this.state.categories.map(cat => {
                                        let bound = this.removeCategory.bind(this, cat);
                                        return  <div class="release mx-1 my-1 d-flex flex-row" key={cat.id}>
                                                    <div class="px-4 py-1">{cat.name}</div>
                                                    <div class="d-flex pr-1 remove" title="Remove" onClick={bound}><img src="/images/close.svg" class="d-block mx-auto"/></div>
                                                </div>
                                    })
                                }
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        );
    }
}

export default ViewProject;