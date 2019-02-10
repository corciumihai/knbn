import React from 'react';
import { connect } from 'react-redux';

const Filter = (props) => {
    return(
        <div class={"d-flex flex-row knbn-font-small knbn-pointer knbn-border knbn-border-radius-50 mr-2 knbn-transition mb-1" + 
        (props.themeToggled ? " knbn-dark-color-2x knbn-dark-border-2x" : " knbn-snow-border-2x knbn-snow-color-2x") + 
        (props.trigger ? " knbn-remember knbn-dark-color-5x" : "")} 
            onClick={props.action}>
            <div>
                <img src={!props.trigger ? props.themeToggled || props.trigger ? "./images/save.svg" : "./images/bSave.svg" : props.themeToggled || props.trigger? "./images/remove.svg" : "./images/bRemove.svg"} class={"ml-1 my-auto"}/> 
            </div>
            
            <div class="ml-1 mr-2 my-auto d-flex">{props.children}</div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
    }
}

export default connect(mapStateToProps)(Filter);