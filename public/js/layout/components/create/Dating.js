import React from 'react';
import DropdownSearch from './DropdownSearch';
import update from 'react-addons-update';
import Cursor from './Cursor';

class Dating extends React.Component{
    constructor(props){
        super(props);

        let currentDate = this.props.date;
        currentDate.setHours(0);
        currentDate.setMinutes(0);
        currentDate.setSeconds(0);
        currentDate.setMilliseconds(0);

        this.state = {
            day: parseInt(currentDate.getDate()),
            month: parseInt(currentDate.getMonth()),
            year: parseInt(currentDate.getFullYear()),
            error: '',
        }

        this.decreaseDay = this.decreaseDay.bind(this);
        this.decreaseMonth = this.decreaseMonth.bind(this);
        this.decreaseYear = this.decreaseYear.bind(this);

        this.increaseDay = this.increaseDay.bind(this);
        this.increaseMonth = this.increaseMonth.bind(this);
        this.increaseYear = this.increaseYear.bind(this);
    }

    increaseDay(){
        if(this.state.day == 31){
            return;
        }
        this.setState({day: this.state.day + 1});
    }

    decreaseDay(){
        if(this.state.day == 1){
            return;
        }
        this.setState({day: this.state.day - 1});
    }

    increaseMonth(){
        if(this.state.month == 11){
            return;
        }
        this.setState({month: this.state.month + 1});
    }

    decreaseMonth(){
        if(this.state.month == 0){
            return;
        }
        this.setState({month: this.state.month - 1});
    }

    increaseYear(){
        if(this.state.year == 2299){
            return;
        }
        this.setState({year: this.state.year + 1});
    }

    decreaseYear(){
        if(this.state.year == 0){
            return;
        }
        this.setState({year: this.state.year - 1});
    }

    changeDay(value){
        if(value > 31){
            console.log('Way too many days');
            return;
        }
        else if( value < 1){
            console.log('Cant be 0');
            return;
        }
        this.setState({day: value});
    }

    componentDidUpdate(previousProps, prevState){
        let date = new Date();
        date.setFullYear(this.state.year);
        date.setMonth(this.state.month);
        date.setDate(this.state.day);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);

        if(!((date.getFullYear() == this.state.year) && (date.getMonth() == this.state.month) && (date.getDate() == this.state.day))){
            if(prevState.error.length == 0 &&  prevState.error == this.state.error){
                this.setState({error:"Invalid date"});
            }
        }
        else{
            if((this.props.date == undefined) || (this.props.date.getFullYear() != date.getFullYear()) || 
                    (this.props.date.getMonth() != date.getMonth()) || (this.props.date.getDate() != date.getDate())){
                this.props.setDate(date);
            }
            if(prevState.error.length > 0 &&  prevState.error == this.state.error){
                this.setState({error: ''});
            }
        }
    }

    render(){
        return(
            // <div class="dates col">
                <div class="dates row">
                    <div class="col-xl-3 col-6">
                        <div class="row">
                            <div class="info dating col-xl-12">Day</div>
                            <Cursor increase={this.increaseDay} decrease={this.decreaseDay} value={this.state.day.toString()} onChange={this.changeDay} placeholder="Day"/>
                        </div>
                    </div>
                    <div class="col-xl-4 col-6">
                        <div class="row">
                            <div class="info dating col-xl-12">Month</div>
                            <Cursor increase={this.increaseMonth} decrease={this.decreaseMonth} value={(this.state.month + 1).toString()} placeholder="Month"/>
                        </div>
                    </div>
                    <div class="col-xl-5 col-12">
                        <div class="row">
                            <div class="info dating col-xl-12">Year</div>
                            <Cursor increase={this.increaseYear} decrease={this.decreaseYear} value={this.state.year.toString()} placeholder="Year"/>
                        </div>
                    </div>
                    {
                        this.state.error.length > 0 ? 
                            <div class="col"><span class="error">{this.state.error}</span></div>
                            : 
                            null
                    }
                </div>
                
            // </div>
        );
    }
}

export default Dating;