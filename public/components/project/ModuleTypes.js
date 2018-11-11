import React from 'react';
import Cookies from 'universal-cookie';
import SingleType from './SingleType';
import Button from './Button';

class ModuleTypes extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            disciplineName: '',
        }

        this.add = this.add.bind(this);
        this.change = this.change.bind(this);
    }

    change(event){
        this.setState({disciplineName: event.target.value});
    }

    add(event){
        event.preventDefault();
        // add new discipline to the parent
        if(this.state.disciplineName.length > 0){
            if(this.props.disciplines.length === 0){
                this.props.add({name: this.state.disciplineName});
                this.setState({disciplineName: ''});
            }
            else{
                let exists = false;
                this.props.disciplines.forEach(element => {
                    if(element.name === this.state.disciplineName){
                        exists = true;
                        return;
                    }
                });
                
                if(exists){
                    console.log('Element already exists in the list');
                    return;
                }
                this.props.add({name: this.state.disciplineName});
                this.setState({disciplineName: ''})
            }
            
        }
        
    }

    render(){
        return(
            <div class="form-group mb-2 d-flex flex-xl-row flex-column">
                <div class="col-xl-4 col-md-4 col-12">
                    <label>Component Types</label>
                    <input type="text" class="form-control col" id="discipline-name" aria-describedby="discpline-help" placeholder="Enter module type"
                        onChange={this.change} value={this.state.disciplineName}/>
                    <small id="discipline-help" class="form-text text-muted mb-2">Add the module types for your project</small>
                    <Button onclick={this.add} text="Add type"/>
                </div>
                {
                    this.props.disciplines.length > 0 ?
                    <div class="disciplines col-xl-8 col-md-8 col-12">   
                        <div class="row p-3">
                        { 
                            this.props.disciplines.map(discipline => {
                                return <SingleType key={discipline.name} discipline={discipline} remove={this.props.remove}/>
                            })
                        }
                        </div>
                    </div>
                :   <div class="disciplines col-xl-8 col-md-8 col-12 d-flex justify-content-center">
                        <span class="align-self-center small-muted">No disciplines added yet</span>
                    </div>
                }
                
            </div>
        );
    }
}

export default ModuleTypes;