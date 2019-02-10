import React from 'react';
import {connect} from 'react-redux';
import ReactHtmlParser from 'react-html-parser';

const SearchItem = (props) => {
    return(
        <div class="row">
            <div class={"col-xl-12 py-2 knbn-font-14 d-flex flex-row knbn-border knbn-transition knbn-pointer" + 
            (props.themeToggled ? " knbn-dark-bg-2x knbn-dark-color-5x knbn-dark-onselect knbn-dark-border-2x" : " knbn-snow-border-2x knbn-snow-bg-2x knbn-snow-color-5x knbn-snow-onselect")}>
            {
                props.imgSrc != undefined ? 
                <img src={props.imgSrc} class="my-auto mr-2"/>
                :
                null
            }
                <div class="mr-3 col px-0 text-truncate">{props.data.name}</div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(SearchItem);