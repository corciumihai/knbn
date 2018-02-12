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
            data: {},
        }

        this.changeDropdownValue = this.changeDropdownValue.bind(this);
        this.createItem = this.createItem.bind(this);
        this.createCard = this.createCard.bind(this);
        this.createProject = this.createProject.bind(this);
        this.createComponent = this.createComponent.bind(this);

        this.setCardData = this.setCardData.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState){
        console.log(this.state.data, nextState.data);
        if(this.state.data.length > 0){
            
            return ! this.state.data.ticketName === nextState.data.ticketName;
            
        }



        return true;
    }

    setCardData(data){
        this.setState({data: data}, () => {
            // console.log(this.state.data);
        });
    }

    changeDropdownValue(event){
        parent = document.getElementById('dropdownMenuButton');
        parent.textContent = event.target.text;

        this.setState({function: event.target.id});
    }

    // send request with card data to create a card in the database
    createCard(){
        // if data is valid  
        if(
            this.state.data.ticketName.length && 
            this.state.data.ticketId.length
            // this.state.cardData.estimation.length && 
            // this.state.cardData.endDate.length &&
            // this.state.cardData.startDate.length
         )
        {
            axios.post('/create/card', this.state.data).then((response) => {
                //if response is positive
                //clear the cardData
                this.state.data = {};
            });

            this.props.toggle();
            // this.props.force();
        }

    }

    createProject(){
        console.log('Creating project');
    }

    createComponent(){
        console.log('Creating component');
    }

    createItem(){
        switch(this.state.currentItem.index){
            case 0:
                this.createCard();
                break;
            
            case 1:
                this.createComponent();
                break;

            case 2: this.createProject();
                break;
        }
    }

    render(){       
        console.log('rendering');
        return(
            this.props.show ? 
            (<div>
                <Modal isOpen={this.props.show} toggle={this.props.toggle} className="change-modal">
                    <ModalHeader toggle={this.props.toggleModal}>
                        <div class="modal-name col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6">Create new</div>
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle col-xl-4" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {
                                    this.state.currentItem === -1 ? "Select new instance" : this.state.currentItem.name
                                }
                            </button>
                            <div class="dropdown-menu">
                                {
                                    this.state.items.map((item) => {
                                        return <a class="dropdown-item" href="#" key={item.index} onClick={()=>{this.setState({currentItem: item})}}>{item.name}</a>
                                    })
                                }
                            </div>
                        </div>
                    </ModalHeader>

                    {this.state.currentItem.index === 0 ? 
                        <CreateCard setData={ this.setCardData } /> : null

                    }
                    {this.state.currentItem.index === 1 ? 
                        <CreateProject /> : null

                    }
                    {this.state.currentItem.index === 2 ? 
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