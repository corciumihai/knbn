import React from 'react';

class SelectAllButton extends React.Component{
    constructor(props){
        super(props);
    }


    render(){
        return(
            // <div class="col-xl-12 col-12 mb-2">
            <button type="submit" class="button btn mb-2 ml-2" onClick={this.props.select}>Select all</button>
            // </div>
        );
    }
    

}

export default SelectAllButton;