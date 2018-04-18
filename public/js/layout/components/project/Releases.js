import React from 'react';
import Button from './Button';
import SingleRelease from './SingleRelease';

class Releases extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            day: '',
            month: '',
            year: '',
        }

        this.add = this.add.bind(this);
        this.changeDay = this.changeDay.bind(this);
    }

    componentDidMount(){
        let date = new Date();
        this.setState({day: date.getDate()});
    }

    add(){
        console.log('added');
    }

    changeDay(event){
        this.setState({day: event.target.value});
    }

    render(){
        return(
            <div class="form-group mb-2 d-flex flex-xl-row flex-column">
                <div class="col-xl-3 col-md-3 col-12">
                    <label>Planned Releases</label>
                    <input type="text" class="release-name form-control col" id="release-name" aria-describedby="release-help" placeholder="Enter planned release"/>
                    <label class="mt-3 col" >Due Date</label>
                    <div class="row pl-3 pr-3">
                        <input type="text" class="release-date form-control col-3" onChange={this.changeDay} value={this.state.day} placeholder="Day"/>
                        <input type="text" class="release-date form-control col-4" onChange={this.change} placeholder="Month"/>
                        <input type="text" class="release-date form-control col-5" onChange={this.change} placeholder="Year"/>
                    </div>
                    <small id="release-help" class="form-text text-muted mb-2">Add planned releases for your project</small>
                    <Button onclick={this.add} text="Add release"/>
                </div>
                {
                    this.props.releases.length > 0 ?
                    <div class="releases col-xl-9 col-md-9 col-12">   
                        <div class="row p-3">
                        { 
                            this.props.releases.map(discipline => {
                                return <SingleRelease key={release.name} discipline={release} remove={this.props.remove}/>
                            })
                        }
                        </div>
                    </div>
                :   <div class="releases col-xl-9 col-md-9 col-12 d-flex justify-content-center">
                        <span class="align-self-center small-muted">No releases added yet</span>
                    </div>
                }
                
            </div>
        );
    }
}

export default Releases;