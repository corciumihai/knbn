import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class CreateComponent extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <ModalBody>
                <div class="form-group row">
                    <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 modal-label">
                        <span class="align-middle">Component name</span>
                    </div>
                    <div class="col-xl-9 col-lg-9 col-md-9 col-sm-9 col-12">
                        <input type="text" class="form-control modal-input" placeholder="Enter component name"/>
                    </div>
                </div>
            </ModalBody>
        );
    }
}

export default CreateComponent;