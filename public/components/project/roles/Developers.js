import React from 'react';
import Developer from './developer/Developer';
import AddNew from './AddNew';
import ToggleButton from './ToggleButton';
import DevelopersContainer from './developer/DevelopersContainer';
import ListOfPeople from './ListofPeople';
import update from 'react-addons-update';

class Developers extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            isVisible: true,
            developers: [],
            lastIndex: 0,
            error: "",
        }

        this.flipVisibility = this.flipVisibility.bind(this);
        this.addUser = this.addUser.bind(this);
        this.setError =  this.setError.bind(this);
    }

    flipVisibility(){
        this.setState({isVisible: !this.state.isVisible});
    }

    addUser(user){
        if(this.state.developers.find((item) => {
            return item.name === user.name;
        })){
            this.setError('Name already in the list');
        }
        else{
            this.setState({developers: update(this.state.developers, {$push: [user]})}, () => {
                this.setState({error: "", lastIndex: this.state.lastIndex + 1});
            });
        }
        
    }

    setError(theError){
        this.setState({error: theError}, () => {
            console.log(this.state.error);
        });
    }

    render(){
        return(
            <div class="row developers">
                <div class="toggle-bar col-xl-12 col-12 d-flex flex-row">
                    <ToggleButton changeVisibility={this.flipVisibility}/>
                    <span class="align-self-center">Developers</span>
                </div>
                <DevelopersContainer isVisible={this.state.isVisible}>
                    <Developer add={this.addUser} lastIndex={this.state.lastIndex} setError={this.setError} error={this.state.error} list={this.state.developers}/>
                </DevelopersContainer>
            </div>
        );
    }
}

export default Developers;