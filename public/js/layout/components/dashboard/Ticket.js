import React from 'react';
import { DragSource } from 'react-dnd';
import { ItemTypes } from './Constants';
import axios from 'axios';

const source = {
    beginDrag(props, monitor, component){
        return component.props.data;
    },

    endDrag(props, monitor, component){
        let dropResult = monitor.getDropResult();
        // move only when lanes are different and component id the same
        if(dropResult != undefined){if(dropResult.lane != undefined && (dropResult.lane != props.lane)){props.remove(monitor.getItem());}}
        // else{console.log('cant drop');}
    }
}

@DragSource(ItemTypes.TICKET, source, (connect, monitor) => ({connectDragSource: connect.dragSource(), isDragging: monitor.isDragging()}) )
class Ticket extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            reporter: {},
            assignee: {}
        }
    }

    componentWillMount(){
        axios.get('/conv-user', {params: {user: this.props.data.reporter}}).then(response => {
            this.setState({reporter: response.data});
        });

        axios.get('/conv-user', {params: {user: this.props.data.assignee}}).then(response => {
            this.setState({assignee: response.data});
        });
    }

    render(){
        let data = this.props.data;
        const {connectDragSource, isDragging} = this.props;
        return connectDragSource(
            <div class={"ticket col px-2 py-2" + (data.priority == 1 ? " prio-1" : data.priority == 2 ? " prio-2" : " prio-3")}>
                <div class="row">
                    <div class="col">
                        <div class="ticket-data container-fluid px-2 py-2">
                            <div class="row field">
                                <div class="col-xl-3 col-4 info">Ticket ID</div>
                                <div class="col"><a class="ticket-id" href="#">{"ProjectID - " + data.id}</a></div>
                            </div>
                            <div class="row field py-1">
                                <div class="col-xl-3 col-4 info">Name</div>
                                <div class="data col text-truncate">{data.name}</div>
                            </div>
                            <div class="row field py-1">
                                <div class="col-xl-3 col-4 info">Reporter</div>
                                <div class="data col text-truncate"><a class="ticket-id" href="#">{this.state.reporter.name}</a></div>
                            </div>
                            <div class="row field">
                                <div class="col-xl-3 col-4 info">Assignee</div>
                                <div class="data col text-truncate"><a class="ticket-id" href="#">{this.state.assignee.name}</a></div>
                            </div>

                            <div class="row">
                                <div class="col toolbar py-3"></div>
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
        );
    }
}

export default Ticket;