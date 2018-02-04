import React from 'react';

class DateSlider extends React.Component{
    constructor(props){
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(element, event){
        this.props.callback(element.name);
    }

    render(){
        return (
            <div class="date-slider col-xl-4 col-12">
                <div class="date-input-description container">{this.props.unit}</div> 
                <div class="container-fluid date-picker-container">
                    <div class="row d-flex flex-row">
                        <div class="date-range col">{ this.props.initialValue}</div>
                        <div class="date-picker-small-button float-right" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <img class="mx-auto d-block" src="./images/small-arrow-down.svg" />
                        </div>
                        <div class="dropdown-menu dropdown-menu-right">
                            {
                                this.props.allValues.map((element) => {
                                    let boundClick = this.onClick.bind(this, element);
                                    return <button key={element.value} className="dropdown-item" type="text" onClick={boundClick} value={element.name}>{element.name}</button>
                                })
                            }
                        </div> 
                    </div>
                </div>
            </div>
        );
    }

}

export default DateSlider;