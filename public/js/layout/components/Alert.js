import React from 'react';

class Alert extends React.Component{
    render(){
        if(this.props.text.length > 0)
        {
            return(
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    {this.props.text}
                </div>
            );
        }
        else{
            return(null);
        }
    }
}

export default Alert;