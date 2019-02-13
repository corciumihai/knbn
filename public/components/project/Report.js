import React from 'react';
import { DragSource } from 'react-dnd';
import { ItemTypes } from './Constants';
import axios from 'axios';
import crypto from 'crypto';
import dateformat from 'dateformat';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

dateformat.i18n = {
    dayNames: [
        'Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâ',
        'Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'
    ],
    monthNames: [
        'Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
    ],
    timeNames: [
        'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
    ]
};

const source = {
    beginDrag(props, monitor, component){
        let ticketData = component.state;
        ticketData.isReport = true;
        ticketData = Object.assign({flipped: component.state.flipped}, ticketData);
        return ticketData;
    }
}

class Report extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            id: this.props.data.id,
            component: this.props.data.component,
            name: this.props.data.name,
            startDate: new Date(),
            dueDate: new Date(),
            estimation: 0,
            priority: '',
            category: {},
            release: {},
            blocked: {},
            lane: 'backlog',
            assignee: {},
            reporter: {},
            hours: 0,
            isReport: this.props.data.isReport,
            flipped: this.props.data.flipped != undefined ? this.props.data.flipped : false,
        }

        this.flip = this.flip.bind(this);
        this.shiftForward = this.shiftForward.bind(this);
        this.shiftBackward = this.shiftBackward.bind(this);
        this.remove = this.remove.bind(this);
    }

    componentDidMount(){
        axios.all([
            axios.get('/report/get/' + this.props.data.id),
            axios.get('/report/get/hours/' + this.props.data.id),
        ])
        .then(axios.spread((data, hours) => {
            if(data.status == 200 && hours.status == 200){
                this.setState({
                    startDate: data.data.startDate ? data.data.startDate : (new Date()),
                    dueDate: data.data.dueDate ? data.data.dueDate : (new Date()),
                    estimation: data.data.estimation ? data.data.estimation : 0,
                    priority: data.data.priority ? data.data.priority : '',
                    category: data.data.category ? {id: data.data.category} : {},
                    release: data.data.releaseID ? {id: data.data.releaseID} : {},
                    lane: data.data.lane ? data.data.lane : this.props.data.lane,
                    hours: hours.data && hours.data.hours ? hours.data.hours : 0,
                    assignee: data.data.assignee ? {email: data.data.assignee} : {},
                    reporter: data.data.reporter ? {email: data.data.reporter} : {},
                    blocked: data.data.blocked ? {id: data.data.blocked} : {},
                    flipped: this.props.data.flipped,
                }, () => {
                    if(this.state.assignee.email){
                        axios.get('/user/' + this.state.assignee.email)
                        .then(response => {
                            if(response.status == 200){
                                this.setState({assignee: response.data})
                            }
                        })
                        .catch(error => {
                            this.props.setError(error.response.data.error)
                        })
                    }

                    if(this.state.reporter.email){
                        axios.get('/user/' + this.state.reporter.email)
                        .then(response => {
                            if(response.status == 200){
                                this.setState({reporter: response.data})
                            }
                        })
                        .catch(error => {
                            this.props.setError(error.response.data.error)
                        })
                    }
            
                    if(this.state.category.id){
                        axios.get('/category/' + this.state.category.id)
                        .then(response => {
                            if(response.status == 200){
                                this.setState({category: response.data});
                            }
                        })
                        .catch(error => {
                            this.props.setError(error.response.data.error)
                        })
                    }
            
                    if(this.state.release.id){
                        axios.get('/release/' + this.state.release.id)
                        .then(response => {
                            if(response.status == 200){
                                this.setState({release: response.data})
                            }
                        })
                        .catch(error => {
                            this.props.setError(error.response.data.error)
                        })
                    }

                    if(this.state.blocked.id){
                        axios.get('/ticket/get/' + this.state.blocked.id)
                        .then(response => {
                            if(response.status == 200){
                                this.setState({blocked: response.data})
                            }
                        })
                        .catch(error => {
                            this.props.setError(error.response.data.error)
                        })
                    }
                })
            }
        }))
        .catch(error => {
            this.props.setError(error.response.data.error)
        })
    }
    
    remove(){
        if(this.props.data.id){
            axios.post('/report/remove', {id: this.props.data.id})
            .then(response => {
                if(response.status == 200){
                    this.props.refresh();
                }
            })
            .catch(error => {
                this.props.setError(error.response.data.error);
            })
        }
    }

    shiftForward(){
        let data = this.props.data;
        data.flipped = this.state.flipped;
        this.props.helpers.reportForward(data);
    }

    shiftBackward(){
        let data = this.props.data;
        data.flipped = this.state.flipped;
        this.props.helpers.reportBackward(data);
    }

    flip(){this.setState({flipped: !this.state.flipped});}

    render(){        
        let remainingPercentage = (this.state.estimation - this.state.hours) < 0 ? -1 : (this.state.hours / this.state.estimation) * 100;
        const {connectDragSource, isDragging} = this.props;

        console.log(this.state)

        return connectDragSource(
            <div class={'col ticket-box mb-1 knbn-transition knbn-border' + (this.props.data.hide ? " hide" : "") +
            (this.props.themeToggled ? ' knbn-dark-bg-3x knbn-dark-onselect knbn-dark-shadow-2x knbn-dark-border-4x' : ' knbn-snow-bg-4x knbn-snow-onselect knbn-snow-shadow-2x knbn-snow-border-3x')}>
                <div class="row">
                    <div class={(!this.state.priority ? "no-prio" : this.state.priority == 'low' ? "prio-1" : this.state.priority == 'medium' ? "prio-2" : "prio-3")} 
                    title={!this.state.priority ? "Nicio prioritate" : this.state.priority == 'low' ? "Prioritate mică" : this.state.priority == 'medium' ? "Prioritate medie" : "Prioritate înaltă"}/>

                    <div class={"ticket col px-0"}>
                        <div class="col-xl-12 d-flex px-0 flex-row">
                            <div class="col pr-0">
                                <div class="col-xl-12 px-0">
                                    <div class="pt-1 field d-flex flex-row">
                                        {
                                            this.props.isAdmin ? 
                                            <div class="knbn-pointer" onClick={this.remove} title="Elimină"><img src="./images/adminRemove.svg"/></div>
                                            :null
                                        }
                                        
                                        <div title="Tichet" class="mr-2"><img src="./images/pr.svg" class={"mx-auto my-auto"}/></div>

                                        {
                                            <div class={"col px-0 text-truncate knbn-font-16 mb-1 d-flex" + (this.props.themeToggled ? " knbn-dark-color-5x" : " knbn-snow-color-5x")}>
                                            {
                                                this.state.name
                                            }
                                            </div>
                                        }
                                    </div>
                                </div>
                                
                                <div class={(this.state.flipped ? "ticket-data col-xl-12 pr-0 hide" : "ticket-data col-xl-12 pr-0")}>
                                    <div class="row field">
                                        <div class={"col-xl-4 col-4 px-0 info text-truncate" + (this.props.themeToggled ? " knbn-dark-color-3x" : " knbn-snow-color-3x")} title="Pistă">Pistă</div>

                                        <div class={"col-xl-8 col-8 px-0" + (this.props.themeToggled ? " knbn-dark-color-4x" : " knbn-snow-color-4x")} title={this.props.data.lane}>
                                        {
                                            (this.state.lane == "backlog" ? "În așteptare" : this.state.lane == "in_progress" ? "În progres" : this.state.lane == "done" ? "Completat" : "Închis")
                                        }
                                        </div>
                                    </div>

                                    <div class="row field">
                                        <div class={"col-xl-4 col-4 px-0 info text-truncate" + (this.props.themeToggled ? " knbn-dark-color-3x" : " knbn-snow-color-3x")} title="Id tichet">Id tichet</div>

                                        <div class={"px-0" + (this.props.themeToggled ? " knbn-dark-color-5x" : " knbn-snow-color-5x")}>
                                        {
                                            <Link to={"/edit/report/" + this.props.data.id}>
                                                <div title={this.state.id} class={"knbn-border-radius-50 knbn-font-small knbn-transition knbn-border text-center px-2 mr-1" + (this.props.themeToggled ? ' knbn-dark-border-4x knbn-dark-color-3x knbn-dark-bg-3x-active' : ' knbn-snow-border-3x knbn-snow-color-3x knbn-snow-bg-3x-active')}>
                                                {
                                                    this.props.data.id
                                                }
                                                </div>
                                            </Link>
                                        }
                                        </div>
                                    </div>
                                    {   
                                        this.state.blocked.id ? 
                                        <div class="row field">
                                            <div class={"col-xl-4 col-4 px-0 info text-truncate" + (this.props.themeToggled ? " knbn-dark-color-3x" : " knbn-snow-color-3x")} title="Zi începere">Sursă eroare</div>
                                            <div>
                                                <Link to={'/edit/ticket/' + this.state.blocked.id}>
                                                        <div class={"knbn-border-radius-50 knbn-font-small knbn-transition knbn-border" + (this.props.themeToggled ? ' knbn-dark-border-4x knbn-dark-color-3x knbn-dark-bg-3x-active' : ' knbn-snow-border-3x knbn-snow-color-3x knbn-snow-bg-3x-active')}>
                                                        {
                                                            <div class="text-truncate px-2" title={this.state.blocked.name ? this.state.blocked.name : this.state.blocked.id}>{this.state.blocked.name ? this.state.blocked.name : this.state.blocked.id}</div>
                                                        }
                                                        </div>
                                                </Link>
                                            </div>
                                        </div>
                                        :
                                        <div class="row field">
                                            <div class={"col-xl-4 col-4 px-0 info text-truncate" + (this.props.themeToggled ? " knbn-dark-color-3x" : " knbn-snow-color-3x")} title="Zi începere">Ziua creării</div>

                                            <div class={"data col-xl-8 col-8 px-0 text-truncate" + (this.props.themeToggled ? " knbn-dark-color-4x" : " knbn-snow-color-4x")} title={dateformat(this.state.startDate, "dd \u00B7 mmmm \u00B7 yyyy")}>
                                            {
                                                dateformat(this.state.startDate, "dd \u00B7 mmmm \u00B7 yyyy")
                                            }
                                            </div>
                                        </div>
                                    }     
                                    <div class="row field">
                                        <div class={"col-xl-4 col-4 px-0 info text-truncate" + (this.props.themeToggled ? " knbn-dark-color-3x" : " knbn-snow-color-3x")} title="Zi limită">Ziua limită</div>

                                        <div class={"data col-xl-8 col-8 px-0 text-truncate" + (this.props.themeToggled ? " knbn-dark-color-4x" : " knbn-snow-color-4x")} title={dateformat(this.state.dueDate, "dd \u00B7 mmmm \u00B7 yyyy")}>
                                        {
                                            dateformat(this.state.dueDate, "dd \u00B7 mmmm \u00B7 yyyy")
                                        }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="pt-2 px-2 d-flex flex-column">
                                <Link to={"/edit/profile/" + this.state.assignee.email}>
                                    <div class="mx-auto">
                                    { 
                                    this.state.assignee.email ?
                                        <img    class={"ml-auto knbn-transition knbn-border" + (this.state.flipped ? " knbn-profile-pic-medium" : " knbn-profile-pic-big") + (this.props.themeToggled ? " knbn-dark-border-3x" : " knbn-snow-border-3x")} 
                                                src={'https://www.gravatar.com/avatar/' + crypto.createHash('md5').update(String(this.state.assignee.email).toLowerCase().trim()).digest('hex')} 
                                                alt={this.state.assignee.name} title={'Asignat \u00B7 ' + this.state.assignee.name}/> 
                                        : null
                                    }
                                    </div>
                                </Link>
                                <Link to={"/edit/profile/" + this.state.reporter.email}>
                                    <div class="d-flex">
                                        <div class="mx-auto mt-2">
                                        {
                                            this.state.reporter.email ?
                                            <img    class={"ml-auto knbn-transition knbn-border" + (this.state.flipped ? " hide" : " knbn-profile-pic-medium") + (this.props.themeToggled ? " knbn-dark-border-3x" : " knbn-snow-border-3x")} 
                                                    src={'https://www.gravatar.com/avatar/' + crypto.createHash('md5').update(String(this.state.reporter.email).toLowerCase().trim()).digest('hex')} 
                                                    alt={this.state.reporter.name} title={'Supervizor \u00B7 ' + this.state.reporter.name}/> 
                                            : null
                                        }
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <div class={"col-xl-12 my-1"}>
                            <div class="row px-3">
                                <div class="d-flex flex-fill flex-row">
                                    <div class={"knbn-tool d-flex knbn-transition knbn-border knbn-no-border-right" + (this.props.themeToggled ? " knbn-dark-border-4x knbn-dark-bg-4x-active" : " knbn-snow-border-2x knbn-snow-bg-4x-active")} 
                                    onClick={this.flip} title="Micșorează">
                                        <img src={this.state.flipped ? (this.props.themeToggled ? "./images/expand.svg" : "./images/bExpand.svg") : (this.props.themeToggled ? "./images/reducer.svg" : "./images/bReducer.svg")} class={"d-block mx-auto"}/>
                                    </div>
                                    
                                    <div class={"knbn-tool d-flex knbn-transition knbn-border knbn-no-border-right" + (this.props.themeToggled ? " knbn-dark-border-4x knbn-dark-bg-4x-active" : " knbn-snow-border-2x knbn-snow-bg-4x-active")} title="Schimbă pe ultima pistă"
                                            onClick={this.shiftBackward}>
                                        <img src={this.props.themeToggled ? "./images/left.svg" : "./images/bLeft.svg"} class={"d-block mx-auto"}/>
                                    </div>
                                    
                                    <div class={"knbn-tool d-flex knbn-transition knbn-border knbn-no-border-right" + (this.props.themeToggled ? " knbn-dark-border-4x knbn-dark-bg-4x-active" : " knbn-snow-border-2x knbn-snow-bg-4x-active")}  title="Schimbă pe pista urmatoare"
                                            onClick={this.shiftForward}>
                                        <img src={this.props.themeToggled ? "./images/right.svg" : "./images/bRight.svg"} class={"d-block mx-auto"}/>
                                    </div>       

                                    <Link to={"/edit/report/" + this.props.data.id}>
                                        <div class={"knbn-tool d-flex knbn-transition knbn-border" + (this.props.themeToggled ? " knbn-dark-border-4x knbn-dark-bg-4x-active" : " knbn-snow-border-2x knbn-snow-bg-4x-active")}>
                                            <img src={this.props.isAdmin || this.state.assignee.email == this.props.currentUser || this.state.reporter.email == this.props.currentUser ? (this.props.themeToggled ? "./images/edit.svg" : "./images/bEdit.svg") : (this.props.themeToggled ? "./images/view.svg" : "./images/bView.svg")} data-toggle="modal" data-target="#editModal" title="Editează tichet" class={"d-block mx-auto"}/>
                                        </div>
                                    </Link>
                                </div>

                                <div class="d-flex flex-row mt-1">
                                    <div class={"mt-auto" + (this.props.themeToggled ? " knbn-dark-color-5x" : " knbn-snow-color-5x")} title='Versiune'>
                                    { 
                                        <div class={"knbn-border-radius-50 knbn-font-small knbn-transition knbn-border text-center px-2 mr-1 text-truncate" + (this.props.themeToggled ? ' knbn-dark-border-4x knbn-dark-color-3x knbn-dark-bg-3x-active' : ' knbn-snow-border-3x knbn-snow-color-3x knbn-snow-bg-3x-active')}>
                                        {
                                            this.state.release.name ? this.state.release.name : "Nicio versiune"
                                        }
                                        </div> 
                                    }
                                    </div>

                                    <div class={"mt-auto" + (this.props.themeToggled ? " knbn-dark-color-5x" : " knbn-snow-color-5x")} title="Categorie">
                                    { 
                                        <div class={"knbn-border-radius-50 knbn-font-small knbn-transition knbn-border text-center px-2 mr-1 text-truncate" + (this.props.themeToggled ? ' knbn-dark-border-4x knbn-dark-color-3x knbn-dark-bg-3x-active' : ' knbn-snow-border-3x knbn-snow-color-3x knbn-snow-bg-3x-active')}>
                                        {
                                            this.state.category.name ? this.state.category.name : "Nicio categorie"
                                        }
                                        </div>
                                    }
                                    </div>

                                    <div class={"mt-auto" + (this.props.themeToggled ? " knbn-dark-color-5x" : " knbn-snow-color-5x")}>
                                    {
                                        <div title="Ore rămase / Ore estimate" class={"knbn-border-radius-50 knbn-font-small knbn-transition knbn-border text-center px-2 text-truncate" + (this.props.themeToggled ? ' knbn-dark-border-4x knbn-dark-color-3x knbn-dark-bg-3x-active' : ' knbn-snow-border-3x knbn-snow-color-3x knbn-snow-bg-3x-active')}>
                                        {
                                            (this.state.hours + "h") + "/" + (this.state.estimation + "h")
                                        }
                                        </div>
                                    }
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div class="col-12 px-0">
                            <div class={"knbn-comp-progress progress w-100 knbn-transition"} style={{backgroundColor: (this.props.themeToggled ? 'rgb(100, 100, 100)' : 'rgb(209, 209, 209)')}} title="Progres"> 
                                <div class="knbn-comp-progress-bar progress-bar" role="progressbar" style={remainingPercentage < 0 ? {width: "100%", backgroundColor: 'rgb(199, 61, 51)'} : {width: remainingPercentage + '%'}}></div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

const collect = (connect, monitor) => {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging()
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
        currentUser: state.currentUser,
        isAdmin: state.isAdmin,
        priorities: state.priorities
    }
}

export default connect(mapStateToProps)(DragSource(ItemTypes.TICKET, source, collect)(Report));