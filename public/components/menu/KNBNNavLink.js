import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return{
        themeToggled: state.themeToggled
    }
}

const KNBNNavLink = (props) => {
    return(
        props.onClick != undefined ? 
            <div class={"knbn-nav-link nav-link dropdown-toggle knbn-transition" + 
                (props.themeToggled ? " knbn-dark-color-2x knbn-dark-color-2x-active" 
                : 
                " knbn-snow-color-2x knbn-snow-color-2x-active")} 
                data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false" 
                onClick={props.onClick != undefined ? props.onClick : null}>
                {props.children}
            </div>
        :
            <div class={"knbn-nav-link nav-link knbn-transition" + 
                (props.themeToggled ? " knbn-dark-color-2x knbn-dark-color-2x-active"
                : 
                " knbn-snow-color-2x knbn-snow-color-2x-active")}>
                {props.children}
                {props.name}
            </div>
    );
}

export default connect(mapStateToProps)(KNBNNavLink);