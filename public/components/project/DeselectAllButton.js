import React from 'react';

class DeselectAllButton extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            // <div class="col-xl-12 col-12 mb-2">
            <button type="submit" class="button btn mb-2" onClick={this.props.deselect}>Deselect all</button>
            // </div>
        );
    }
    

}

export default DeselectAllButton;