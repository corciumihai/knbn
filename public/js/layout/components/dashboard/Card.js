import React, { ReactPropTypes } from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import {DragSource} from 'react-dnd';
import {ItemTypes} from './Constants.js';
// import ChangeModal from './ChangeModal';
// import InputField from './InputField';

const cardSource = {
    beginDrag(props, monitor, component){
        let data = component.props.state;
        data.toggled = component.state.toggled;
        return data;
    },

    endDrag(props, monitor, component){
        var dropResult = monitor.getDropResult();
        if(dropResult && (dropResult.lane != props.laneID)){
            props.removeCard(monitor.getItem().id);
        }        
    }
}

@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({connectDragSource: connect.dragSource(), isDragging: monitor.isDragging(), }))
class Card extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            toggled: this.props.state.toggled != undefined ? this.props.state.toggled : false,
        }

        this.toggleModal = this.toggleModal.bind(this);
    }

    toggleModal(){
        this.setState({showModal: !this.state.showModal});
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
                            {this.props.state.name}
                        </div>
                    </div>    

                    <div class=" row" id="card-header">
                        <div id="card-project" class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-12"><a href="#">{this.props.state.project}</a></div>
                        <div id="card-id" class="col-xl-7 col-lg-7 col-md-7 col-sm-7 col-12">{this.props.state.id}</div>
                    </div>     
                 
                    <div id="card-details" class="row" style={{display: this.state.toggled ? "none":""}}>
                        <div class="container">
                            {/* <InputField id={this.props.state.id} label="Assigned to" text={this.props.state.assignee} />
                            <InputField id={this.props.state.id} label="Reported by" text={this.props.state.reporter} />
                            <InputField id={this.props.state.id} label="Description" text={this.props.state.description} /> */}
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

                    {/* <ChangeModal state={this.state} toggleModal={this.toggleModal} saveState={this.saveState}/> */}
                </div>
            </div>
        );
    }
}

export default Card;