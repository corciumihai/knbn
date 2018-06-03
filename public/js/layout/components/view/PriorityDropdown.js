import React from 'react';

class PriorityDropdown extends React.Component{
    constructor(props){
        super(props);
    }

    setPrio(prio, event){
        event.preventDefault();
        this.props.set(prio);
    }

    render(){
        let bindLow = this.setPrio.bind(this, {id: 1});
        let bindMed = this.setPrio.bind(this, {id: 2});
        let bindHigh = this.setPrio.bind(this, {id: 3});
        return(
            <div class="col ticket-data modifiable py-1">
                <div class="row" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {
                        this.props.prio == 1 ? <div class="edit-field ml-1" title="Priority"><img src="/images/low.svg" class="d-block mx-auto float-left"/></div> : 
                        this.props.prio == 2 ? <div class="edit-field ml-1" title="Priority"><img src="/images/neuter.svg" class="d-block mx-auto float-left"/></div> : 
                        this.props.prio == 3 ? <div class="edit-field ml-1" title="Priority"><img src="/images/high.svg" class="d-block mx-auto float-left"/></div> : 
                        <div class="col text-truncate">"Select priority"</div>
                    }
                    {
                        this.props.prio == 1 ? <div class="col">Low</div> : 
                        this.props.prio == 2 ? <div class="col">Medium</div> : 
                        this.props.prio == 3 ? <div class="col">High</div> : 
                        <div class="col text-truncate">"Select priority"</div>
                    }
                    <div class="edit-field mr-1 float-right"><img src="/images/arr-dwn.svg" class="d-block mx-auto"/></div>
                </div>
                <div class="dropdown-menu tag w-100 modifiable">
                    <a class="dropdown-item text-truncate" href="#" onClick={bindLow}><img src="/images/low.svg" class="d-block mx-auto float-left"/>Low</a>
                    <a class="dropdown-item text-truncate" href="#" onClick={bindMed}><img src="/images/neuter.svg" class="d-block mx-auto float-left"/>Medium</a>
                    <a class="dropdown-item text-truncate" href="#" onClick={bindHigh}><img src="/images/high.svg" class="d-block mx-auto float-left"/>High</a>
                </div>
            </div>
        );
    }
}

export default PriorityDropdown;