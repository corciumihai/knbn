import React from 'react';
import {connect} from 'react-redux';

const TouchButtonRight = (props) => {
    return(
        <div class="knbn-font-small ml-auto">
            <a  href="" 
                onClick={(props.action != undefined ? props.action : null)} 
                class={"knbn-self-assign knbn-edit-field w-100 px-2 py-1 knbn-transition" + 
                (props.themeToggled == true ? 
                " knbn-dark-color-3x knbn-dark-color-3x-active" 
                : 
                " knbn-snow-color-3x knbn-snow-color-3x-active")}>
                    {props.children}
                </a>
        </div> 
    );
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(TouchButtonRight);