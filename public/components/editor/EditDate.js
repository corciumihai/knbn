import React from 'react';
import dateformat from 'dateformat';
import DatePicker from '../create/DatePicker';
import EditButton from './EditButton';
import Label from './Label';
import Small from './Small';
import { connect } from 'react-redux';
import RemoveItem from '../create/RemoveItem';

class EditDate extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            date: new Date(),
            inEditMode: false,
        }

        this.setEdiMode = this.setEdiMode.bind(this);
        this.save = this.save.bind(this);
        this.setDate = this.setDate.bind(this);
    }

    componentDidMount(){
        this.setState({date: this.props.date});
    }

    componentWillReceiveProps(nextProps, nextState){
        if(nextProps.date != this.state.date){
            this.setState({date: new Date(nextProps.date)});
        }
    }

    setEdiMode(){
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
                    <Label label={this.props.label}/>
                </div>
                {
                    !this.state.inEditMode ? 
                    <div class={"d-flex flex-row text-truncate"}>
                        <RemoveItem remove={this.setEdiMode} canEdit={this.props.canEdit}>
                            {dateformat(this.state.date, "dddd \u00B7 d mmmm \u00B7 yyyy")}
                        </RemoveItem>
                    </div>
                    :
                    <div class={"d-flex flex-column w-100 knbn-border knbn-transition" + (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-2x")}>
                        <div class={"input-group knbn-transition mb-1 knbn-border-bottom knbn-transition" + 
                        (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-2x")}>
                            <div class={"knbn-no-border knbn-font-medium knbn-no-box-shadow knbn-no-border-radius knbn-border-transparent form-control knbn-editing-mode knbn-bg-transparent" + 
                            (this.props.themeToggled == true ? 
                                " knbn-dark-color-4x knbn-dark-bg-2x knbn-dark-bg-2x-active knbn-dark-border-2x" 
                                : 
                                " knbn-snow-color-4x knbn-snow-bg-2x knbn-snow-bg-2x-active knbn-snow-border-2x")}>
                                {dateformat(this.state.date, "dddd \u00B7 d mmmm \u00B7 yyyy")}
                            </div>

                            <EditButton edit={this.state.inEditMode} save={this.save} enableEditMode={this.setEdiMode}/>
                        </div>
                        {
                        this.state.inEditMode ? 
                            <div class="mx-auto">
                                <DatePicker date={this.state.date} action={this.setDate}/>
                            </div>
                            :
                            null
                        }
                    </div>                    
                }
                <Small>{this.props.description}</Small>
            </div>
        );
    }


}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
    }
}

export default connect(mapStateToProps)(EditDate);