import React from 'react';

class EditForm extends React.Component{
    constructor(props){
        super(props);

    }

    render(){
        return(
            <form class={this.props.classes}>
                {this.props.children}
            </form>
        );
    }
}

export default EditForm;