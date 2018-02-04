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
            <div class="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12" id="column">
                <div id="column-name">{this.props.columnName}</div>
                {this.props.children}
            </div>
        );
    }
}

export default Column;