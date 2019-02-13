import React from 'react';
import { connect } from 'react-redux';

const RemoveItem = (props) => {
    return(
        <div class={"knbn-remover d-flex flex-row knbn-input knbn-editing-mode knbn-bg-transparent pr-0 col px-0 knbn-border knbn-border-transparent knbn-transition" + 
        (props.themeToggled ? " knbn-dark-bg-remover knbn-dark-border-2x knbn-dark-color-5x" : " knbn-snow-bg-remover knbn-snow-border-3x knbn-snow-color-5x") + 
        (props.classes != undefined ? " " + props.classes : "")}>
            <div class={"d-flex pr-0 knbn-font-medium form-control knbn-no-border knbn-border-transparent knbn-bg-transparent knbn-transition" + (props.themeToggled ? " knbn-dark-color-5x" : " knbn-snow-color-5x")}>
                <div class={"mr-auto" + (props.mute ? " knbn-muted" : "")}>
                    {props.children}
                </div>
                {
                props.remove && (props.canEdit)? 
                <div class="d-flex my-auto ml-2 knbn-transition" onClick={props.remove}>
                    {
                        <img src={props.themeToggled ? "./images/remove.svg" : "./images/bRemove.svg"} class={"my-auto knbn-remove-btn mr-1"}/>
                    }
                </div>
                : null
                }
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
    }
}

export default connect(mapStateToProps)(RemoveItem);