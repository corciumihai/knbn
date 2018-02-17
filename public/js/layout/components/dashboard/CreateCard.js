import React from 'react';
import moment from 'moment';
import DatePicker from './DatePicker';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import Participants from './Participants';
import ProjectName from './ProjectName';
import Description from './Description';
import Estimation from './Estimation';
import AttachedFiles from './AttachedFiles';
import TicketName from './TicketName';
import TicketId from './TicketId';
import Alert from './Alert';
import Component from './Component';

import axios from 'axios';

class CreateCard extends React.PureComponent{
    constructor(props){
        super(props);

        this.state = {
            startDate: moment(),
            endDate: moment(),   
            reporter: {},
            assignee: {},
            ticketName: "",
            //generate the ticket id
            ticketId: "",
            description: "",
            //use a method to define estimation
            estimation: "",
            project: {}, 
            component: {},
            loadingTicketCount: true,
            errorMessage: ""
        }

        this.getEndDate = this.getEndDate.bind(this);
        this.updateTicketName = this.updateTicketName.bind(this);
        this.setReporter = this.setReporter.bind(this);
        this.setAssignee = this.setAssignee.bind(this);
        this.onDescriptionChange = this.onDescriptionChange.bind(this);
        this.onEstimationChange = this.onEstimationChange.bind(this);
        this.setProject = this.setProject.bind(this);
        this.generateTicketID = this.generateTicketID.bind(this);
        this.createCard = this.createCard.bind(this);
        this.setComponent = this.setComponent.bind(this);
    }

    componentDidMount(){
        this.generateTicketID();
    }

    generateTicketID(){
        //generate ticket id
        axios.get('/count').then((response) => {
            this.setState({loadingTicketCount: false}, () => {
                this.setState({ticketId: 'ID-' + (response.data[0].count + 1)});
            });
        });
    }

    getEndDate(date){
        this.setState({endDate: date});
    }

    setReporter(element){
        this.setState({reporter: element});
    }
    
    setAssignee(element){
        this.setState({assignee: element});
    }

    updateTicketName(event){    
        this.setState({ticketName: event.target.value});
    }

    onDescriptionChange(event){
        this.setState({description: event.target.value});
    }

    onEstimationChange(event){
        this.setState({estimation: event.target.value});
    }

    setProject(element){
        this.setState({project: element});
    }

    setComponent(element){
        this.setState({component: element});
    }

    createCard(){
        if(!this.state.ticketName ||  this.state.ticketName.length === 0){
            this.setState({errorMessage: "Ticket cannot have an empty name"});
            return;
        }

        else if(!this.state.project.name || this.state.project.name === 0){
            this.setState({errorMessage: "Please choose a project name"});
            return;
        }

        else if(!this.state.reporter.name || this.state.reporter.name.length === 0){
            this.setState({errorMessage: "Please choose a reporter"});
            return;
        }

        else if(!this.state.assignee.name || this.state.assignee.name.length == 0){
            this.setState({errorMessage: "Please choose an assignee"});
            return;
        }
        else{
            // create card
            this.setState({errorMessage: ""});
            axios.post('/create/card', this.state).then((request, response) => {
                console.log(response);
            });
            this.props.toggleModal();
        }
    }

    render(){
        return(
            <div>
                <ModalBody>
                    <div class="container">
                        <Alert message={this.state.errorMessage}/>
                        <TicketId id={this.state.ticketId} isLoading={this.state.loadingTicketCount}/>
                        <TicketName onChange={this.updateTicketName} value={this.state.ticketName}/>
                        <Estimation onChange={this.onEstimationChange}/>
                        <DatePicker emitEndDate={this.getEndDate}/>
                        <ProjectName onChange={this.setProject} project={this.state.project} />
                        <Component onChange={this.setComponent} component={this.state.component} />
                        <Participants setReporter={this.setReporter} setAssignee={this.setAssignee}/>
                        <Description onChange={this.onDescriptionChange} value={this.state.description}/>
                        <AttachedFiles />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div class="container">
                        <div class="row">
                            <div class="col d-flex justify-content-end">
                                <button class="create-card btn" onClick={this.createCard}>Create card</button>
                                <button class="cancel btn" onClick={this.props.toggleModal}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </ModalFooter>
            </div>
        );
    }
}

export default CreateCard;