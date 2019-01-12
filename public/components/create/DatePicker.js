import React from 'react';
import dateformat from 'dateformat';

class DatePicker extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            startDate: new Date(),
            currentDate: new Date(),
        }

        this.translateDay = this.translateDay.bind(this);
        this.decreaseMonth = this.decreaseMonth.bind(this);
        this.increaseMonth = this.increaseMonth.bind(this);
    }

    componentDidMount(){
        this.setState({startDate: this.props.initial});
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

    decreaseMonth(){
        this.setState({currentDate: new Date(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth() - 1, this.state.currentDate.getDay())});
    }

    increaseMonth(){
        this.setState({currentDate: new Date(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth() + 1, this.state.currentDate.getDay())});
    }

    render(){
        return(
            <div class={"knbn-to-collapse col-xl-6 col-sm-8 offset-sm-2 offset-xl-3 px-3 py-2" + (this.props.dark == true ? "" : "")}>
                {/* <div class={"ticket-dropdown-btn w-100 text-center" + (this.props.dark == true ? "" : " knbn-snow-bg-1x")}>{dateformat(this.state.currentDate, 'dddd \u00B7 dd \u00B7 mmmm \u00B7 yyyy')}</div> */}
                <div class={"ticket-dropdown-menu w-100 p-2 knbn-border" + (this.props.dark == true ? "" : " knbn-snow-bg-1x knbn-snow-border-1x")}>
                    <div class="calendar input-group">
                        <div class="input-group-prepend">
                            <button class={"date-btn btn px-3 py-1 h-100 knbn-btn knbn-transition" + (this.props.dark == true ? "" : " knbn-snow-bg-inverted-onhover knbn-snow-bg-inverted-onfocus knbn-snow-bg-inverted-onactive")} type="button" id="button-addon1" onClick={this.decreaseMonth}><img class={"mx-auto" + (this.props.dark ? " knbn-img-inverted" : "")} src="./images/leftArrowLight.svg"></img></button>
                        </div>

                        <div class={"date-display mx-auto" + (this.props.dark == true ? " " : " knbn-snow-color-1x")}><span class="align-middle">{dateformat(this.state.currentDate, 'mmmm \u00B7 yyyy')}</span></div>

                        <div class="input-group-append">
                            <button class={"date-btn btn px-3 py-1 h-100 knbn-btn knbn-transition" + (this.props.dark == true ? "" : " knbn-snow-bg-inverted-onhover knbn-snow-bg-inverted-onfocus knbn-snow-bg-inverted-onactive")} type="button" id="button-addon1" onClick={this.increaseMonth}><img class={"mx-auto" + (this.props.dark ? " knbn-img-inverted" : "")} src="./images/rightArrowLight.svg"></img></button>
                        </div>
                    </div>
                    <div class="date-days d-flex flex-wrap mx-auto justify-content-center">
                        {[...new Array(new Date(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth() + 1, 0).getDate()).keys()].map(day => {
                            if( this.state.currentDate.getFullYear() == new Date().getFullYear() && 
                                this.state.currentDate.getMonth() == new Date().getMonth() && 
                                day + 1 == new Date().getDate()){
                                    return <button 
                                                class={"day-btn current-day btn px-0 py-0"} 
                                                key={day} 
                                                onClick={() => {this.props.changeDate(new Date(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth(), day + 1).getTime())}} 
                                                title={this.translateDay(new Date(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth(), day).getDay())}>{day + 1}</button>
                                }
                                else{
                                    return <button 
                                                class={new Date(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth(), day + 1, 0).getTime() >= new Date().getTime() ? "day-btn btn px-0 py-0" + (this.props.dark == true ? "" : "") : "day-btn btn px-0 py-0 disabled" + (this.props.dark == true ? "" : " knbn-snow-color-1x")} 
                                                key={day} 
                                                onClick={new Date(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth(), day + 1, 0).getTime() >= new Date().getTime() ? 
                                                    () => {this.props.changeDate(new Date(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth(), day + 1).getTime())} : null} 
                                                title={this.translateDay(new Date(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth(), day).getDay())}>{day + 1}</button>
                                }
                            
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default DatePicker;