import React from 'react';
import dateformat from 'dateformat';

class SetDate extends React.Component{
    constructor(props){
        super(props);

        let date = new Date();
        this.state = {
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            day: date.getDate(),
            month: date.getMonth(),
            year: date.getFullYear(),
            enabled: false,
        }

        this.incrementDay = this.incrementDay.bind(this);
        this.incrementMonth = this.incrementMonth.bind(this);
        this.incrementYear = this.incrementYear.bind(this);

        this.decrementDay = this.decrementDay.bind(this);
        this.decrementMonth = this.decrementMonth.bind(this);
        this.decrementYear = this.decrementYear.bind(this);

        this.setEnable = this.setEnable.bind(this);
    }

    componentWillMount(){
        if(this.props.date > 0) {
            let date = new Date(this.props.date);
            this.setState({
                day: date.getDate(),
                month: date.getMonth(),
                year: date.getFullYear(),
            });
        }
    }

    incrementDay(){
        let date = new Date(this.state.year, this.state.month, this.state.day + 1);
        this.setState({day: date.getDate(), month: date.getMonth(), year: date.getFullYear()});
    }

    decrementDay(){
        let date = new Date(this.state.year, this.state.month, this.state.day - 1);
        this.setState({day: date.getDate(), month: date.getMonth(), year: date.getFullYear()});
    }

    incrementMonth(){
        let date = new Date(this.state.year, this.state.month + 1, this.state.day);
        this.setState({day: date.getDate(), month: date.getMonth(), year: date.getFullYear()});
    }

    decrementMonth(){
        let date = new Date(this.state.year, this.state.month - 1, this.state.day);
        this.setState({day: date.getDate(), month: date.getMonth(), year: date.getFullYear()});
    }

    incrementYear(){
        let date = new Date(this.state.year + 1, this.state.month, this.state.day);
        this.setState({day: date.getDate(), month: date.getMonth(), year: date.getFullYear()});
    }

    decrementYear(){
        let date = new Date(this.state.year - 1, this.state.month, this.state.day);
        this.setState({day: date.getDate(), month: date.getMonth(), year: date.getFullYear()});
    }

    setEnable(){
        this.setState({enabled: !this.state.enabled});
    }

    render(){
        let date = new Date(this.state.year, this.state.month, this.state.day);
        let bound = this.props.set.bind(this, date.getTime());
        return(
            <div class="col ticket-data modifiable">
                <div class="row">
                    <div class="col">
                        <div class="row">  
                            <div class="col day modifiable" title="Day">
                                <div class="row">
                                    <div class="rez edit-field float-left ml-1 my-1" onClick={this.decrementDay}>
                                        <img src="/images/increment.svg" class="mx-auto d-block" />
                                    </div>
                                    <div class="col text-truncate text-center">{this.state.day}</div>
                                    <div class="rez edit-field float-right mr-1 my-1" onClick={this.incrementDay}>
                                        <img src="/images/decrement.svg" class="mx-auto d-block"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row">  
                            <div class="col-12 month modifiable" title="Month">
                                <div class="row">
                                    <div class="rez edit-field float-left ml-1 my-1" onClick={this.decrementMonth}>
                                        <img src="/images/increment.svg" class="mx-auto d-block" />
                                    </div>
                                    <div class="col text-truncate text-center">{this.state.months[this.state.month]}</div>
                                    <div class="rez edit-field float-right mr-1 my-1" onClick={this.incrementMonth}>
                                        <img src="/images/decrement.svg" class="mx-auto d-block" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row">  
                            <div class="col year modifiable" title="Year">
                                <div class="row">
                                    <div class="rez edit-field float-left ml-1 my-1" onClick={this.decrementYear}>
                                        <img src="/images/increment.svg" class="mx-auto d-block" />
                                    </div>
                                    <div class="col text-truncate text-center">{this.state.year}</div>
                                    <div class="rez edit-field float-right mr-1 my-1" onClick={this.incrementYear}>
                                        <img src="/images/decrement.svg" class="mx-auto d-block" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-3 edit-field d-flex" onClick={bound}><img src="/images/save.svg" class="d-block mx-auto"/></div>
                    {this.props.error.length > 0 ? <div class="col-xl-12 error-input"><span class="error">{this.props.error}</span></div> : null}
                </div>
            </div>
                        
        );
    }
}

export default SetDate;