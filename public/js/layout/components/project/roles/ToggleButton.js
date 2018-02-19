import React from 'react';

class ToggleButton extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            flipped: false,
        }

        this.flip = this.flip.bind(this);
    }

    flip(){
        this.setState({flipped: !this.state.flipped}, () => {
            this.props.changeVisibility();
        });
    }

    render(){
        return(
            <div class="toggle-button d-flex" onClick={this.flip}>
                <img src="./images/small-arrow-down.svg" class="mx-auto d-block align-self-center" 
                    style={this.state.flipped ? {transform:"rotate(0deg)"} : {transform:"rotate(180deg)"}}/>
            </div>
        );
    }
}

export default ToggleButton;