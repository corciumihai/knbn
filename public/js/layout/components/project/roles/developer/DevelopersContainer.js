import React from 'react';

class DevelopersContainer extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="col-xl-12 col-12">
                <div class="container-fluid" style={this.props.isVisible ? {display: ""} : {display: "none"}}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default DevelopersContainer;