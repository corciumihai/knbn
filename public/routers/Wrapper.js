import React from 'react';
import { connect } from 'react-redux';

const Wrapper = (props) => {
    return (
        <div class={"container-fluid px-0 knbn-bg-transparent knbn-transition pb-3" + (props.themeToggled ? " knbn-dark-bg-1x" : " knbn-snow-bg-1x")}>
            {props.children}
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(Wrapper);