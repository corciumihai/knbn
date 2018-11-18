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
            
        );
    }
}

export default Priority;