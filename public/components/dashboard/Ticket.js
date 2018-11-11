import React from 'react';
import { DragSource } from 'react-dnd';
import { ItemTypes } from './Constants';
import axios from 'axios';
import dateformat from 'dateformat';

const source = {
    beginDrag(props, monitor, component){
        let data = component.props.data;
        data.flipped = component.state.flipped;
        data.assignee = component.state.assignee;
        // console.log(data);
        return data;
    },

    endDrag(props, monitor, component){
        let dropResult = monitor.getDropResult();
        if(dropResult != undefined){if(dropResult.lane != undefined && (dropResult.lane != props.lane)){props.remove(monitor.getItem(), props.lane);}}
    }
}

@DragSource(ItemTypes.TICKET, source, (connect, monitor) => ({connectDragSource: connect.dragSource(), isDragging: monitor.isDragging()}) )
class Ticket extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            assignee: this.props.data.assignee,
            name: '',
            flipped: this.props.data.flipped != undefined ? this.props.data.flipped : false,
        }

        this.flip = this.flip.bind(this);
    }

    flip(){
        this.setState({flipped: !this.state.flipped});
    }

    componentWillMount(){
        axios.post('/conv-user', {user: this.props.data.assignee}).then(response => {
            this.setState({name: response.data.name});
        });
    }

    render(){
        let data = this.props.data;
        data.flipped = this.state.flipped;
        const {connectDragSource, isDragging} = this.props;
        let boundF = this.props.changeLaneF.bind(this, data, 1);
        let boundB = this.props.changeLaneB.bind(this, data);

        let dueDate = new Date(parseInt(data.dueDate));
        return connectDragSource(
            <div class="col ticket-box my-1 ">
                <div class="row">
                    <div class={(data.priority == 1 ? "prio-1" : data.priority == 2 ? "prio-2" : "prio-3")}/>
                    <div class={"ticket col py-2"}>
                        {/* <div class="row" */}
                        <div class="row px-2">
                            <div class="col-xl-12">
                                <div class="row py-1 field">
                                    <div class="col-xl-3 col-4 info">Name</div>
                                    <div class="data col text-truncate">{data.name}</div>
                                </div>
                            </div>
                            <div class={"ticket-data col-xl-12" + (this.state.flipped ? " hide" : "")}>
                                <div class="row py-1 field">
                                    <div class="col-xl-3 col-4 info">Ticket ID</div>
                                    <div class="col"><a href={(data.isReport ? "/view/report/" : "/view/ticket/") + data.id} class="ticket-id">{this.props.shortName.shortName + '-' + data.id}</a></div>
                                </div>
                            
                                <div class="row py-1 field">
                                    <div class="col-xl-3 col-4 info">Assignee</div>
                                    <div class="data col text-truncate">{this.state.name}
                                    </div>
                                </div>
                                <div class="row py-1">
                                    <div class="col-xl-3 col-4 info">Due date</div>
                                    <div class="data col text-truncate">{dateformat(dueDate, "dd - mmmm - yyyy")}</div>
                                </div>
                            </div>
                            <div class="col-xl-12">
                                <div class="row py-1 px-2">
                                    <div class="toolbar">
                                        <div class="row px-3">
                                            <div class="tool mx-1 my-1 d-flex" onClick={this.flip} title="Collapse size">
                                                {
                                                    this.state.flipped ? <img src="./images/arrow-down.svg" class="d-block mx-auto"/> : <img src="./images/arrow-up.svg" class="d-block mx-auto"/>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div class="toolbar">
                                        <div class="row px-3">
                                            <div class="tool mx-1 my-1 d-flex" title="Change to last lane" onClick={boundB}><img src="./images/lanechangeb.svg" class="d-block mx-auto"/></div>
                                        </div>
                                    </div>
                                    <div class="toolbar">
                                        <div class="row px-3">
                                            <div class="tool mx-1 my-1 d-flex" onClick={boundF} title="Change to next lane"><img src="./images/lanechange.svg" class="d-block mx-auto"/></div>
                                        </div>
                                    </div>
                                    <div class="toolbar">
                                        <div class="row px-3">
                                            <a href={(data.isReport ? "/view/report/" : "/view/ticket/") + data.id}>
                                                <div class="tool mx-1 my-1 d-flex">
                                                    <img src="./images/edit.svg" data-toggle="modal" data-target="#editModal" title="Edit ticket" class="d-block mx-auto"/>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
        );
    }
}

export default Ticket;