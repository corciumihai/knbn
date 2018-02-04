import React from 'react';


class Description extends React.Component{
    constructor(props){
        super(props);

    }

    render(){
        return(
            <div class="form-group row">
                <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 modal-label">
                    <span class="align-middle">Description</span>
                </div>
                <div class="col-xl-9 col-lg-9 col-md-9 col-sm-9 col-12">
                    <textarea type="text" class="form-control modal-input" placeholder="Enter ticket description"/>
                </div>
            </div>
        );
    }
}


export default Description;