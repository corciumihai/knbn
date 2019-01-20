import React from 'react';
import {connect} from 'react-redux';
import ReactHtmlParser from 'react-html-parser';

const SearchItem = (props) => {
    return(
        <div class={"col-xl-12 py-2 px-0 knbn-font-14 d-flex flex-row knbn-border knbn-transition" + (props.themeToggled ? " knbn-dark-bg-2x knbn-dark-color-5x knbn-dark-onselect knbn-dark-border-2x" :  " knbn-snow-border-2x knbn-snow-bg-2x knbn-snow-color-5x knbn-snow-onselect")}>
            <div class="d-flex ml-2 mr-3">
                <img src="./images/edit.svg" class="mx-auto my-auto"/>
            </div>
            {
                props.imgSrc != undefined ? 
                    <img src={props.imgSrc} class="my-auto mr-2"/>
                    :
                    null
            }
            <div class="mr-3 col px-0 text-truncate">{props.data.name}</div>
            <div class="d-flex flex-row text-truncate">
                {/* <div class={"text-truncate" + (props.themeToggled ? " knbn-dark-color-2x mr-2" : " knbn-dark-color-2x")}>Descriere</div>  */}
                {/* <div class="text-truncate">{ReactHtmlParser(props.data.description)}</div> */}
            </div>

            <div class="d-flex ml-auto mr-3">
                <img src="./images/menu.svg" class="mx-auto my-auto"/>
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