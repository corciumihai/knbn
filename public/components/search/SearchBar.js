import React from 'react';

class SearcBar extends React.Component{
    render(){
        return(
            <form class="form-inline my-2 my-lg-0">
                <input class="knbn-form-control form-control search-inpt col" placeholder="Search" aria-label="Search"/>
                <div class="btn search-btn align-self-end mr-0"><img src="/images/search.svg" class="d-block mx-auto" title="Search"/></div>
            </form>
        );
    }
}

export default SearcBar;