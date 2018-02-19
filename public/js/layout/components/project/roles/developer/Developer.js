import React from 'react';
import DeveloperTitle from './DeveloperTitle';
import DeveloperName from './DeveloperName';
import AddNew from '../AddNew';
import ListOfPeople from '../ListofPeople';

class Developer extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            currentName: "",
            currentTitle: "",
        }

        this.changeCurrentName = this.changeCurrentName.bind(this);
        this.changeCurrentTitle = this.changeCurrentTitle.bind(this);
        this.addUser = this.addUser.bind(this);
    }

    changeCurrentName(event){
        this.setState({currentName: event.target.value});
    }

    changeCurrentTitle(event){
        this.setState({currentTitle: event.target.value});
    }

    addUser(){
        if(this.state.currentName.length === 0){
            this.props.setError('Please enter developer name');
            return;
        }

        if(this.state.currentTitle.length === 0){
            this.props.setError('Please enter developer title');
            return;
        }

        this.props.add({
            name: this.state.currentName,
            index: this.props.lastIndex,
            title: this.state.currentTitle
        });

        this.props.setError("");
    }

    render(){
        return(
            <div class="row">
                <div class="developer col-xl-6 col-12">
                    <div class="container">
                        <DeveloperName onChange={this.changeCurrentName}/>
                        <DeveloperTitle onChange={this.changeCurrentTitle}/>
                        <AddNew onClick={this.addUser} error={this.props.error}/>
                    </div>
                </div>
                <ListOfPeople list={this.props.list}/>
            </div>
        );
    }
}

export default Developer;