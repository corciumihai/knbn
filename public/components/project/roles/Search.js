import React from 'react';

class Search extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="col-xl-6 col-12">
                <form>
                    <div class="form-group">
                        <label for="search-name">Search user</label>
                        <input type="text" class="form-control" id="search-name" aria-describedby="search-help" placeholder="Search..."/>
                        <small id="search-help" class="form-text text-muted">Search name</small>
                    </div>
                </form>
            </div>
        );
    }
}

export default Search;