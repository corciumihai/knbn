import React from 'react';

class Caret extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="caret btn mr-2">
                <img src="./images/arrow-down-inverted.svg" class="d-block mx-auto"/>
            </div>
        );
    }
}

export default Caret;