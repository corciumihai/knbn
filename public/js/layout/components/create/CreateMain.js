import React from 'react';
import ReactDOM from 'react-dom';
import SelectItem from './SelectItem';
import ItemSetup from './ItemSetup';

import TaskSetup from './TaskSetup';
import ComponentSetup from './ComponentSetup';
import TicketSetup from './TicketSetup';
import ProblemReport from './ProblemReport';

class CreateMain extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            type: 4,
            name: '',
            error: '',
        }
        this.changeType = this.changeType.bind(this);
        this.setName = this.setName.bind(this);
        this.setError = this.setError.bind(this);
        this.resetName = this.resetName.bind(this);
    }

    setName(event){
        let data = event.target.value;
        this.setState({name: data}, () => {
            this.setState({error: ''});
        });
    }

    resetName(){
        this.setState({name: ''});
    }

    changeType(type){
        if(type < 0 || type > 4){
            console.log('Invalid item type');
            return;
        }

        this.setState({type: type, error: ''});
    }

    setError(error){
        this.setState({error: error});
    }

    render(){
        return(
            <div class="create col-xl-4 offset-xl-4">
                <div class="row mb-2 pt-3 pb-3">
                    <div class="col-xl-12"> 
                        <div class="row">
                            <div class="selection col-xl-4">
                                <SelectItem type={this.state.type} changeType={this.changeType}/>
                            </div>
                            
                            <div class="col item-name mt-xl-0 mt-2">
                                <div class="row">
                                    <div class="col-xl-12">
                                        <div class="form-group mb-0">
                                            <input type="text" class="form-control" placeholder="Item name" onChange={this.setName} value={this.state.name}/>
                                        </div>
                                    </div>
                                    {
                                    this.state.error != undefined && this.state.error.length > 0 ? 
                                        <div class="col-xl-12"><span class="error">{this.state.error}</span></div> 
                                        : 
                                        null
                                    }
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.state.type == 0 ? null 
                        : this.state.type == 1 ?    <TaskSetup name={this.state.name} setError={this.setError} resetName={this.resetName}/> 
                        : this.state.type == 2 ?    <TicketSetup name={this.state.name} setError={this.setError} resetName={this.resetName}/> 
                        : this.state.type == 3 ?    <ComponentSetup name={this.state.name} setError={this.setError} resetName={this.resetName}/>
                        :                           <ProblemReport name={this.state.name} setError={this.setError} resetName={this.resetName}/>  
                }
               
            </div>
        );
    }
}

ReactDOM.render(<CreateMain/>, document.getElementById('create'));

// export default CreateMain;