import React from 'react';
import { DragSource } from 'react-dnd';
import { ItemTypes } from './Constants';

const source = {
    beginDrag(props, monitor, component){
        return component.props.data;
    },

    endDrag(props, monitor, component){
        let dropResult = monitor.getDropResult();
        // move onyl is lanes are different
        if(dropResult && (dropResult.lane != props.lane)){props.remove(monitor.getItem());}
    }
}

@DragSource(ItemTypes.TICKET, source, (connect, monitor) => ({connectDragSource: connect.dragSource(), isDragging: monitor.isDragging()}) )
class Ticket extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        let data = this.props.data;
        const {connectDragSource, isDragging} = this.props;
        return connectDragSource(
            // <div class="row">
                <div class="ticket px-2 py-2 w-100">{data.name}</div>
            // </div>
        );
    }
}

export default Ticket;