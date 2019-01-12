import React from 'react';
import { connect } from 'react-redux';

const Error = (props) => {
    return(
        props.children != undefined && props.children.length > 0 ? 
            <div class={"knbn-error" + (props.themeToggled ? " knbn-dark-error-color" : " knbn-snow-error-color")}>
                <div class={"col-12" + (props.themeToggled ? " knbn-dark-bg-error" : " knbn-snow-bg-error")}>{props.children}</div>
            </div>
            : null
    )
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(Error);