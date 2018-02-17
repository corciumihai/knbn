import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from 'axios';

class CreateProject extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            name: "",
            id: 0,
            loading: true,
        }

        this.onChange = this.onChange.bind(this);
        this.createProject = this.createProject.bind(this);
    }

    createProject(){
        axios.post('/create-project', this.state).then((response) => {
            console.log(response);
        });

        this.props.toggleModal();
    }

    componentDidMount(){
        axios.get('/count-projects').then((response) => {
            this.setState({
                loading: false,
                id: response.data[0].count + 1
            })
        })
    }
    
    onChange(event){
        this.setState({name: event.target.value});
    }

    render(){
        return(
            <div>
            <ModalBody>
                <div class="form-group row">
                    <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 modal-label">
                        <span class="align-middle">Project name</span>
                    </div>
                    <div class="col-xl-9 col-lg-9 col-md-9 col-sm-9 col-12">
                        <input type="text" class="form-control modal-input" placeholder="Enter project name" onChange={this.onChange} value={this.state.name}/>
                    </div>
                </div>
                <div class="form-group row">
                    <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 modal-label">
                        <span class="align-middle">Project id</span>
                    </div>
                    {
                        this.state.loading ? 
                        <div class="col">
                            Loading project id...
                        </div>
                        :
                        <div class="col-xl-9 col-lg-9 col-md-9 col-sm-9 col-12">
                            <input type="text" class="form-control modal-input" readOnly defaultValue={this.state.id.toString()}/>
                        </div>
                    }
                </div>
            </ModalBody>
            <ModalFooter>
                <div class="container">
                    <div class="row">
                        <div class="col d-flex justify-content-end">
                            <button class="create-project btn" onClick={this.createProject}>Create project</button>
                            <button class="cancel btn" onClick={this.props.toggleModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            </ModalFooter>
            </div>
        );
    }
}

export default CreateProject;