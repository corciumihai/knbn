import React from 'react';

class Cursor extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            // <div class="col">
                <div class="input-group">
                    <div class="input-group-prepend d-flex px-1">
                        <button class="increment btn align-self-center" type="button" onClick={this.props.decrease}><img src="./images/minus.svg" class="d-block mx-auto"/></button>
                    </div>
                    <span type="text" class="cursor form-control px-1">{this.props.value} </span>
                    <div class="input-group-append d-flex px-1">
                        <button class="increment btn align-self-center" type="button" onClick={this.props.increase}><img src="./images/plus.svg" class="d-block mx-auto"/></button>
                    </div>
                </div>
            // </div>
        );
    }
}

export default Cursor;