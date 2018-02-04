import React from 'react';

class NewFile extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="new-file align-self-center"><img src="./images/download.svg" class="mx-auto d-block"/></div>
        );
    }
}

export default NewFile;