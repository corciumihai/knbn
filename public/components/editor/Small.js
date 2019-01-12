import React from 'react';
import { connect } from 'react-redux';

const Small = (props) => {
    return(
        <small id="knbnHelp" class={"knbn-edit-help form-text text-muted knbn-bg-transparent" + 
        (props.themeToggled ? " knbn-dark-color-2x" : " knbn-snow-color-2x")}>
            {props.children}
        </small>
    );
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(Small);