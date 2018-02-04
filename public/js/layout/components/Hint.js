import React from 'react';

class Hint extends React.Component{
    render(){
        return(
            <small 
                id={this.props.id} 
                class="form-text">
                    {this.props.children}
            </small>
        );
    }
}

Hint.defaultProps = {
    id: undefined,
    class: "form-text text-muted"
}

export default Hint;
