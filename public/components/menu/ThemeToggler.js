import React from 'react';
import { connect, dispatch } from 'react-redux';

const mapStatetoProps = (state) => {
    return {
        themeToggled: state.themeToggled
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleTheme: () => {
            dispatch({
                type: 'THEME_TOGGLE',
            });
        }
    }
}

const ThemeToggler = (props) => {    
    return(
        <div class="mx-2">
            <div class={"w-100 text-center knbn-font-small" + 
                (props.themeToggled ? 
                    " knbn-dark-color-2x" 
                    : 
                    " knbn-snow-color-3x")}>
                    Dark mode
            </div>
            <div    type="button" class={"mx-auto" + (props.themeToggled == false ? " knbn-toggler" : " knbn-toggler knbn-toggler-light knbn-toggler-toggled")} 
                    title={props.themeToggled ? "Toggle snow theme" : "Toggle dark theme"} 
                    onClick={props.toggleTheme}>
                <div class={"knbn-transition" + (props.themeToggled == false ? " knbn-toggler-handle" : " knbn-toggler-handle knbn-toggler-light-handle ml-auto")}></div>
            </div>
        </div>
    );
}

export default connect(mapStatetoProps, mapDispatchToProps)(ThemeToggler);