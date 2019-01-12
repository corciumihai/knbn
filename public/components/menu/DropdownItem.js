import React from 'react';
import { connect } from 'react-redux';

const DropdownItem = (props) => {
    return(
        <div class={"knbn-dropdown-item dropdown-item knbn-transition knbn-bg-transparent d-flex flex-row text-truncate col-12" + 
            (props.themeToggled ? 
                " knbn-dark-bg-2x knbn-dark-color-3x knbn-dark-color-4x-active knbn-dark-bg-2x-active" 
                : 
                " knbn-snow-bg-2x knbn-snow-color-3x knbn-snow-color-4x-active knbn-snow-bg-2x-active")}>
                {
                    props.imgSrc != undefined ? <div class="d-flex"><img class="mr-2" src={props.imgSrc}/></div> : null    
                }
            {props.children}
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(DropdownItem);