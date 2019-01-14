import React from 'react';
import { connect } from 'react-redux';

const RemoveItem = (props) => {
    return(
        <div class={"knbn-remover d-flex flex-row knbn-input knbn-editing-mode knbn-bg-transparent pr-0 col px-0" + (props.themeToggled ? " knbn-dark-bg-remover knbn-dark-border-2x knbn-dark-color-5x knbn-dark-onselect" : " knbn-snow-bg-remover")}>
            <div class={"d-flex pr-0 form-control knbn-border knbn-border-transparent knbn-bg-transparent" + (props.themeToggled ? "" : "")}>
                <div class={"mr-auto knbn-font-medium h-100 text-truncate" + (props.themeToggled ? " knbn-dark-color-5x" : "")}>
                    {props.children}
                </div>
                {
                props.remove != undefined ? 
                <div class="d-flex my-auto ml-2" onClick={props.remove}>
                    {
                        props.imageSrc != undefined && props.imageSrc.length > 0? 
                        <img src={props.imageSrc} class="my-auto knbn-remove-btn mr-1"/>
                        :
                        <img src="./images/close.svg" class="my-auto knbn-remove-btn mr-1"/>
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