import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class ChangeModal extends React.Component{
    
    constructor(props){
        super(props);

        this.save = this.save.bind(this);
    }

    save(){

        var ticketName = document.getElementById('ticket-name').value;
        var ticketId = document.getElementById('ticket-id').value;
        var ticketDescription = document.getElementById('ticket-description').value;
        var ticketAssigned = document.getElementById('ticket-assigned').value;
        var tickerReporter = document.getElementById('ticket-reported').value;
        var data = {
            name: ticketName,
            id: ticketId,
            description: ticketDescription,
            assigned: ticketAssigned,
            reporter: tickerReporter,
        };

        this.props.saveState(data);
    }

    render(){
        
        return(
            this.props.state.showModal ? 
            (<div>
                <Modal isOpen={this.props.state.showModal} toggle={this.props.toggleModal} className="change-modal">
                    <ModalHeader toggle={this.props.toggleModal}>
                        <div class="modal-ticket-name col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">Editing ticket {this.props.state.id}</div>
                    </ModalHeader>
                    <ModalBody>
                        <div class="form-group row">
                            <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 modal-label">
                                <span class="align-middle">Identifier</span>
                            </div>
                            <div class="col-xl-9 col-lg-9 col-md-9 col-sm-9 col-12">
                                <input id="ticket-id" type="text" class="form-control modal-input" placeholder="Enter ticket id" defaultValue={this.props.state.id} readOnly/>
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 modal-label">
                                <span class="align-middle">Project</span>
                            </div>
                            <div class="col-xl-9 col-lg-9 col-md-9 col-sm-9 col-12">
                                <input id="ticket-project" type="text" class="form-control modal-input" placeholder="Enter project id" defaultValue={this.props.state.project} readOnly/>
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 modal-label">
                                <span class="align-middle">Date created</span>
                            </div>
                            <div class="col-xl-9 col-lg-9 col-md-9 col-sm-9 col-12">
                                <input id="ticket-project" type="text" class="form-control modal-input" placeholder="Enter date" defaultValue={this.props.state.creationDate} readOnly/>
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 modal-label">
                                <span class="align-middle">Last modified on</span>
                            </div>
                            <div class="col-xl-9 col-lg-9 col-md-9 col-sm-9 col-12">
                                <input id="ticket-project" type="text"class="form-control modal-input" placeholder="Enter date" defaultValue={this.props.state.modifyDate + " @ " + this.props.state.modifyTime} readOnly/>
                            </div>
                        </div>
                    
                        <div class="form-group row">
                            <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 modal-label">
                            <span class="align-middle">Name</span>
                            </div>
                            <div class="col-xl-9 col-lg-9 col-md-9 col-sm-9 col-12">
                                <input id="ticket-name" type="text" class="form-control modal-input" placeholder="Enter ticket name" defaultValue={this.props.state.name}/>
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 modal-label">
                            <span class="align-middle">Assigned to</span>
                            </div>
                            <div class="col-xl-9 col-lg-9 col-md-9 col-sm-9 col-12">
                                <input id="ticket-assigned" type="text" class="form-control modal-input" placeholder="Enter assignee name" defaultValue={this.props.state.assignedTo}/>
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 modal-label">
                            <span class="align-middle">Reported by</span>
                            </div>
                            <div class="col-xl-9 col-lg-9 col-md-9 col-sm-9 col-12">
                                <input id="ticket-reported" type="text" class="form-control modal-input" placeholder="Enter reporter name" defaultValue={this.props.state.reportedBy}/>
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 modal-label">
                                <span class="align-middle">Description</span>
                            </div>
                            <div class="col-xl-9 col-lg-9 col-md-9 col-sm-9 col-12">
                                <textarea id="ticket-description" type="text" class="form-control modal-input" placeholder="Enter ticket description" defaultValue={this.props.state.description}/>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button id="modal-save" type="button" class="btn btn-success col-xl-3 col-lg-3 col-md-3 col-sm-4 col-6" onClick={this.save}>Save</button>
                        <button id="modal-cancel" type="button" class="btn btn-primary col-xl-3 col-lg-3 col-md-3 col-sm-4 col-6" onClick={this.props.toggleModal}>Cancel</button>
                    </ModalFooter>
                </Modal>
            </div>)
            : null
        );
    }
}

export default ChangeModal;