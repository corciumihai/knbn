import React from 'react';
import Ticket from './Ticket';
import { DropTarget } from 'react-dnd';
import { ItemTypes } from './Constants';
import { connect } from 'react-redux';

class LaneBacklog extends React.Component{
    constructor(props){
        super(props);

        this.push = this.push.bind(this);
    }

    push = (ticket) => {
        let data = Object.assign({}, ticket, {
            lane: 'backlog'
        });
        
        this.props.push(data);
    }

    render(){
        const {canDrop, connectDropTarget} = this.props;

        return connectDropTarget(
            <div class={'column col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12 d-flex flex-column px-0'} >
                <div class={'column-name w-100 knbn-transition' + (this.props.themeToggled ? " knbn-dark-color-2x" : " knbn-snow-color-2x")}>ÎN AȘTEPTARE</div>
                <div class={'knbn-lane col pt-1 px-1 knbn-transition mb-2 knbn-border knbn-bg-transparent' + 
                    ((this.props.classes == undefined || this.props.classes.length == 0) ? '' : ' ' + this.props.classes) + 
                    (canDrop ? (this.props.themeToggled ? ' knbn-dark-ondrop' : ' knbn-snow-ondrop') : "") +
                    (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-2x")}> 
                {
                    this.props.items.map(ticket => {
                        return  <Ticket 
                                data={ticket} 
                                key={this.props.items.indexOf(ticket)}
                                helpers={this.props.helpers}
                                setError={this.props.setError}
                                refresh={this.props.refresh}
                                />
                    })
                }
                </div>
            </div>
        );
    }
}

let target = {
    drop(props, monitor, component){
        component.push(monitor.getItem());
    },

    canDrop(props, monitor){
        if(monitor.getItem().component == props.compID){
            switch(monitor.getItem().lane){
                case 'backlog': {
                    return true;
                }

                case 'done': {
                    return true;
                }

                case 'in_progress': {
                    return true;
                }
    
                default : {
                    return false;
                }
            }
        }
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(DropTarget(ItemTypes.TICKET, target, (connect, monitor) => ({connectDropTarget: connect.dropTarget(), isOver: monitor.isOver({shallow: true}), canDrop: monitor.canDrop()}))(LaneBacklog));