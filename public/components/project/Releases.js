import React from 'react';
import Button from './Button';
import SingleRelease from './SingleRelease';

class Releases extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            name: '',
            startDay: '',
            startMonth: '',
            startYear: '',
            endDay: '',
            endMonth: '',
            endYear: ''
        }

        this.add = this.add.bind(this);
        this.changeStartDay = this.changeStartDay.bind(this);
        this.changeStartMonth = this.changeStartMonth.bind(this);
        this.changeStartYear = this.changeStartYear.bind(this);
        this.changeEndDay = this.changeEndDay.bind(this);
        this.changeEndMonth = this.changeEndMonth.bind(this);
        this.changeEndYear = this.changeEndYear.bind(this);
        this.changeReleaseName = this.changeReleaseName.bind(this);
    }

    componentWillMount(){
        let date = new Date();
        
        if(this.props.releases.length == 0){
            this.setState({startDay: String(date.getDate()), startMonth: String(date.getMonth() + 1), startYear: String(date.getFullYear())});

            date = new Date(date.setDate(date.getDate() + 14));
            this.setState({endDay: String(date.getDate()), endMonth: String(date.getMonth() + 1), endYear: String(date.getFullYear())});
        }
        else{
            let lastRelease = new Date(this.props.releases[this.props.releases.length - 1].endDate);
            lastRelease = new Date(lastRelease.setDate(lastRelease.getDate() + 1));
            this.setState({startDay: String(lastRelease.getDate()), startMonth: String(lastRelease.getMonth() + 1), startYear: String(lastRelease.getFullYear())});

            lastRelease = new Date(lastRelease.setDate(lastRelease.getDate() + 14));
            this.setState({endDay: String(lastRelease.getDate()), endMonth: String(lastRelease.getMonth() + 1), endYear: String(lastRelease.getFullYear())});
        }
        
    }

    add(event){
        event.preventDefault();

        if(this.state.name.length == 0){
            console.log('Name cannot be empty');
            return;
        }

        let startDate = new Date(this.state.startYear, this.state.startMonth - 1, this.state.startDay);
        if(startDate.getTime() < new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime()){
            console.log('Start date cannot be in the past');
            return;
        }
        let endDate = new Date(this.state.endYear, this.state.endMonth - 1, this.state.endDay);
        if(endDate.getTime() < new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime()){
            console.log('End date cannot be in the past');
            return;
        }

        if(startDate.getTime() === endDate.getTime()){
            console.log('Cannot have start and end date the same date');
            return;
        }

        if(endDate.getTime() < startDate.getTime()){
            console.log('End date cannot be before start date');
            return;
        }

        if(this.props.releases.length == 0){
            this.props.add({name: this.state.name, startDate: startDate.getTime(), endDate: endDate.getTime()});
            return;
        }

        if(this.props.releases.find(item => {return item.name.toLowerCase() === this.state.name.toLowerCase()})){
            console.log('Release already in the list');
            return;
        }

        if(this.props.releases.find(item => {
                return !(startDate.getTime() > new Date(item.endDate).getTime());
            })){
            console.log('Release "' + this.state.name + '" overlaps another release\'s start date or end date');
            return;
        }

        this.props.add({name: this.state.name, startDate: startDate.getTime(), endDate: endDate.getTime()});
    }

    changeStartDay(event){
        let day = event.target.value;
        if(day.length == 0){
            this.setState({startDay: day});
            return;
        }
        if(day < 1 || day > 31){
            return;
        }
        this.setState({startDay: day});
    }

    changeStartMonth(event){
        let month = event.target.value;
        if(month.length == 0){
            this.setState({startMonth: month});
            return;
        }
        if(month < 1 || month > 12){
            return;
        }
        this.setState({startMonth: month});
    }

    changeStartYear(event){
        let year = event.target.value;
        if(year.length == 0){
            this.setState({startYear: year});
            return;
        }
        if(year < 1){
            return;
        }
        this.setState({startYear: year});
    }

    changeEndDay(event){
        let day = event.target.value;
        if(day.length == 0){
            this.setState({endDay: day});
            return;
        }
        if(day < 1 || day > 31){
            return;
        }
        this.setState({endDay: day});
    }

    changeEndMonth(event){
        let month = event.target.value;
        if(month.length == 0){
            this.setState({endMonth: month});
            return;
        }
        if(month < 1 || month > 12){
            return;
        }
        this.setState({endMonth: month});
    }

    changeEndYear(event){
        let year = event.target.value;
        if(year.length == 0){
            this.setState({endYear: year});
            return;
        }
        if(year < 1){
            return;
        }
        this.setState({endYear: year});
    }

    changeReleaseName(event){
        this.setState({name: event.target.value});
    }

    render(){
        return(
            <div class="form-group mb-2 d-flex flex-xl-row flex-column">
                <div class="col-xl-4 col-md-3 col-12">
                    <label>Planned Releases</label>
                    <input type="text" onChange={this.changeReleaseName} value={this.state.name} class="release-name form-control col" id="release-name" aria-describedby="release-help" placeholder="Enter planned release"/>
                    <div class="col">
                        <label class="mt-2 mb-1" >Start Date</label>
                        <div class="row">
                            <div class="col-3 pr-1"> <input type="text" class="release-date form-control" onChange={this.changeStartDay} value={this.state.startDay} placeholder="Day"/></div>
                            <div class="col-4 pl-1 pr-1"><input type="text" class="release-date form-control" onChange={this.changeStartMonth} value={this.state.startMonth} placeholder="Month"/></div>
                            <div class="col-5 pl-1"><input type="text" class="release-date form-control" onChange={this.changeStartYear} value={this.state.startYear} placeholder="Year"/></div>
                        </div>
                        <label class="mt-1 mb-1" >End Date</label>
                        <div class="row">
                            <div class="col-3 pr-1"><input type="text" class="release-date form-control" onChange={this.changeEndDay} value={this.state.endDay} placeholder="Day"/></div>
                            <div class="col-4 pl-1 pr-1"><input type="text" class="release-date form-control" onChange={this.changeEndMonth} value={this.state.endMonth} placeholder="Month"/></div>
                            <div class="col-5 pl-1"><input type="text" class="release-date form-control" onChange={this.changeEndYear} value={this.state.endYear} placeholder="Year"/></div>
                        </div>
                    </div>
                    <small id="release-help" class="form-text text-muted mb-2">Add planned releases for your project</small>
                    <Button onclick={this.add} text="Add release"/>
                </div>
                {
                    this.props.releases.length > 0 ?
                    <div class="releases col-xl-8 col-md-8 col-12">   
                        <div class="row p-3">
                        { 
                            this.props.releases.map(release => {
                                return <SingleRelease key={release.name} release={release} remove={this.props.remove}/>
                            })
                        }
                        </div>
                    </div>
                :   <div class="releases col-xl-8 col-md-8 col-12 d-flex justify-content-center">
                        <span class="align-self-center small-muted">No releases added yet</span>
                    </div>
                }
                
            </div>
        );
    }
}

export default Releases;