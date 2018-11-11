import React from 'react';

class StatusDropdown extends React.Component{
    constructor(props){
        super(props);

        this.setLane = this.setLane.bind(this);
    }

    setLane(lane, event){
        event.preventDefault();
        this.props.set(lane);
    }

    render(){
        let backlog = this.setLane.bind(this, 0);
        let progress = this.setLane.bind(this, 1);
        let done = this.setLane.bind(this, 2);
        let closed = this.setLane.bind(this, 3);
        return(
            <div class="col ticket-data modifiable py-1">
                <div class="row" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {
                        this.props.lane == 0 ? <div class="edit-field ml-1" title="Status"><img src="/images/lane1.svg" class="d-block mx-auto float-left"/></div> : 
                        this.props.lane == 1 ? <div class="edit-field ml-1" title="Status"><img src="/images/lane.svg" class="d-block mx-auto float-left"/></div> : 
                        this.props.lane == 2 ? <div class="edit-field ml-1" title="Status"><img src="/images/lane.svg" class="d-block mx-auto float-left"/></div> :
                        <div class="edit-field ml-1" title="Status"><img src="/images/lane.svg" class="d-block mx-auto float-left"/></div>
                        
                    }
                    {
                        this.props.lane == 0 ? <div class="col">In backlog</div> : 
                        this.props.lane == 1 ? <div class="col">In progress</div> : 
                        this.props.lane == 2 ? <div class="col">Done</div> :
                        <div class="col">Closed</div>
                    }
                    {
                        this.props.lane == 3?
                        null
                        :
                        <div class="edit-field mr-1 float-right"><img src="/images/arr-dwn.svg" class="d-block mx-auto"/></div>
                    }
                    
                </div>
                {
                    this.props.lane == 0 ?  <div class="dropdown-menu tag w-100 modifiable">
                                                <a class="dropdown-item text-truncate" href="#" onClick={progress} ><img src="/images/lane.svg" class="d-block mx-auto float-left"/>In progress</a>
                                                <a class="dropdown-item text-truncate" href="#" onClick={closed} ><img src="/images/lane.svg" class="d-block mx-auto float-left"/>Closed</a>
                                            </div>
                    :
                    this.props.lane == 1 ?  <div class="dropdown-menu tag w-100 modifiable">
                                                <a class="dropdown-item text-truncate" href="#" onClick={backlog} ><img src="/images/lane1.svg" class="d-block mx-auto float-left"/>In backlog</a>
                                                <a class="dropdown-item text-truncate" href="#" onClick={done} ><img src="/images/lane.svg" class="d-block mx-auto float-left"/>Done</a>
                                                <a class="dropdown-item text-truncate" href="#" onClick={closed} ><img src="/images/lane.svg" class="d-block mx-auto float-left"/>Closed</a>
                                            </div>
                    :
                    this.props.lane == 2 ?  <div class="dropdown-menu tag w-100 modifiable">
                                                <a class="dropdown-item text-truncate" href="#" onClick={backlog} ><img src="/images/lane1.svg" class="d-block mx-auto float-left"/>In backlog</a>
                                                <a class="dropdown-item text-truncate" href="#" onClick={done} ><img src="/images/lane.svg" class="d-block mx-auto float-left"/>Done</a>
                                                <a class="dropdown-item text-truncate" href="#" onClick={closed} ><img src="/images/lane.svg" class="d-block mx-auto float-left"/>Closed</a>
                                            </div>
                    :                       null
                                            

                }
            </div>
        );
    }
}

export default StatusDropdown;