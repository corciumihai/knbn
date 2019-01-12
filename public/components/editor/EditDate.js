import React from 'react';
import dateformat from 'dateformat';
import DatePicker from '../create/DatePicker';
import EditButton from './EditButton';
import Label from './Label';
import Small from './Small';
import { connect } from 'react-redux';

class EditDate extends React.Component{
    render(){
        return(
            <div class="form-group">
                <div class="d-flex flex-row">  
                    <Label label={this.props.label}/>
                </div>
                {
                    !this.props.editable ? 
                    <div class={"knbn-input-grp knbn-fake-input-grp knbn-immutable input-group knbn-transition" + 
                    (this.props.themeToggled ? " knbn-dark-border-2x knbn-dark-onselect" : " knbn-snow-border-2x knbn-snow-onselect")}>
                        <div class={"knbn-fake-input form-control text-truncate knbn-transition" + 
                        (this.props.themeToggled == true ? " knbn-dark-color-5x" : " knbn-snow-color-5x")}>
                            {dateformat(new Date(this.state.date), "dddd \u00B7 mmmm dS \u00B7 yyyy")}
                        </div>
                    </div>
                    :
                    <div class="d-flex flex-column w-100">
                        <div class={"knbn-input-grp knbn-fake-input-grp input-group knbn-transition" + 
                        (this.props.themeToggled ? " knbn-dark-border-2x knbn-dark-onselect" : " knbn-snow-border-2x knbn-snow-onselect")}>
                            <div class={"knbn-fake-input form-control text-truncate knbn-transition" + 
                            (this.props.themeToggled == true ? " knbn-dark-color-5x" : " knbn-snow-color-5x")}>
                                {dateformat(new Date(this.state.date), "dddd \u00B7 mmmm dS \u00B7 yyyy")}
                            </div>

                            <EditButton edit={this.state.inEditMode} save={this.save} enableEditMode={this.enterEditMode}/>
                        </div>
                        {
                        this.state.inEditMode ? 
                            <DatePicker changeDate={this.setDate}/>
                            :
                            null
                        }
                    </div>                    
                }
                <Small>{this.props.description}</Small>
            </div>
        );
    }

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
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
    }
}

export default connect(mapStateToProps)(EditDate);