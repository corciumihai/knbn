import React from 'react';
import Ticket from './Ticket';
import { DropTarget } from 'react-dnd';
import { ItemTypes } from './Constants';
import update from 'react-addons-update';

const target = {
    drop(props, monitor, component){
        //get ticket data
        let ticket = monitor.getItem();

        if(ticket.lane != props.lane){
            ticket.lane = props.lane;

            // change ticket lane id TBD
            props.push(ticket);
            // component.sortTickets();
        }
        return {lane: props.lane};
    },

    canDrop(props, monitor, component){return true;} // can change lanes 
}

@DropTarget(ItemTypes.TICKET, target, (connect, monitor) => ({connectDropTarget: connect.dropTarget(), isOver: monitor.isOver({shallow: true}), canDrop: monitor.canDrop()}))
class Lane extends React.Component{
    constructor(props){
        super(props);

        this.state = {tickets: []}

        // this.sortTickets = this.sortTickets.bind(this);
    }

    // sortTickets(){
    //     this.setState({tickets: update(this.state.tickets, {$set: this.state.tickets.sort((a, b) => {
    //         if(a.id , b.id) return -1;
    //         if(a.id > b.id) return 1;
    //         return 0;
    //     })})});
    // }

    render(){
        const {isOver, canDrop} = this.props;
        const {connectDropTarget} = this.props;
        return connectDropTarget(
            <div class={isOver ? "lane col is-over": "lane d-flex flex-column col"}> 
            {
                this.props.items.length > 0 ?
                this.props.items.map(ticket => {
                    return <Ticket data={ticket} key={ticket.id} remove={this.props.remove} lane={this.props.lane}/>
                })
                :
                null
            }
            </div>
        );
    }
}

export default Lane;