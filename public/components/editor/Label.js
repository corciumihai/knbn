import React from 'react';
import {connect} from 'react-redux';

const Label = (props) => {
    return(
        <label for="knbnFieldLabel" class={"knbn-edit-field knbn-bg-transparent knbn-transition" + 
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