import React from 'react';
import DropdownSearch from './DropdownSearch';
import Dating from './Dating';

class ComponentSetup extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            projects: [],
            component: {value: '', key: ''},
            dueDate: new Date(),
        }

        this.changeProject = this.changeProject.bind(this);
        this.setDueDate = this.setDueDate.bind(this);
    }

    changeProject(){
        console.log('changed project');
    }

    setDueDate(date){
        console.log("--", date);
        // this.setState({dueDate: date});
    }

    render(){
        return(
            <div class="component">
                <div class="row mb-2">
                    <div class="col-xl-2 info">Belongs to</div>
                    <div class="col mb-3">
                        <DropdownSearch list={this.state.projects} item={this.state.component} change={this.changeProject} placeholder="Project name"/>
                    </div>
                </div>

                <div class="row mb-2">
                    <div class="col-xl-2 info">Description</div>
                    <div class="col">
                        <div class="form-group">
                            <textarea type="text" class="form-control" placeholder="Description"/>
                        </div>
                    </div>
                </div>

                <div class="row mb-2">
                    <div class="col-xl-2 info">Labels</div>
                    <div class="col">
                        <div class="form-group">
                            <input type="text" class="form-control" placeholder="Label name"/>
                        </div>
                    </div>
                </div>

                <div class="row mb-2">
                    <div class="col-xl-2 info">Due date</div>
                    <div class="col-xl-10">
                        <Dating setDate={this.setDueDate} dueDate={this.state.dueDate}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default ComponentSetup;