import React from 'react';
import { connect } from 'react-redux';

const RemoveItem = (props) => {
    return(
        <div class={"pl-2 knbn-remover d-flex flex-row" + (props.themeToggled ? " knbn-dark-bg-remover" : " knbn-snow-bg-remover") + 
            (props.classes != undefined ? " " + props.classes : "")}>
            <div class="mr-2">
                {props.item}
            </div>
            {
            props.remove != undefined ? 
            <div class="d-flex my-auto ml-auto" onClick={props.remove}>
                {
                    props.imageSrc != undefined ? 
                    <img src={props.imageSrc} class="my-auto knbn-remove-btn mr-1"/>
                    :
                    <img src="./images/close.svg" class="my-auto knbn-remove-btn mr-1"/>
                }
            </div>
            : null
            }
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
    }
}


export default connect(mapStateToProps)(RemoveItem);