import React from 'react';
import ReactDOM from 'react-dom';
import SelectItem from './SelectItem';
import ItemSetup from './ItemSetup';
import DueDate from './DueDate';

import TaskSetup from './TaskSetup';
import ComponentSetup from './ComponentSetup';
import TicketSetup from './TicketSetup';
import ItemName from './ItemName';


class CreateMain extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            type: 3,
        }
        this.changeType = this.changeType.bind(this);

    }

    changeType(type){
        if(type < 0 || type > 3){
            console.log('Invalid item type');
            return;
        }

        this.setState({type: type});
    }

    render(){
        return(
            <div class="create col-xl-4 offset-xl-4">
                <div class="row mb-2">
                    <div class="col-xl-12"> 
                        <div class="row">
                            <div class="selection col-xl-3 mb-2">
                                <SelectItem type={this.state.type} changeType={this.changeType}/>
                            </div>
                            <ItemName/>
                        </div>
                    </div>
                </div>
                {
                    this.state.type == 0 ? null 
                        : this.state.type == 1 ? <TaskSetup/> 
                        : this.state.type == 2 ? <TicketSetup   users={this.state.users} changeReporter={this.changeReporter} changeAssignee={this.changeAssignee} 
                                                                roles={{reporter: this.state.reporter, assignee: this.state.assignee}} changeComponent={this.changeComponent}/> 
                        : <ComponentSetup/>
                }
               
            </div>
        );
    }
}

ReactDOM.render(<CreateMain/>, document.getElementById('create'));

// export default CreateMain;