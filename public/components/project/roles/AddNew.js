import React from 'react';

class AddNew extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="row">
                <div class="add-new col-xl-12 col-12">
                    <div class="container">
                        <div class="row">
                            <div onClick={this.props.onClick} class="add-button d-flex flex-row">
                                <div class="add"> + </div>
                                <div class="col d-flex">
                                    <span class="add-new-text align-self-center">Add new</span>
                                </div>
                            </div>
                            <div class="col">
                                <span class="error-message">{this.props.error}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddNew;