import React from 'react';
import {DropTarget} from 'react-dnd';
import {ItemTypes} from './Constants';
import CardList from './CardList';


class Column extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="column col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12" >
                <div class="row">
                    <div class="column-name col mt-1">{this.props.name}
                    </div>
                </div>
                <div class="row">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Column;