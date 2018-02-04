import React from 'react';
import DateSlider from './DateSlider';

class DatePicker extends React.Component{
    constructor(props){
        super(props);
        var currentDate = new Date();
        
        this.state = {
            year: currentDate.getFullYear(),
            month: currentDate.getMonth(),
            day: currentDate.getDate(),
            maxYears: [],
            daysPerMonth: [],
            completionDate: currentDate,
            allMonths: [{value: 1, name:"January"}, {value: 2, name:"February"}, {value: 3, name:"March"}, {value: 4, name:"April"}, {value: 5, name:"May"}, {value: 6, name:"June"}, 
                        {value: 7, name:"July"}, {value: 8, name:"August"}, {value: 9, name:"September"}, {value: 10, name:"October"}, {value: 11, name:"November"}, {value: 12, name:"December"}],
        }

        this.genMonthDays = this.genMonthDays.bind(this);
        this.genYears = this.genYears.bind(this);
        this.changeDay = this.changeDay.bind(this);
        this.changeMonth = this.changeMonth.bind(this);
        this.changeYear = this.changeYear.bind(this);
        this.emitEndDate = this.emitEndDate.bind(this);
    }

    componentWillMount(){
        this.setState({maxYears: this.genYears(), daysPerMonth: this.genMonthDays()});
    }

    genMonthDays(){
        var daysInMonth = new Date(this.state.year, this.state.month + 1, 0).getDate();
        var days = [];
        
        for(var index = 1; index < daysInMonth + 1; index ++){
            days.push({value: index, name:index});
        } 
        return days;  
    }

    genYears(){
        var years = [];
        for(var index = this.state.year; index < this.state.year + 11; index ++){
            years.push({value:index, name: index});
        }
        return years;
    }

    changeDay(value){
        var found = this.state.daysPerMonth.find((element) => {
            return element.name == value;
        });

        this.setState({day: found.value});
        this.emitEndDate();
    }

    changeMonth(value){
        var found = this.state.allMonths.find((element) => {
            return element.name == value;
        });

        this.setState({month: found.value - 1}, () => {
            this.setState({daysPerMonth: this.genMonthDays()}, () => {
                if(this.state.day > this.state.daysPerMonth[this.state.daysPerMonth.length - 1].value){
                    this.setState({day: this.state.daysPerMonth[this.state.daysPerMonth.length - 1].value});
                }
            });
            this.emitEndDate();
        });
    }

    changeYear(value){
        this.setState({year: value});
        this.emitEndDate();
    }

    emitEndDate(){
        this.props.emitEndDate(new Date(this.state.year, this.state.month, this.state.day));
    }

    render(){
        return(
            <div class="form-group row">
                <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 modal-label">
                    <span class="align-middle">Completion date</span>
                </div>
                <div class="col-xl-9 col-lg-9 col-md-9 col-sm-9 col-12 date-picker">
                    {/* <div class="row"> */}
                        <div class="container date-sliders">
                            {/* <div class="col-xl-12 col-12">  */}
                                <div class="row">
                                    <DateSlider initialValue={this.state.day} allValues={this.state.daysPerMonth} unit="Day" callback={this.changeDay} />
                                    <DateSlider initialValue={this.state.allMonths.find((element) => {
                                            return element.value == this.state.month + 1;
                                        }).name} allValues={this.state.allMonths} unit="Month" callback={this.changeMonth} />
                                    <DateSlider initialValue={this.state.year} allValues={this.state.maxYears} unit="Year" callback={this.changeYear} />
                                </div>
                            {/* </div> */}
                        </div>
                    {/* </div> */}
                </div>
            </div>
        );
    }
}

export default DatePicker;