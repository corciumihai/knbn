import React from 'react';
import Ticket from './Ticket';
import { DropTarget } from 'react-dnd';
import { ItemTypes } from './Constants';
import update from 'react-addons-update';
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

    canDrop(props, monitor, component){return true;} // can change lanes without limitation - TEMPORARY
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
            <div class={isOver ? "lane col is-over": "lane col"}> 
            {
                this.props.loading ?
                    <img src="./images/loading.gif" class="d-block mx-auto"/>
                :
                    this.props.items.map(ticket => {
                        return <Ticket data={ticket} key={ticket.id} remove={this.props.remove} lane={this.props.lane} changeLaneF={this.props.changeLaneF} changeLaneB={this.props.changeLaneB}
                            edit={this.props.edit}/>
                    })
                    
            }
            </div>
        );
    }
}

export default Lane;