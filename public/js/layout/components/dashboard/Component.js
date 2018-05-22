import React from 'react';
// import Column from './Column';
// import Card from './Card';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Backlog from './Backlog';
import Progress from './Progress';
import Done from './Done';
import Closed from './Closed';

@DragDropContext(HTML5Backend)
class Component extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        return(
            
        );
    }
}

export default Component;
