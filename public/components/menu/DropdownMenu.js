import React from 'react';
import {connect} from 'react-redux';

const DropdownMenu = (props) => {
    return(
        <div class={"knbn-dropdown-menu dropdown-menu knbn-bg-transparent knbn-transition" + 
            (props.themeToggled ? 
                " knbn-dark-bg-2x knbn-dark-color-2x knbn-dark-border-2x" 
                : 
                " knbn-snow-bg-2x knbn-snow-color-2x knbn-snow-border-2x") + (props.classes != undefined ? " " + props.classes : "")}>
            {props.children}
        </div>
    );
}

const mapStateToProps = (state) => {
    return{
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(DropdownMenu);