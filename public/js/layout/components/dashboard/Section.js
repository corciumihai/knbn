import React from 'react';
import Column from './Column';
import Card from './Card';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

@DragDropContext(HTML5Backend)
class Section extends React.Component{

    constructor(props){
        super(props);
        
        this.state = {
            toggled: false,
        }

        this.toogleHeight = this.toogleHeight.bind(this);
    }

    toogleHeight(event){
        parent = event.target.parentElement;
        while(parent.id != "section"){
            parent = parent.parentElement;
        }

        if(this.state.toggled === false){
            parent.querySelector('#card-pool').style.display = "none";
            event.target.style.transform = "rotate(180deg)";
        }
        else{
            parent.querySelector('#card-pool').style.display = "inline-block";
            event.target.style.transform = "rotate(0deg)";
        }
        this.setState({toggled: !this.state.toggled});
        
    }

    render(){
        return(
            <div class="row">
                <div class="col-xl-10 col-lg-10 col-md-10 col-sm-10 col-12 offset-xl-1 offset-lg-1 offset-md-1 offset-sm-1" id="section">
                    <div class="container-fluid" id="section-head">
                        <div class="row">
                            <div class="col">
                                <div class="section-toggler" onClick={this.toogleHeight}><img src="./images/arrow-up.svg"/></div>
                                <div class="section-name">{this.props.name}</div>
                            </div>
                        </div>
                    </div>
                    <div class="container-fluid" id="card-pool">
                        <div class="row">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Section;
