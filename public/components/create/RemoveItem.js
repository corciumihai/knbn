import React from 'react';
import { connect } from 'react-redux';

const RemoveItem = (props) => {
    return(
        <div class={"knbn-remover d-flex flex-row knbn-input knbn-editing-mode knbn-bg-transparent pr-0 col px-0 knbn-border knbn-border-transparent" + 
        (props.themeToggled ? " knbn-dark-bg-remover knbn-dark-border-2x knbn-dark-color-5x" : " knbn-snow-bg-remover knbn-snow-border-2x knbn-snow-color-5x") + 
        (props.classes != undefined ? " " + props.classes : "")}>
            <div class={"d-flex pr-0 knbn-font-medium form-control knbn-no-border knbn-border-transparent knbn-bg-transparent" + (props.themeToggled ? " knbn-dark-color-5x" : " knbn-snow-color-5x")}>
                <div class="text-truncate mr-auto">
                    {props.children}
                </div>
                {
                props.remove && (props.canEdit)? 
                <div class="d-flex my-auto ml-2" onClick={props.remove}>
                    {
                        props.imageSrc != undefined && props.imageSrc.length > 0? 
                        <img src={props.imageSrc} class={"my-auto knbn-remove-btn mr-1" + (props.themeToggled ? "" : " knbn-img-inverted")}/>
                        :
                        <img src="./images/close.svg" class={"my-auto knbn-remove-btn mr-1" + (props.themeToggled ? "" : " knbn-img-inverted")}/>
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