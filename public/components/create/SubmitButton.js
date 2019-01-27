import React from 'react';
import { connect } from 'react-redux';

const SubmitButton = (props) => {
    return(
        <button class={"btn btn-primary mr-2 knbn-border knbn-font-medium knbn-no-border-radius knbn-no-box-shadow" + (props.themeToggled ? " knbn-dark-bg-2x knbn-dark-color-2x knbn-dark-border-2x knbn-dark-onselect" : " knbn-snow-bg-2x knbn-snow-color-2x knbn-snow-border-2x knbn-snow-onselect")} 
        onClick={props.action}>
            {props.children}
        </button>
    );
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(SubmitButton);