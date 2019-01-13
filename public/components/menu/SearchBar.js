import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled
    }
}

const SearcBar = (props) => {
    return(
        <form class={"form-inline my-2 my-lg-0 knbn-transition knbn-no-border"}>
            <input  class={"knbn-form-control form-control search-inpt col knbn-transition knbn-bg-transparent knbn-border" + 
                    (props.themeToggled ? 
                        " knbn-dark-bg-2x-active knbn-dark-color-2x knbn-dark-color-2x-active knbn-dark-border-2x" 
                        : 
                        " knbn-snow-bg-2x-active knbn-snow-color-2x knbn-snow-color-2x-active knbn-snow-border-2x")} 
                    placeholder="Caută..." 
                    aria-label="Caută" title='Caută'/>
            <div class="btn search-btn align-self-end mr-0">
                <img src="/images/search.svg" class="d-block mx-auto" title="Caută"/>
            </div>
        </form>
    );
}

export default connect(mapStateToProps)(SearcBar);