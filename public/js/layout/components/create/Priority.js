import React from 'react';
import DropdownSearch from './DropdownSearch';

class Priority extends React.Component{
    constructor(props){
        super(props);

        this.state = {priorities: [{value: "Lowest", key: 1, img: 'low.svg'}, {value: "Medium", key: 2, img: 'neuter.svg'}, {value:"Highest", key: 3, img: 'high.svg'}]}

        this.set = this.set.bind(this)
    }

    set(item){
        this.props.set(item.key);
    }

    render(){
        return(
            <div class="row mb-2 pt-3 pb-3">
                <div class="col-xl-3 pr-0 info mb-xl-0 mb-2">
                    <div class="row d-flex h-100">
                        <div class="warning ml-3 align-self-center" title="This is a mandatory field"><img src="./images/warning.svg" class="d-block mx-auto"/></div>
                        <div class="col d-flex"><span class="align-self-center">Priority</span></div>
                    </div>
                </div>
                <div class="col-xl-4">
                    <DropdownSearch list={this.state.priorities} item={{value: this.props.item == 1 ? "Lowest" : this.props.item == 2 ? "Medium" : "Highest", 
                                                                        key: this.props.item, 
                                                                        img: this.props.item == 1 ? "low.svg" : this.props.item == 2 ? "neuter.svg" : "high.svg"}} 
                        onClick={this.set} placeholder="Select priority" />
                </div>
            </div>
        );
    }
}

export default Priority;