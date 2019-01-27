import React from 'react';
import { connect } from 'react-redux';

const Container = (props) => {
    return(
        <div class={"col knbn-border py-2 mb-2 knbn-bg-transparent" + (props.themeToggled ? " knbn-dark-bg-2x knbn-dark-border-2x" : " knbn-snow-bg-2x knbn-snow-border-2x")}>
        {
            props.children
        }
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(Container);