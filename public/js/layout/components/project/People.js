import React from 'react';

class People extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            hideRows: true,
        }
        
        this.toggleRows = this.toggleRows.bind(this);
        // this.remove = this.remove.bind(this);
    }

    toggleRows(){
        this.setState({hideRows: !this.state.hideRows})
    }

    render(){
        return(
            // People
            <div class="people col">
            </div>
        );
    }
}

export default People;