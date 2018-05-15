import React from 'react';
import Dating from '../create/Dating';

class DevelopmentStart extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="form-group mb-2 d-flex flex-xl-row flex-column">
                <div class="development-start col-xl-6">
                    <label>Development start</label>
                    <div class="row mb-2 pl-3 pr-3">
                        <Dating setDate={this.props.setStartDate} date={this.props.date}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default DevelopmentStart;