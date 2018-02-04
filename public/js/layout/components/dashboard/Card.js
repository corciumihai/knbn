import React, { ReactPropTypes } from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import {DragSource} from 'react-dnd';
import {ItemTypes} from './Constants.js';
import ChangeModal from './ChangeModal';
import InputField from './InputField';

const cardSource = {
    beginDrag(props, monitor, component){
        return component.state;
    },

    endDrag(props, monitor, component){
        var dropResult = monitor.getDropResult();
        if(dropResult && (dropResult.laneId !== component.state.laneId)){
            props.removeCard(component.state.id);
        }        
    }
}

@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({connectDragSource: connect.dragSource(), isDragging: monitor.isDragging(), }))
class Card extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            id : this.props.state.id,
            name: this.props.state.name,
            assignedTo: this.props.state.assignedTo,
            reportedBy: this.props.state.reportedBy,
            project: this.props.state.project,
            creationDate: this.props.state.creationDate,
            modifiedDate: this.props.state.modifiedDate,
            modifiedTime: this.props.state.modifyTime,
            laneId: this.props.laneId,
            description: this.props.state.description,
            toggled: this.props.state.toggled == undefined ? false : this.props.state.toggled,
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.saveState = this.saveState.bind(this);
    }

    toggleModal(){
        this.setState({showModal: !this.state.showModal});
    }

    componentWillMount(){
    }

    saveState(data){
        if(data.name)
            this.setState({name: data.name});
        if(data.id)
            this.setState({id: data.id})
        if(data.description)
            this.setState({description: data.description});
        if(data.assigned)
            this.setState({assignedTo: data.assigned});
        if(data.reporter)
            this.setState({reportedBy: data.reporter});

        this.toggleModal();
    }

    render(){
        const{connectDragSource, isDragging} = this.props;

        return connectDragSource(
            // add card text fields 
            <div id={this.state.id} class="card col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12" style={{opacity: isDragging ? 0.5 : 1}}>
                <div class="container-fluid">
                    <div class="row justify-content-end justify-content-end">
                        <div id="avatar" class="">
                            {/* <img src="./images/avatar.png" class="avatar-image"/> */}
                        </div>
                    </div>

                    <div class="row">
                        <div id="card-name" class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                            {this.state.name}
                        </div>
                    </div>    

                    <div class=" row" id="card-header">
                        <div id="card-project" class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-12"><a href="#">{this.state.project}</a></div>
                        <div id="card-id" class="col-xl-7 col-lg-7 col-md-7 col-sm-7 col-12">{this.state.id}</div>
                    </div>     
                 
                    <div id="card-details" class="row" style={{display: this.state.toggled ? "none":""}}>
                        <div class="container">
                            <InputField label="Last modified on" text={this.state.modifiedDate + " @ " + this.state.modifiedTime}/>
                            <InputField label="Assigned to" text={this.state.assignedTo} />
                            <InputField label="Reported by" text={this.state.reportedBy} />
                            <InputField label="Description" text={this.state.description} />
                        </div>
                    </div>
                    <div class="row">
                        <div class="buttons col-xl-2 col-lg-2 col-md-3 col-sm-3 col-3" id="card-toggler" onClick={()=>{this.setState({toggled: !this.state.toggled})}}>
                            <img src="./images/arrow-up.svg" style={{transform: this.state.toggled ? "rotate(180deg)": "rotate(0deg)"}}/>
                        </div>
                        <div class="buttons col-xl-2 col-lg-2 col-md-3 col-sm-3 col-3" id="card-edit" onClick={() => {this.setState({showModal: true})}}>
                            <img src="./images/edit.svg" draggable="true"/>
                        </div>
                        <div class="buttons col-xl-2 col-lg-2 col-md-3 col-sm-3 col-3" id="card-comments">
                            <img src="./images/comment.svg" draggable="true"/>
                        </div>
                        <div class="buttons col-xl-2 col-lg-2 col-md-3 col-sm-3 col-3" id="card-comments">
                            <img src="./images/level.svg" draggable="true"/>
                        </div>
                        <div class="buttons col-xl-2 col-lg-2 col-md-3 col-sm-3 col-3" id="card-comments">
                            <img src="./images/files.svg" draggable="true"/>
                        </div>
                    </div>

                    <ChangeModal state={this.state} toggleModal={this.toggleModal} saveState={this.saveState}/>
                </div>
            </div>
        );
    }
}

export default Card;