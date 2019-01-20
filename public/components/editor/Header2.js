import React from 'react';
import { connect } from 'react-redux';

const Header2 = (props) => {
    return(
        <div class="col-xl-12">
            <h3 class={"knbn-header-2 w-100 knbn-transition" + (props.themeToggled == true ? " knbn-dark-color-3x" : " knbn-snow-color-3x")}>
                {props.children}
            </h3>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
    }
}

export default connect(mapStateToProps)(Header2);