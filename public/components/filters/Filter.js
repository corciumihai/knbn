import React from 'react';
import { connect } from 'react-redux';

const Filter = (props) => {
    return(
        <div class={"mr-3 knbn-pointer"} onClick={props.action}>
            <div class={"d-flex knbn-font-small" + (props.themeToggled ? " knbn-dark-color-2x" : " knbn-snow-color-2x")}>
                <img src="./images/save.svg" class={"mx-auto my-auto knbn-border mr-1" + (props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-2x knbn-img-inverted") + (props.trigger ? " knbn-remember" : "")}/> 
                <div class="ml-1">{props.children}</div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
    }
}

export default connect(mapStateToProps)(Filter);