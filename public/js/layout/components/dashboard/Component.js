import React from 'react';
import Column from './Column';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

@DragDropContext(HTML5Backend)
class Component extends React.Component{
    constructor(props){
        super(props);

        this.state = {flip: false}

        this.toggle = this.toggle.bind(this);
    }

    toggle(){
        this.setState({flip: !this.state.flip});
    }

    render(){
        return(
            <div class="row">
                <div class="section col-xl-10 col-lg-10 col-md-10 col-sm-10 col-12 offset-xl-1 offset-lg-1 offset-md-1 offset-sm-1 px-2 mt-2">
                    <div class="row">
                        <div class="section-head col-xl-12 py-2">
                            <div class="row">
                                <div class="px-3"><div class="toggle d-flex" onClick={this.toggle}>
                                    <img src={!this.state.flip ? "./images/close.svg" : "./images/show.svg"} class="d-block mx-auto"/></div></div> 
                                <div class="col">{this.props.name}</div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class={"section-body col " + (this.state.flip ? "reduce" : "")}>
                            <div class="row">
                            <Column name={"BACKLOG"} compId={this.props.id} lane={0}/>
                            <Column name={"IN PROGRESS"} compId={this.props.id} lane={1}/>
                            <Column name={"DONE"} compId={this.props.id} lane={2}/>
                            <Column name={"CLOSED"} compId={this.props.id} lane={3}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Component;