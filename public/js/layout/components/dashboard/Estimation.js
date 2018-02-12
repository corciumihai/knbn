import React from 'react';

class Estimation extends React.Component{
    constructor(props){
        super(props);

    }

    render(){
        return(
            <div class="row">
                <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 modal-label">
                    <span class="align-middle">Estimation</span>
                </div>
                <div class="form-group col">
                    <input type="text" class="form-control modal-input" onChange={this.props.onChange} placeholder="Enter ticket estimated time"/>
                    <div class="col"><a href="/estimation-help" class="small-tooltip">Help</a></div>  
                </div>
            </div>
        );
    }
}


export default Estimation;