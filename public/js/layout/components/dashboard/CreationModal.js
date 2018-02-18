import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CreateCard from './CreateCard';
import CreateProject from './CreateProject';
import CreateComponent from './CreateComponent';
import axios from 'axios';


class CreationModal extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            items: [{name: "Card", index: 0}, {name: "Project", index: 1}, {name:"Component", index: 2}],
            currentItem: -1,
            
        }

        this.changeDropdownValue = this.changeDropdownValue.bind(this);
    }

    changeDropdownValue(event){
        parent = document.getElementById('dropdownMenuButton');
        parent.textContent = event.target.text;

        this.setState({function: event.target.id});
    }

    render(){       
        return(
            this.props.show ? 
            (
                <Modal isOpen={this.props.show} toggle={this.props.toggle} className="change-modal">
                    <ModalHeader toggle={this.props.toggleModal}>
                    <div class='container'>                        
                        <div class="row">
                            <div class="col-xl-4 offset-xl-4">
                                <div class="container">
                                    <div class="row new-item-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <div class="new-item btn col">Create new</div>
                                        <div class="new-item-button d-flex"><img src="/images/small-arrow-down.svg" class="mx-auto d-block align-self-center"/></div>
                                    </div>
                                    <div class="dropdown-menu col">
                                            {
                                                this.state.items.map((item) => {
                                                    return <a class="dropdown-item" href="#" key={item.index} onClick={()=>{this.setState({currentItem: item})}}>{item.name}</a>
                                                })
                                            }
                                        </div>
                                </div>
                            </div> 
                        </div>
                    </div>
                        
                    </ModalHeader>

                    {/* {this.state.currentItem.index === 0 ? 
                        <CreateCard toggleModal={this.props.toggle}/> : null

                    }
                    {this.state.currentItem.index === 1 ? 
                        <CreateProject toggleModal={this.props.toggle}/> : null

                    }
                    {this.state.currentItem.index === 2 ? 
                        <CreateComponent toggleModal={this.props.toggle}/> : null

                    } */}
    
                </Modal>
            )
            : null
        );
    }
}

export default CreationModal;