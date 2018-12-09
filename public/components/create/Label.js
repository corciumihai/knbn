import React from 'react';

class Label extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="label col-xs-12 col-sm-12 d-flex">
                <div class="flex-grow-1">{this.props.label}</div>
            </div>
        );
    }
}

export default Label;