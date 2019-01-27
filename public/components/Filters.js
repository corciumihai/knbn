import React from 'react';
import {connect} from 'react-redux';

class Filters extends React.Component{
    constructor(){
        super();
    }

    render(){
        return(
            <div class="row mb-3">
                <div class={"col-xl-12 d-flex flex-row py-2" + (this.props.themeToggled ? " knbn-dark-bg-2x" : " knbn-snow-bg-2x")}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return{
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(Filters);
