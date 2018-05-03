import React from 'react';

class DevelopmentTime extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="form-group mb-2 d-flex flex-xl-row flex-column">
                <div class="development-start col-xl-6">
                    <label>Development start</label>
                    <div class="row mb-2 pl-3 pr-3">
                        <div class="col-4 pl-0 pr-1"><input type="text" class="release-date form-control" placeholder="Day"/></div>
                        <div class="col-4 pl-1 pr-1"><input type="text" class="release-date form-control"  placeholder="Month"/></div>
                        <div class="col-4 pl-1 pr-0"><input type="text" class="release-date form-control" placeholder="Year"/></div>
                    </div>
                </div>
                <div class="development-end col-xl-6">
                    <label>Development end</label>
                    <div class="row mb-2 pl-3 pr-3">
                        <div class="col-4 pl-0 pr-1"><input type="text" class="release-date form-control" placeholder="Day"/></div>
                        <div class="col-4 pl-1 pr-1"><input type="text" class="release-date form-control"  placeholder="Month"/></div>
                        <div class="col-4 pl-1 pr-0"><input type="text" class="release-date form-control" placeholder="Year"/></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DevelopmentTime;