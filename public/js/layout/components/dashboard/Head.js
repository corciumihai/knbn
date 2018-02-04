import React from 'react';
import ReactDom from 'react-dom';

class Column extends React.Component{
    render(){
        console.log(this.props.data);
        return(
            <div class="col-xl-12 col-lg-12 col-md-12 col-s-12 col-xs-12" id="column">

            </div>
        );
    }
}

export default Column;