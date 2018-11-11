import React from 'react';

class Estimation extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            tempEstimation: 0,
        }

        this.set = this.set.bind(this);
        this.setOnKeyPress = this.setOnKeyPress.bind(this);
    }

    componentWillMount(){
        this.setState({tempEstimation: this.props.est});
    }

    set(event){
        this.setState({tempEstimation: event.target.value});
    }

    setOnKeyPress(event){
        if(event.charCode != 13){return;}
        this.props.set(this.state.tempEstimation);
    }

    render(){
        let bound = this.props.set.bind(this, this.state.tempEstimation)
        return(
            <div class="row">
                <div class="edit-field ml-1" title="Estimation"><img src="/images/estimation.svg" class="d-block mx-auto"/></div>
                <div class="col text-truncate">
                    <input type="number" class="form-control py-0 px-0 form-small-font" onChange={this.set} value={this.state.tempEstimation} onKeyPress={this.setOnKeyPress}/>
                </div>
                <div class="edit-field mr-1" onClick={bound} title="Save"><img src="/images/save.svg" class="d-block mx-auto"/></div>
            </div>
        );
    }
}

export default Estimation;