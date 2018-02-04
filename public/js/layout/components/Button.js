import React from 'react';

class Button extends React.Component{
    constructor(props){
        super(props);
    }
    
    render(){
        return(
            <button 
                id={this.props.id} 
                type={this.props.type} 
                class="btn btn-primary col-12" 
                data-toggle="tooltip" 
                data-placement="right" 
                title="Press me to login!">
                    {this.props.text} 
            </button>
        );
    }
}

export default Button;