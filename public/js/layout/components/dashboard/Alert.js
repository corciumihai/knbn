import React from 'react';

class Alert extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="row">
                <div class="col create-card-error-message">
                    {this.props.message || this.props.message.length ? 
                        "*" + this.props.message
                    :
                    null}
                </div>
            </div>
        );
    }
}

export default Alert;