import React from 'react';
import { DragSource } from 'react-dnd';
import { ItemTypes } from './Constants';
import axios from 'axios';
import crypto from 'crypto';
import dateformat from 'dateformat';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import LoadingRing from './LoadingRing';

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
        let ticketData = props.data;
        ticketData = Object.assign({flipped: component.state.flipped}, ticketData);

        return ticketData;
    },

    endDrag(props, monitor, component){
        props.remove(monitor.getItem());
    }
}

class Ticket extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            assignee: {},
            release: {},
            category: {},
            flipped: this.props.data.flipped,
            remainingDays: 0,
            remainingPercentage: 0,
            category: '',
            release: '',
            loadingUser: true,
            loadingCategory: true, 
            loadingRelease: true
        }

        this.flip = this.flip.bind(this);
        this.shiftForward = this.shiftForward.bind(this);
        this.shiftBackward = this.shiftBackward.bind(this);
    }

    componentDidMount(){
        if(this.props.data.assignee)
        {
            axios.get('/user/get-user-by-email/' + this.props.data.assignee).then(response => {
                this.setState({assignee: response.data, loadingUser: false});
            })
        }
        else{
            this.setState({loadingUser: false})
        }

        if(this.props.data.category){
            axios.get('/category/' + this.props.data.category).then(response => {
                this.setState({category: response.data, loadingCategory: false})
            });
        }
        else{
            this.setState({loadingCategory: false})
        }

        if(this.props.data.release){
            axios.get('/release/' + this.props.data.releaseID).then(response => {
                this.setState({release: response.data, loadingRelease: false})
            })
        }
        else{
            this.setState({loadingRelease: false})
        }

        this.setState({flipped: this.props.data.flipped})

    }

    shiftForward(){
        let data = this.props.data;
        data.flipped = this.state.flipped;
        
        this.props.helpers.forward(data);
    }

    shiftBackward(){
        let data = this.props.data;
        data.flipped = this.state.flipped;
        this.props.helpers.backward(data);
    }

    flip(){this.setState({flipped: !this.state.flipped});}

    render(){
        let loading = this.state.loadingCategory && this.state.loadingRelease && this.state.loadingUser;
        let hours = this.props.data.estimation - this.props.data.logged;
        let remainingPercentage = hours < 0 ? -1 : (this.props.data.logged / this.props.data.estimation) * 100;

        const {connectDragSource, isDragging} = this.props;

        let data = this.props.data;
        data.flipped = this.state.flipped;

        return connectDragSource(
            <div class={'col ticket-box mb-1 knbn-transition knbn-border' + 
            (this.props.themeToggled ? 
                ' knbn-dark-bg-3x knbn-dark-onselect knbn-dark-shadow-2x knbn-dark-border-4x' 
                : 
                ' knbn-snow-bg-3x knbn-snow-onselect knbn-snow-shadow-2x knbn-snow-border-4x')}>

                <div class="row">
                    <div class={(this.props.data.priority == 'low' ? "prio-1" : this.props.data.priority == 'medium' ? "prio-2" : "prio-3")} 
                    title={this.props.data.priority == 'low' ? "Prioritate mică" : this.props.data.priority == 'medium' ? "Prioritate medie" : "Prioritate înaltă"}/>

                    <div class={"ticket col px-0"}>
                        <div class="col-xl-12 d-flex px-0 flex-row">
                            <div class="col-9 flex-grow-1 pr-0">
                                <div class="col-xl-12 px-0">
                                    <div class="pt-1 field d-flex flex-row">
                                        <div title="Tichet" class="mr-2"><img src="./images/ticket.svg" class="mx-auto my-auto"/></div>

                                        <div class={"data col-xl-12 col-12 px-0 text-truncate knbn-font-16 mb-1" + (this.props.themeToggled ? " knbn-dark-color-5x" : " knbn-snow-color-5x")} title={loading ? "În așteptare..." : this.props.data.name}>
                                        {
                                            loading ? 
                                            <LoadingRing/>
                                            :
                                            this.props.data.name
                                        }
                                        </div>
                                    </div>
                                </div>
                                <div class={(this.state.flipped ? "ticket-data col-xl-12 pr-0 hide" : "ticket-data col-xl-12 pr-0")}>
                                    <div class="row field">
                                        <div class={"col-xl-4 col-4 px-0 info text-truncate" + (this.props.themeToggled ? " knbn-dark-color-3x" : " knbn-snow-color-3x")} title="Pistă">Pistă</div>

                                        <div class={"col-xl-8 col-8 px-0" + (this.props.themeToggled ? " knbn-dark-color-4x" : " knbn-snow-color-4x")} title={loading ? "În așteptare..." : this.props.data.lane}>
                                        {
                                            loading ? 
                                            <LoadingRing/>
                                            :
                                            (this.props.data.lane == "backlog" ? "Nerezolvat" : this.props.data.lane == "in_progress" ? "În progres" : this.props.data.lane == "done" ? "Completat" : "Închis")
                                        }
                                        </div>
                                    </div>

                                    <div class="row field">
                                        <div class={"col-xl-4 col-4 px-0 info text-truncate" + (this.props.themeToggled ? " knbn-dark-color-3x" : " knbn-snow-color-3x")} title="ID tichet">ID tichet</div>

                                        <div class={"px-0" + (this.props.themeToggled ? " knbn-dark-color-5x" : " knbn-snow-color-5x")}>
                                        {
                                            loading ? 
                                            <LoadingRing/>
                                            :
                                            <Link to={(this.props.data.isReport ? "/view/report/" : "/edit-ticket/") + this.props.data.id}>
                                                <div title={this.props.data.id} class={"knbn-ticket-id knbn-transition knbn-border" + (this.props.themeToggled ? ' knbn-dark-border-3x knbn-dark-color-3x knbn-dark-bg-3x-active' : ' knbn-snow-border-3x knbn-snow-color-3x knbn-snow-bg-3x-active')}>
                                                {
                                                    this.props.data.id
                                                }
                                                </div>
                                            </Link>
                                        }
                                        </div>
                                    </div>

                                    <div class="row field">
                                        <div class={"col-xl-4 col-4 px-0 info text-truncate" + (this.props.themeToggled ? " knbn-dark-color-3x" : " knbn-snow-color-3x")} title="Zi începere">Zi începere</div>

                                        <div class={"data col-xl-8 col-8 px-0 text-truncate" + (this.props.themeToggled ? " knbn-dark-color-4x" : " knbn-snow-color-4x")} title={loading ? "În așteptare..." : dateformat(new Date(parseInt(this.props.data.startDate)), "dd \u00B7 mmmm \u00B7 yyyy")}>
                                        {
                                            loading ? 
                                            <LoadingRing/>
                                            :
                                            dateformat(new Date(parseInt(this.props.data.startDate)), "dd \u00B7 mmmm \u00B7 yyyy")
                                        }
                                        </div>
                                    </div>

                                    <div class="row field">
                                        <div class={"col-xl-4 col-4 px-0 info text-truncate" + (this.props.themeToggled ? " knbn-dark-color-3x" : " knbn-snow-color-3x")} title="Zi limită">Zi limită</div>

                                        <div class={"data col-xl-8 col-8 px-0 text-truncate" + (this.props.themeToggled ? " knbn-dark-color-4x" : " knbn-snow-color-4x")} title={loading ? "În așteptare..." : dateformat(new Date(parseInt(this.props.data.dueDate)), "dd \u00B7 mmmm \u00B7 yyyy")}>
                                        {
                                            loading ? 
                                            <LoadingRing/>
                                            :
                                            dateformat(new Date(parseInt(this.props.data.dueDate)), "dd \u00B7 mmmm \u00B7 yyyy")
                                        }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class={"col-3 pt-2 px-2 d-flex" + (this.state.flipped ? " hide" : "")}>
                            {
                                this.state.assignee != undefined && this.state.assignee.email != undefined ? 
                                    loading ? 
                                    <div class="ml-auto mt-3 mr-3"><LoadingRing/></div>
                                    :
                                    <img    class={"assignee-pic ml-auto knbn-transition"} 
                                            src={'https://www.gravatar.com/avatar/' + crypto.createHash('md5').update(String(this.state.assignee.email).toLowerCase().trim()).digest('hex')} 
                                            alt={loading ? "În așteptare..." : this.state.assignee.name} title={loading ? "În așteptare..." : 'Assignee \u00B7 ' + this.state.assignee.name}/> 
                                : null
                            }
                                
                            </div>
                        </div>

                        <div class={"col-xl-12 mt-2 mb-2 d-flex flex-row justify-content-start"}>
                            <div class={"knbn-tool d-flex knbn-transition" + (this.props.themeToggled ? " knbn-dark-bg-4x knbn-dark-bg-4x-active knbn-dark-shadow-4x" : " knbn-snow-bg-4x knbn-snow-bg-4x-active knbn-snow-shadow-4x")} onClick={this.flip} title="Micșorează">
                                <img src={this.state.flipped ? "./images/collapseLight.svg" : "./images/expandLight.svg"} class={"d-block mx-auto" + (this.props.themeToggled ? ' knbn-img-inverted' : '')}/>
                            </div>
                            
                            <div class={"knbn-tool d-flex knbn-transition" + (this.props.themeToggled ? " knbn-dark-bg-4x knbn-dark-bg-4x-active knbn-dark-shadow-4x" : " knbn-snow-bg-4x knbn-snow-bg-4x-active knbn-snow-shadow-4x")} title="Schimbă pe ultima pistă"
                                    onClick={this.shiftBackward}>
                                <img src={"./images/leftArrowLight.svg"} class={"d-block mx-auto" + (this.props.themeToggled ? ' knbn-img-inverted' : '')}/>
                            </div>
                            
                            <div class={"knbn-tool d-flex knbn-transition" + (this.props.themeToggled ? " knbn-dark-bg-4x knbn-dark-bg-4x-active knbn-dark-shadow-4x" : " knbn-snow-bg-4x knbn-snow-bg-4x-active knbn-snow-shadow-4x")}  title="Schimbă pe pista urmatoare"
                                    onClick={this.shiftForward}>
                                <img src={"./images/rightArrowLight.svg"} class={"d-block mx-auto" + (this.props.themeToggled ? ' knbn-img-inverted' : '')}/>
                            </div>       

                            <Link to={(this.props.data.isReport ? "/edit-pr/" : "/edit-ticket/") + this.props.data.id}>
                                <div class={"knbn-tool d-flex knbn-transition" + (this.props.themeToggled ? " knbn-dark-bg-4x knbn-dark-bg-4x-active knbn-dark-shadow-4x" : " knbn-snow-bg-4x knbn-snow-bg-4x-active knbn-snow-shadow-4x")}>
                                    <img src={"./images/editLight.svg"} data-toggle="modal" data-target="#editModal" title="Editează tichet" class={"d-block mx-auto" + (this.props.themeToggled ? ' knbn-img-inverted' : '')}/>
                                </div>
                            </Link>

                            <div class={"knbn-days-left ml-auto mr-1 text-right d-flex" + (this.props.themeToggled ? " knbn-dark-color-3x" : " knbn-snow-color-3x")} title='Versiune'>
                            { loading ?  <LoadingRing/> :  <div class="my-auto">{this.state.release != undefined && this.state.release.name != undefined ? this.state.release.name : "Nicio versiune"}</div> }
                            </div>

                            <div class={"knbn-days-left ml-1 mr-1 text-right d-flex" + (this.props.themeToggled ? " knbn-dark-color-3x" : " knbn-snow-color-3x")} title='Categorie'>
                             { loading ? <LoadingRing/> : <div class="my-auto">{this.state.category != undefined && this.state.category.name != undefined ? this.state.category.name : "Nicio categorie"}</div> }
                            </div>

                            <div class={(this.props.themeToggled ? " knbn-dark-color-5x" : " knbn-snow-color-5x")}>
                            {
                                loading ? 
                                <LoadingRing/>
                                :
                                <a title="Ore rămase / Ore estimate" class={"knbn-ticket-id knbn-transition knbn-border" + (this.props.themeToggled ? ' knbn-dark-border-3x knbn-dark-color-3x knbn-dark-bg-3x-active' : ' knbn-snow-border-3x knbn-snow-color-3x knbn-snow-bg-3x-active')}>
                                {
                                    (this.props.data.logged + "h") + "/" + (this.props.data.estimation + "h")
                                }
                                </a>
                            }
                            </div>
                                             
                        </div>

                        <div class="col-12 px-0">
                            <div class={"knbn-comp-progress progress w-100"} title="Progres"> 
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
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(DragSource(ItemTypes.TICKET, source, collect)(Ticket));