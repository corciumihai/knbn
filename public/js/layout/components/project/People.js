import React from 'react';

class People extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            hideRows: true,
        }
        
        this.toggleRows = this.toggleRows.bind(this);
        // this.remove = this.remove.bind(this);
    }

    toggleRows(){
        this.setState({hideRows: !this.state.hideRows})
    }

    render(){
        return(
            this.props.people.length > 0 ?
            // People
            <div class="row"> 
                <div class="col">   
                    <div class="col d-flex justify-content-center">
                        <div class="toggle d-flex justify-content-center" onClick={this.toggleRows}>
                            <img src="./images/small-arrow-down.svg" class="mx-auto d-block" 
                                style={{transform: this.state.hideRows ? "rotate(180deg)": "rotate(0deg)"}}/>
                        </div>
                    </div>
                    <div class={"people col d-flex flex-row flex-wrap"}>
                    {this.state.hideRows ? 
                        this.props.people.map(person => {
                            let bound = this.props.remove.bind(this, person);
                            return  <div class="wrap d-flex flex-column" key={person.email}>
                                        <div class="to-close align-self-end" onClick={bound}><img src="/images/close.svg" class="mx-auto d-block"/></div>
                                        <div class="person d-flex flex-row">
                                            <div class="profile-picture d-flex">
                                                <div class="picture align-self-center"></div>
                                            </div>
                                            <div class="d-flex flex-column">
                                                <div class="name">{person.name}</div>
                                                <div class="divider"></div>
                                                <div class="position">{person.position}</div>
                                            </div>
                                        </div>
                                    </div>
                        })
                    :
                    <span class="small-text">A total of <span class="highlight">{this.props.people.length}</span> people are being toggled</span>
                    }
                    </div>
                </div>
            </div>
            :
            null
        );
    }
}

export default People;