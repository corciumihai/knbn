import React from 'react';
import Ticket from './Ticket';
import { DropTarget } from 'react-dnd';
import { ItemTypes } from './Constants';
import axios from 'axios';

const target = {
    drop(props, monitor, component){
        //get ticket data
        let ticket = monitor.getItem();
        // check component id
        if(ticket.lane != props.lane && ticket.component == props.comp){
            ticket.lane = props.lane;
            // change ticket lane id TBD
            props.push(ticket);
            props.changeLaneF(ticket);
            return {lane: props.lane, component: props.comp};
        }  
    },

    canDrop(props, monitor){
        let ticketLane = monitor.getItem().lane;        
        if(props.wip != undefined)
            if(props.items.length == props.wip) return false;

        if(ticketLane == 'backlog'){
            if(props.lane == 'in_progress' || props.lane == 'closed') return true;
        }

        if(ticketLane == 'in_progress'){
            if(props.lane == 'in_progress') return false;
            return true;
        }

        if(ticketLane == 'done'){
            if(props.lane == 'in_progress' || props.lane == 'done' || props.lane == 'closed') return true;
        }

        return false;
    } // can change lanes without limitation - TEMPORARY
}

@DropTarget(ItemTypes.TICKET, target, (connect, monitor) => ({connectDropTarget: connect.dropTarget(), isOver: monitor.isOver({shallow: true}), canDrop: monitor.canDrop()}))
class Lane extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        const {isOver, canDrop} = this.props;
        const {connectDropTarget} = this.props;
        return connectDropTarget(
            <div class={canDrop ? "lane col can-drop p-1": "lane col p-1"}> 
            {
                this.props.loading ?
                    <img src="./images/loading.gif" class="d-block mx-auto"/>
                    :
                    this.props.items.map(ticket => {
                        let name;
                        return <Ticket data={ticket} key={ticket.id} remove={this.props.remove} lane={this.props.lane} changeLaneF={this.props.changeLaneF} changeLaneB={this.props.changeLaneB}
                        edit={this.props.edit} shortName = {this.props.shortName} name={name}/>
                    })
                    
            }
            </div>
        );
    }
}

export default Lane;