import React from 'react';

class SingleType extends React.Component{
    constructor(props){
        super(props);

        this.remove = this.remove.bind(this);
    }

    remove(discipline){
        this.props.remove(discipline);
    }

    render(){
        let boundClick = this.remove.bind(this, this.props.discipline);
        return(
            <div class="discipline mb-2 mr-2 p-1 d-flex flex-row">
                <div class="name">{this.props.discipline.name}</div>
                <div class="close d-flex justify-content-center" onClick={boundClick}><img src="./images/close.svg" class="mx-auto d-block"/></div>
            </div>
        );
    }
}

export default SingleType;