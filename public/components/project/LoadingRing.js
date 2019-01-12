import React from 'react';
import { connect } from 'react-redux';

const LoadingRing = (props) => {
    return(
        <div class="my-auto">
            <div class={"ld ld-ring ld-spin" + (props.themeToggled ? " " : " ")}></div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(LoadingRing);