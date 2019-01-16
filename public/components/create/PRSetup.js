import React from 'react';
import axios from 'axios';
import InputField from './InputField';
import PriorityField from './PriorityField';
import UserField from './UserField';
import TextAreaField from './TextAreaField';
import SelectionField from './SelectionField';
import { connect } from 'react-redux';
import Error from './Error';
import Header3 from '../editor/Header3';

class PRSetup extends React.Component{
    render(){
        return(
            <div class="container-fluid mt-3 col-xl-4 col-sm-8 offset-sm-2 offset-xl-4 col-md-6 offset-md-3 px-2">
                <Header3>Creator raport problemă</Header3>

                <Error>{this.state.nameError}</Error>
                <InputField 
                    label="Nume"
                    value={this.state.name}
                    description="Numele tichetului"
                    action={this.setName}
                />

                <Error>{this.state.componentError}</Error>
                <SelectionField
                    label="Atașează componentă"
                    action={this.setComponent}
                    description="Componenta la care tichetul va fi atașat"
                    value={this.state.component.name}
                    items={this.state.components}
                    currentItem={this.state.component}
                />

                <PriorityField
                    description="Prioritatea raportului de problemă"
                    items={this.props.priorities}
                    action={this.setPriority}
                    value={this.state.priority}
                />

                <UserField
                    user={this.state.assignee}
                    action={this.setAssignee}
                    label="Prioritatea raportului de problemă"
                />

                <TextAreaField
                    label="Descriere"
                    action={this.setDescription}
                    value={this.state.description}
                    description="Descrierea raportului de problemă"
                />

                <TextAreaField
                    label="Pași de testare"
                    action={this.setTestSteps}
                    value={this.state.testSteps}
                    description="Pașii de testare pentru a reproduce problema"
                />

                <TextAreaField
                    label="Comportament așteptat"
                    action={this.setExpectedBehavior}
                    value={this.state.expectedBehavior}
                    description="Comportamentul așteptat la aplicarea pașilor de testare"
                />
                
                <TextAreaField
                    label="Comportament observat"
                    action={this.setObservedBehavior}
                    value={this.state.observedBehavior}
                    description="Comportamentul observat la aplicarea pașilor de testare"
                />

                <SelectionField
                    label="Atașează versiune"
                    action={this.setRelease}
                    description="Versiune la care raportul de problemă va fi atașat"
                    value={this.state.release.name}
                    items={this.state.releases}
                    currentItem={this.state.release}
                />

                <SelectionField
                    label="Tichet blocat"
                    action={this.setBlockedTicket}
                    description="Tichetul blocat de crearea acestui raport de problemă"
                    value={this.state.blockedTicket.name}
                    items={this.state.tickets}
                    currentItem={this.state.blockedTicket}
                />  

                <SelectionField
                    label="Blocat de tichet"
                    action={this.setBlockingTicket}
                    description="Tichetul care blochează acest raport de problemă"
                    value={this.state.blockingTicket.name}
                    items={this.state.tickets}
                    currentItem={this.state.blockingTicket}
                />  
                
                <SelectionField
                    label="Atașează categorie"
                    action={this.setCategory}
                    description="Categoria care va fi atașată la raportul de problemă"
                    value={this.state.category.name}
                    items={this.state.categories}
                    currentItem={this.state.category}
                />  

                <InputField 
                    label="Ore de lucru estimate"
                    value={this.state.estimation}
                    description="Efortul de muncă estimat in ore"
                    action={this.setEstimation}
                />
                
                {/* <div class="ticket-section mb-2 d-flex">
                    <Toggler classToToggle=".knbn-to-collapse"/>
                    <div class="w-100">
                        <Label label='Due date'/>
                        <DatePicker changeDate={this.changeDueDate}/>
                    </div>
                </div> */}

                <div class="d-flex flex-row justify-content-center mb-3 ">
                    <button class={"ticket-dropdown-btn btn btn-primary mr-2 knbn-border" + (this.props.themeToggled ? " knbn-dark-bg-2x knbn-dark-color-2x knbn-dark-border-2x" : " knbn-snow-bg-2x knbn-snow-color-2x knbn-snow-border-2x")} onClick={this.submitTicket}>Adaugă problemă</button>
                    <button class={"ticket-dropdown-btn btn btn-primary" + (this.props.themeToggled ? " knbn-dark-bg-2x knbn-dark-color-2x knbn-dark-border-2x" : " knbn-snow-bg-2x knbn-snow-color-2x knbn-snow-border-2x")}  onClick={this.resetState}>Anulează</button>
                </div>
            </div>
        );
    }

    constructor(props){
        super(props);

        this.state = {
            name: '',
            users: [],
            components: [],
            tickets: [],
            releases: [],
            reporter: {},
            assignee: {},
            component: {},
            blockedTicket: {},
            blockingTicket: {},
            category: {},
            categories: [],
            dueDate: new Date(),
            estimation: 0,
            description: '',
            testSteps: '',
            expectedBehavior: '',
            observedBehavior: '',
            priority: {},
            release: {},

            nameError: '',
            componentError: ''
        }

        this.setAssignee = this.setAssignee.bind(this);
        this.setComponent = this.setComponent.bind(this);
        this.setBlockedTicket = this.setBlockedTicket.bind(this);
        this.setBlockingTicket = this.setBlockingTicket.bind(this);
        this.setCategory = this.setCategory.bind(this);
        this.setEstimation = this.setEstimation.bind(this);
        this.setDescription = this.setDescription.bind(this);
        this.fetchComponents = this.fetchComponents.bind(this);
        this.fetchCategories = this.fetchCategories.bind(this);
        this.fetchTickets = this.fetchTickets.bind(this);
        this.setPriority = this.setPriority.bind(this);
        this.submitTicket = this.submitTicket.bind(this);
        this.setRelease = this.setRelease.bind(this);
        this.fetchReleases = this.fetchReleases.bind(this);
        this.setName = this.setName.bind(this);
        this.verify = this.verify.bind(this);
        this.setTestSteps = this.setTestSteps.bind(this);
        this.setObservedBehavior = this.setObservedBehavior.bind(this);
        this.setExpectedBehavior = this.setExpectedBehavior.bind(this);
    }

    setName(value){
        this.setState({name: value, nameError: ''});
    }

    setAssignee(user){this.setState({assignee: user})}

    setComponent(component){this.setState({component: component, componentError: ''});}

    setBlockedTicket(ticket){this.setState({blockedTicket: ticket});}

    setBlockingTicket(ticket){this.setState({blockingTicket: ticket});}

    setCategory(category){this.setState({category: category});}

    setDescription(value){this.setState({description: value});}

    setPriority(prio){this.setState({priority: prio})};

    setRelease(release){this.setState({release: release});}

    fetchComponents(){axios.get('/get-components').then(response => {this.setState({components: response.data})});}

    fetchTickets(){axios.get('/get-tickets').then(response => {this.setState({tickets: response.data.tickets, filteredTickets: response.data.tickets});});}

    fetchCategories(){axios.get('/get-categories').then(response => {this.setState({categories: response.data, filteredCategories: response.data})});}

    fetchReleases(){axios.get('/get-releases').then(response => {this.setState({releases: response.data})})}

    setEstimation(value){this.setState({estimation: value});}

    setTestSteps(value){this.setState({testSteps: value})}

    setExpectedBehavior(value){this.setState({expectedBehavior: value})}

    setObservedBehavior(value){this.setState({observedBehavior: value})}

    componentWillMount(){
        this.fetchComponents();
        this.fetchReleases();
        this.fetchTickets();
        this.fetchCategories();

        this.setState({priority: this.props.priorities[2]});
    }

    verify(){
        // check name not empty
        if(this.state.name == undefined || this.state.name.length == 0){
            this.setState({nameError: 'Introdu numele tichetului'});
            return false;
        }
        // check if attached to a component
        if(this.state.component.id == undefined || this.state.component.id.length == 0 || this.state.component.id <= 0 ){
            this.setState({componentError: 'Selectează o referință a unei componente'});
            return false;
        }

        return true;
    }

    resetState(){
        this.setState({
            name: '',
            assignee: {},
            component: {},
            blockedTicket: {},
            blockingTicket: {},
            category: {},
            dueDate: new Date(),
            estimation: 0,
            description: '',
            testSteps: '',
            expectedBehavior: '',
            observedBehavior: '',
            priority: this.props.priorities[2],
            release: {},
            nameError: '',
            componentError: ''
        })
    }

    submitTicket(event){
        event.preventDefault();

        if(this.verify() == true){
            axios.post('/add-pr', {
                name: this.state.name,
                assignee: this.state.assignee.email,
                component: this.state.component.id,
                blockedTicket: this.state.blockedTicket.id,
                blockingTicket: this.state.blockingTicket.id,
                category: this.state.category.id,
                estimation: parseInt(this.state.estimation),
                description: this.state.description,
                testSteps: this.state.testSteps,
                expectedBehavior: this.state.expectedBehavior,
                observedBehavior: this.state.observedBehavior,
                priority: this.state.priority.dbName,
                releaseID: this.state.release.id,
                dueDate: new Date().getTime(),
                testSteps: this.state.testSteps,
                observedBehavior: this.state.observedBehavior,
                expectedBehavior: this.state.expectedBehavior,
                startDate: new Date().getTime(),
                lane: 'backlog',
            }).then(response => {
                if(response.data.success == true){
                    this.resetState();
                }
            });
        }
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
        priorities: state.priorities
    }
}

export default connect(mapStateToProps)(PRSetup);