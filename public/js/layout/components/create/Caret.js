import React from 'react';

class Caret extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <img src="./images/arrow-down-inverted.svg" class="caret float-right"/>
        );
    }
}

export default Caret;