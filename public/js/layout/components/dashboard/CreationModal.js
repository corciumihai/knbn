import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CreateCard from './CreateCard';
import CreateProject from './CreateProject';
import CreateComponent from './CreateComponent';


class CreationModal extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            selectedItem: undefined,
        }

        this.changeDropdownValue = this.changeDropdownValue.bind(this);
        this.createItem = this.createItem.bind(this);
    }

    changeDropdownValue(event){
        parent = document.getElementById('dropdownMenuButton');
        parent.textContent = event.target.text;

        this.setState({selectedItem: event.target.id});
         
    }

    createItem(){
        switch (this.state.selectedItem){
            case 'create-card':
                console.log('Creating card...');
                break;

            case 'create-project':
                console.log('Creating project...');
                break;

            case 'create-component':
                console.log('Creating component...');
                break;

            default:
                alert('Nothing selected')
                break;
        }

    }

    render(){        
        return(
            this.props.show ? 
            (<div>
                <Modal isOpen={this.props.show} toggle={this.props.toggle} className="change-modal">
                    <ModalHeader toggle={this.props.toggleModal}>
                        <div class="modal-name col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6">Create new</div>

                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle col-xl-4" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Select new instance</button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="#" id="create-card" onClick={this.changeDropdownValue}>Card</a>
                                <a class="dropdown-item" href="#" id="create-component" onClick={this.changeDropdownValue}>Component</a>
                                <a class="dropdown-item" href="#" id="create-project" onClick={this.changeDropdownValue}>Project</a>
                            </div>
                        </div>
                    </ModalHeader>

                    {this.state.selectedItem === 'create-card' ? 
                        <CreateCard /> : null

                    }
                    {this.state.selectedItem === 'create-project' ? 
                        <CreateProject /> : null

                    }
                    {this.state.selectedItem === 'create-component' ? 
                        <CreateComponent /> : null

                    }
                        
                    <ModalFooter>
                        <button id="modal-save" type="button" class="btn btn-success col-xl-3 col-lg-3 col-md-3 col-sm-4 col-6" onClick={this.createItem}>Create</button>
                        <button id="modal-cancel" type="button" class="btn btn-primary col-xl-3 col-lg-3 col-md-3 col-sm-4 col-6" onClick={this.props.toggle}>Cancel</button>
                    </ModalFooter>
                </Modal>
            </div>)
            : null
        );
    }
}

export default CreationModal;