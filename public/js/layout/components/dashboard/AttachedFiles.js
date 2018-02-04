import React from 'react';
import NewFile from './NewFile';

class AttachedFiles extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="form-group row">
                <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 modal-label">
                    <span class="align-middle">Attached documents</span>
                </div>
                <div class="files-container d-flex col-xl-9 col-lg-9 col-md-9 col-sm-9 col-12">
                    <div class="add-new align-self-center">
                        <img src="./images/add-file2.svg" class="add-file mx-auto d-block" />
                    </div>
                    <div class="new-files-container d-flex flex-wrap col">
                        <NewFile/>
                        {/* <NewFile/>
                        <NewFile/>
                        <NewFile/>
                        <NewFile/>
                        <NewFile/>
                        <NewFile/>
                        <NewFile/> */}
                    </div>
                    {/* <input type="text" class="form-control modal-input" placeholder="Enter card name"/> */}
                </div>
            </div>
        );
    }
}

export default AttachedFiles;