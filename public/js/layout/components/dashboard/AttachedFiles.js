import React from 'react';
import NewFile from './NewFile';

class AttachedFiles extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="row">
                <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 modal-label">
                    <span class="align-middle">Attached documents</span>
                </div>
                <div class="files-container d-flex col">
                    <div class="add-new align-self-center">
                        <img src="./images/add-file2.svg" class="add-file mx-auto d-block" />
                    </div>
                    <div class="new-files-container d-flex flex-wrap col">
                        <NewFile/>
                    </div>
                </div>
            </div>
        );
    }
}

export default AttachedFiles;