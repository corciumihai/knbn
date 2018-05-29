import React from 'react';

class Dating extends React.Com{
    constructor(props){
        super(props);

        
    }

    render(){
        return(
            <div class="col">
                <div class="row year"></div>
                <div class="row month"></div>
                <div class="row day"></div>
            </div>
        );
    }
}

export default Dating;