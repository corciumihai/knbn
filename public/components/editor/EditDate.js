import React from 'react';
import dateformat from 'dateformat';
import DatePicker from '../create/DatePicker';

class EditDate extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            date: new Date(),
            inEditMode: false,
        }

        this.enterEditMode = this.enterEditMode.bind(this);
        this.save = this.save.bind(this);
        this.setDate = this.setDate.bind(this);
    }

    componentWillReceiveProps(nextProps, nextState){
        if(new Date(parseInt(nextProps.date)) != this.state.date){
            this.setState({date: new Date(parseInt(nextProps.date))});
        }
    }

    enterEditMode(){
        this.setState({inEditMode: true});
    }

    setDate(date){
        this.setState({date: date}, () => {this.props.save(date)});
    }

    save(date){
        this.setState({inEditMode: false});
    }

    render(){
        return(
            <div class="form-group">
                <div class="d-flex flex-row">  
                    <label for="knbnFieldLabel" class="knbn-edit-field">{this.props.label}</label>
                </div>
                {
                    !this.props.editable ? 
                    <div class="knbn-input-grp knbn-fake-input-grp knbn-immutable input-group">
                        <div class="knbn-fake-input form-control text-truncate">
                            {dateformat(new Date(this.state.date), "dddd \u00B7 mmmm dS \u00B7 yyyy")}
                        </div>
                    </div>
                    :
                    <div class="d-flex flex-column w-100">
                        <div class="knbn-input-grp knbn-fake-input-grp input-group">
                            <div class="knbn-fake-input form-control text-truncate">
                                {dateformat(new Date(this.state.date), "dddd \u00B7 mmmm dS \u00B7 yyyy")}
                            </div>
                            <div class="knbn-input-grp-append input-group-append d-flex">
                                <div class="input-group-text mx-1 d-flex my-auto">
                                {
                                    this.state.inEditMode ? 
                                    <img class="knbn-edit-btn mx-auto" src="./images/save.svg" onClick={this.save}></img>
                                    :
                                    <img class="knbn-edit-btn mx-auto" src="./images/edit.svg" onClick={this.enterEditMode}></img>
                                }
                                    
                                </div>
                            </div>
                        </div>
                        {
                            this.state.inEditMode ? 
                                <DatePicker changeDate={this.setDate}/>
                                :
                                null
                        }
                    </div>                    
                }
                <small id="knbnHelp" class="knbn-edit-help form-text text-muted">{this.props.description}</small>
            </div>
        );
    }
}

export default EditDate;