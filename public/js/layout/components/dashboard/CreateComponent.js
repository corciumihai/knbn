import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from 'axios';
import Alert from './Alert';
import ProjectName from './ProjectName';

class CreateComponent extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            name: "",
            loading: true,
            id: 0,
            errorMessage: "",
            project: {},
        }

        this.onChange = this.onChange.bind(this);
        this.createComponent = this.createComponent.bind(this);
        this.setProject = this.setProject.bind(this);
    }

    onChange(event){
        this.setState({name: event.target.value});
    }

    setProject(element){
        this.setState({project: element});
    }

    createComponent(){
        if(this.state.name.length == 0){
            this.setState({errorMessage: "Please fill the components name"});
            return;
        }
        if(!this.state.project || !this.state.project.id){
            this.setState({errorMessage: "Please choose a project"});
            return;
        }

        axios.post('/create-component', this.state).then((response) => {
        });
        this.props.toggleModal();
    }

    componentDidMount(){
        axios.get('/count-components').then((response) => {
           
            this.setState({
                id: (response.data[0].count + 1),
                loading: false,
            });
        });
    }

    render(){
        return(
            <div>
            <ModalBody>
                <Alert message={this.state.errorMessage} />
                <div class="form-group row">
                    <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 modal-label">
                        <span class="align-middle">Component id</span>
                    </div>
                    {!this.state.loading ? 
                    <div class="col">
                        <input type="text" class="form-control modal-input" readOnly defaultValue={this.state.id}/>
                    </div>
                    :
                    <div class="col">
                        Loading id...
                    </div>
                    }
                </div>
                <div class="form-group row">
                    <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 modal-label">
                        <span class="align-middle">Component name</span>
                    </div>
                    <div class="col">
                        <input type="text" class="form-control modal-input" onChange={this.onChange} value={this.state.name} placeholder="Enter component name"/>
                    </div>
                </div>
                <ProjectName project={this.state.project} onChange={this.setProject}/>
            </ModalBody>
            <ModalFooter>
            <div class="container">
                <div class="row">
                    <div class="col d-flex justify-content-end">
                        <button class="create-component btn" onClick={this.createComponent}>Create component</button>
                        <button class="cancel btn" onClick={this.props.toggleModal}>Cancel</button>
                    </div>
                </div>
            </div>
        </ModalFooter>
        </div>
        );
    }
}

export default CreateComponent;