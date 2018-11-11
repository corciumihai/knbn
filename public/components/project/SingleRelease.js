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
        let startDate = new Date(this.props.release.startDate);
        let endDate = new Date(this.props.release.endDate);
        return(
            <div class="release mb-2 mr-2 p-1 d-flex flex-row" title="">
                <div class="mr-1">
                    <div class="name col">{this.props.release.name}</div>
                    {/* <div class="timestamp d-flex flex-column">
                        <div class="mb-1">{startDate.getDate()}-{startDate.getMonth() + 1}-{startDate.getFullYear()}</div>
                        <div>{endDate.getDate()}-{endDate.getMonth() + 1}-{endDate.getFullYear()}</div>
                    </div> */}
                </div>
                <div class="close d-flex" onClick={boundClick}><img src="./images/close.svg" class="mx-auto d-block"/></div>
            </div>
        );
    }
}

export default SingleRelease;