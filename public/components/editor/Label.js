import React from 'react';
import {connect} from 'react-redux';

const Label = (props) => {
    return(
        <label class={"knbn-edit-field knbn-bg-transparent knbn-transition col px-0" + 
        (props.themeToggled == true ? " knbn-dark-color-3x" : " knbn-snow-color-3x")}>
            {props.label}
        </label>
    );
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(Label);