import React from 'react';

class Cursor extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="col">
                <div class="input-group mb-1">
                    <div class="input-group-prepend d-flex">
                        <button class="increment btn align-self-center ml-2" type="button" onClick={this.props.decrease}><img src="./images/minus.svg" class="d-block mx-auto"/></button>
                    </div>
                    <span type="text" class="cursor form-control pl-1 pr-1">{this.props.value} </span>
                    <div class="input-group-append d-flex">
                        <button class="increment btn align-self-center mr-2" type="button" onClick={this.props.increase}><img src="./images/plus.svg" class="d-block mx-auto"/></button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Cursor;