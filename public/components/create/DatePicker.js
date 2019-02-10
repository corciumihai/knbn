import React from 'react';
import dateformat from 'dateformat';
import { connect } from 'react-redux';
import Label from '../editor/Label';

class DatePicker extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            currentDate: new Date(),
        }

        this.translateDay = this.translateDay.bind(this);
        this.decreaseMonth = this.decreaseMonth.bind(this);
        this.increaseMonth = this.increaseMonth.bind(this);
    }

    componentDidMount(){
        if(this.props.date != this.state.currentDate){
            this.setState({currentDate: this.props.date});
        }
    }

    componentWillReceiveProps(nextProps, nextState){
        if(nextProps.date != this.state.currentDate){
            this.setState({currentDate: nextProps.date});
        }
    }

    translateDay(day){
        switch(day){
            case 0: return "Lu"; break;
            case 1: return "Ma"; break;
            case 2: return "Mi"; break;
            case 3: return "Jo"; break;
            case 4: return "Vi"; break;
            case 5: return "Sâ"; break;
            case 6: return "Du"; break;
            default:break;
        }
    }

    decreaseMonth(){
        this.setState({currentDate: new Date(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth() - 1)});
    }

    increaseMonth(){
        this.setState({currentDate: new Date(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth() + 1)});
    }

    set(date){
        this.setState({currentDate: date}, () => {
            this.props.action(this.state.currentDate);
        })
    }

    render(){
        let numOfDays = new Date(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth() + 1, 0).getDate()
        let dateArray = Array.from([...new Array(numOfDays).keys()], x => [x, x]).concat(Array.from([...new Array(35 - numOfDays).keys()], x => [numOfDays + x, x]));
        
        return(
            <div class={"knbn-transition"}>
                <div class={"w-100 p-2 knbn-border knbn-calendar knbn-transition" + 
                    (this.props.themeToggled ? " knbn-dark-bg-2x knbn-dark-color-2x knbn-dark-border-2x" : " knbn-snow-bg-2x knbn-snow-color-2x knbn-snow-border-3x")}>
                    <div class={"input-group knbn-pointer knbn-border-bottom" + (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-3x")}>
                        <div class={"mx-auto knbn-font-small knbn-transparent d-flex"}>
                            <div class="my-auto">{dateformat(this.state.currentDate, 'yyyy')}</div>
                        </div>
                    </div>

                    <div class="input-group knbn-pointer knbn-transition">
                        <div class="input-group-prepend knbn-transition" onClick={this.decreaseMonth}>
                            <div class="px-3 py-1 h-100 knbn-transition"><img src={this.props.themeToggled ? "./images/left.svg" : "./images/bLeft.svg"}/></div>
                        </div>

                        <div class={"mx-auto knbn-font-small knbn-transparent d-flex knbn-transition"}>
                            <div class="my-auto">{dateformat(this.state.currentDate, 'ddd \u00B7 dd \u00B7 mmmm')}</div>
                        </div>

                        <div class="input-group-append knbn-pointer knbn-transition" onClick={this.increaseMonth}>
                            <div class="px-3 py-1 h-100 knbn-transition"><img src={this.props.themeToggled ? "./images/right.svg" : "./images/bRight.svg"}/></div>
                        </div>
                    </div>
                    <div class="d-flex flex-wrap mx-auto justify-content-center knbn-font-small knbn-transition">
                        {dateArray.map(day => {
                            if( this.state.currentDate.getFullYear() == new Date().getFullYear() && 
                                this.state.currentDate.getMonth() == new Date().getMonth() && 
                                day[0] + 1 == new Date().getDate()){
                                    return <div 
                                                class={"btn btn-primary knbn-date-btn knbn-no-border knbn-no-border-radius knbn-no-box-shadow d-flex flex-column knbn-current-day d-flex"} 
                                                key={day[0]} 
                                                onClick={() => {this.set(new Date(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth(), day[0] + 1, 12))}} 
                                                title={this.translateDay(new Date(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth(), day[0]).getDay())}>
                                                    <div class="my-auto mx-auto">{day[1] + 1}</div>
                                                </div>
                                }
                                else{
                                    return <div 
                                                class={new Date(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth(), day[0] + 1, 0).getTime() >= new Date().getTime() ? "knbn-date-btn knbn-date-btn-valid btn btn-primary knbn-no-border knbn-no-border-radius knbn-no-box-shadow d-flex" : "knbn-date-btn knbn-date-btn-invalid btn knbn-btn-dis knbn-no-border knbn-no-border-radius knbn-no-box-shadow d-flex"} 
                                                key={day[0]} 
                                                onClick={new Date(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth(), day[0] + 1, 0).getTime() >= new Date().getTime() ? 
                                                    () => {this.set(new Date(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth(), day[0] + 1, 12))} : null} 
                                                title={this.translateDay(new Date(this.state.currentDate.getFullYear(), this.state.currentDate.getMonth(), day[0]).getDay())}>
                                                    <div class="my-auto mx-auto">{day[1] + 1}</div>
                                                </div>
                                }
                            
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(DatePicker);