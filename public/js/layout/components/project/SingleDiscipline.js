import React from 'react';

class SingleDiscipline extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="discipline m-2 p-1 d-flex flex-row">
                <div class="discipline-name">{this.props.name}</div>
                <div class="close d-flex justify-content-center"><span class="align-self-center">X</span></div>
            </div>
        );
    }
}

export default SingleDiscipline;