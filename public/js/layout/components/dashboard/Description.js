import React from 'react';


class Description extends React.Component{
    constructor(props){
        super(props);

    }

    render(){
        return(
            <div class="row">
                <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 modal-label">
                    <span class="align-middle">Description</span>
                </div>
                <div class="form-group col">
                    <textarea type="text" class="form-control modal-input" onChange={this.props.onChange} value={this.props.value} placeholder="Enter ticket description"/>
                </div>
            </div>
        );
    }
}


export default Description;