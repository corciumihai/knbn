import React from 'react';
import dateformat from 'dateformat';

class DatePicker extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            dueDate: new Date(),
        }

        this.translateDay = this.translateDay.bind(this);
    }

    translateDay(day){
        switch(day){
            case 0: return "Monday"; break;
            case 1: return "Tuesday"; break;
            case 2: return "Wednesday"; break;
            case 3: return "Thursday"; break;
            case 4: return "Friday"; break;
            case 5: return "Saturday"; break;
            case 6: return "Sunday"; break;
            default:break;
        }
    }

    render(){
        return(
            <div class="knbn-to-collapse col-xl-6 col-sm-8 offset-sm-2 offset-xl-3 px-3 py-2">
                <button class="ticket-dropdown-btn btn btn-secondary w-100" data-toggle="dropdown">{dateformat(this.state.dueDate, 'dddd \u00B7 dd \u00B7 mmmm \u00B7 yyyy')}</button>
                <div class="ticket-dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                    <div class="calendar input-group">
                        <div class="input-group-prepend">
                            <button class="date-btn btn px-3 py-1 h-100" type="button" id="button-addon1" onClick={this.decreaseMonth}><img class="mx-auto" src="./images/go-left.svg"></img></button>
                        </div>
                        <div class="date-display mx-auto"><span class="align-middle">{dateformat(this.state.dueDate, 'mmmm \u00B7 yyyy')}</span></div>
                        <div class="input-group-append">
                            <button class="date-btn btn px-3 py-1 h-100" type="button" id="button-addon1" onClick={this.increaseMonth}><img class="mx-auto" src="./images/go-right.svg"></img></button>
                        </div>
                    </div>
                    <div class="date-days d-flex flex-wrap">
                        {[...new Array(new Date(this.state.dueDate.getFullYear(), this.state.dueDate.getMonth() + 1, 0).getDate()).keys()].map(day => {
                            if( this.state.dueDate.getFullYear() == new Date().getFullYear() && 
                                this.state.dueDate.getMonth() == new Date().getMonth() && 
                                day + 1 == new Date().getDate()){
                                    return <button 
                                            class={"day-btn current-day btn px-0 py-0 mx-1 mt-1"} 
                                            key={day} 
                                            onClick={()=>{this.props.changeDate(day + 1)}} 
                                            title={this.translateDay(new Date(this.state.dueDate.getFullYear(), this.state.dueDate.getMonth(), day).getDay())}>{day + 1}</button>
                                }
                                else{
                                    return <button 
                                            class={new Date(this.state.dueDate.getFullYear(), this.state.dueDate.getMonth(), day + 1, 0).getTime() >= new Date().getTime() ? "day-btn btn px-0 py-0 mx-1 mt-1" : "day-btn btn px-0 py-0 mx-1 mt-1 disabled"} 
                                            key={day} 
                                            onClick={()=>{this.props.changeDate(day + 1)}} 
                                            title={this.translateDay(new Date(this.state.dueDate.getFullYear(), this.state.dueDate.getMonth(), day + 1).getDay())}>{day + 1}</button>
                                }
                            
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default DatePicker;