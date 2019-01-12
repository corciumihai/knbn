import React from 'react';
import { connect } from 'react-redux';

const Header3 = (props) => {
    return(
        <h3 class={"knbn-header-3 w-100" + (props.themeToggled == true ? " knbn-dark-color-3x" : " knbn-snow-color-3x")}>
            {props.children}
        </h3>
    );
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
    }
}

export default connect(mapStateToProps)(Header3);