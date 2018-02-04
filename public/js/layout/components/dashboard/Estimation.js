import React from 'react';

class Estimation extends React.Component{
    constructor(props){
        super(props);

    }

    render(){
        return(
            <div class="form-group row">
                <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 modal-label">
                    <span class="align-middle">Estimation</span>
                </div>
                <div class="col estimation-container">
                    <div class="row">
                        <div class="col-12">
                            <input type="text" class="form-control modal-input" placeholder="Enter ticket estimated time"/>
                        </div>
                        <div class="col">
                            <div class="col">
                                <a href="#">Help</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default Estimation;