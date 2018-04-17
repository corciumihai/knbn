import React from 'react';

class Button extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <button type="submit" class="button btn mb-2 col-xl-12 col-md-12" onClick={this.props.onclick}>{this.props.text}</button>
        );
    }
}

export default Button;