import React from 'react';

class Topnav extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        console.log(this.props.lane);
        return(
            <nav class="nav top-nav">
                {
                    this.props.lane == 0 ?  <a class="nav-link top-nav-item" href="#">Start progress</a> :
                     this.props.lane == 1 ? <a class="nav-link top-nav-item" href="#">Realize work</a> : 
                                            <a class="nav-link top-nav-item" href="#">Close ticket</a>
                }
                
            </nav>
        );
    }
}

export default Topnav;