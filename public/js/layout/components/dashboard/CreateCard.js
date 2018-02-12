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
            loadingTicketCount: true,
        }

        this.props.setData(this.state);

        this.getEndDate = this.getEndDate.bind(this);
        this.modifyTicketName = this.modifyTicketName.bind(this);
        this.setReporter = this.setReporter.bind(this);
        this.setAssignee = this.setAssignee.bind(this);
        this.onDescriptionChange =  this.onDescriptionChange.bind(this);
        this.onEstimationChange = this.onEstimationChange.bind(this);
        this.setProject = this.setProject.bind(this);
        this.generateTicketID = this.generateTicketID.bind(this);
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

    modifyTicketName(event){    
        this.setState({ticketName: event.target.value}, () => {
            this.props.setData(this.state);
        });
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

    render(){
        return(
            <ModalBody>
                <div class="container">
                    <TicketName onChange={this.modifyTicketName} value={this.state.ticketName}/>
                    <TicketId id={this.state.ticketId} isLoading={this.state.loadingTicketCount}/>
                    <Estimation onChange={this.onEstimationChange}/>
                    <DatePicker emitEndDate={this.getEndDate}/>
                    <ProjectName onChange={this.setProject} project={this.state.project} />
                    <Participants setReporter={this.setReporter} setAssignee={this.setAssignee}/>
                    <Description onChange={this.onDescriptionChange} value={this.state.description}/>
                    <AttachedFiles />
                </div>
            </ModalBody>
        );
    }
}

export default CreateCard;