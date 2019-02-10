import React from 'react';
import { connect } from 'react-redux';

const LoadingBar = (props) => {
    return(
        <div class="my-auto py-1 d-flex">
            {/* <div class={"ld ld-ring ld-spin" + (props.themeToggled ? " " : " ")}></div> */}
            <div class={"w-100 knbn-loading my-auto" + (props.themeToggled ? " knbn-dark-bg-4x" : " knbn-snow-bg-2x")}></div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(LoadingBar);