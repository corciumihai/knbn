import React from 'react';

class AddButton extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="col-xl-12 col-12 mb-2">
                <button type="submit" class="button btn button col-xl-2 col-12" onClick={this.props.add}>Add person</button>
            </div>
        );
    }
}

export default AddButton;