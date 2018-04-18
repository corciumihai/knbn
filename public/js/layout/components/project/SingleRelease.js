import React from 'react';

class SingleRelease extends React.Component{
    constructor(props){
        super(props);

        this.remove = this.remove.bind(this);
    }

    remove(release){
        this.props.remove(release);
    }

    render(){
        let boundClick = this.remove.bind(this, this.props.release);
        return(
            <div class="release mb-2 mr-2 p-1 d-flex flex-row">
                <div class="name">{this.props.release.name}</div>
                <div class="close d-flex justify-content-center" onClick={boundClick}><img src="./images/close.svg" class="mx-auto d-block"/></div>
            </div>
        );
    }
}

export default SingleRelease;