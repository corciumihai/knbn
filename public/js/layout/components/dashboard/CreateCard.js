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

class CreateCard extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            startDate: moment(),
            endDate: undefined,   
            reporter: {},
            assignee: {},
            ticketName: "",
        }

        this.getEndDate = this.getEndDate.bind(this);
        this.modifyTicketName = this.modifyTicketName.bind(this);
        this.setReporter = this.setReporter.bind(this);
        this.setAssignee = this.setAssignee.bind(this);
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
            console.log(this.state.ticketName);
        });
    }

    render(){
        return(
            <ModalBody>
                
                <TicketName onChange={this.modifyTicketName}/>
                <TicketId/>
                <Estimation />
                <DatePicker emitEndDate={this.getEndDate}/>
                <ProjectName />
                <Participants setReporter={this.setReporter} setAssignee={this.setAssignee}/>
                <Description />
                <AttachedFiles />

            </ModalBody>
        );
    }
}

export default CreateCard;