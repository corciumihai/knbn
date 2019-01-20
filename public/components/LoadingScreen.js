import React from 'react';
import { connect } from 'react-redux';

const LoadingScreen = (props) => {
    return(
        <div class="flex-grow-1 d-flex flex-column">
            <img class="mx-auto mt-auto" src="./images/rolling-2x.svg"/>
            <div class={"mb-auto mx-auto knbn-font-small" + (props.themeToggled ? " knbn-dark-color-2x" : " knbn-snow-color-2x")}>Se încarcă...</div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(LoadingScreen);