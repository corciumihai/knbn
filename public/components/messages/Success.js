import React from 'react';
import { connect } from 'react-redux';

const Success = (props) => {
    return(
        props.children ? 
        <div class={"col-xl-12 knbn-error text-center mb-2" + (props.themeToggled ? " knbn-dark-success-color knbn-dark-bg-success" : " knbn-snow-success-color knbn-snow-bg-success")}>
            {props.children}
        </div>
        : 
        null
    )
}

const mapStateToProps = (state) => {
    return{
        themeToggled: state.themeToggled,
    }
}

export default connect(mapStateToProps)(Success);