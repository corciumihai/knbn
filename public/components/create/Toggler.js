import React from 'react';

class Toggler extends React.Component{
    constructor(props){
        super(props);

        this.collapseSection = this.collapseSection.bind(this);
    }

    collapseSection(event){
        event.currentTarget.parentNode.querySelector(this.props.classToToggle).classList.toggle("d-none");
    }

    render(){
        return(
            <div class="mb-1" onClick={this.collapseSection}><img class="knbn-section-collapse my-auto" src="./images/collapse.svg" title='Collapse'></img></div>
        );
    }
}

export default Toggler;