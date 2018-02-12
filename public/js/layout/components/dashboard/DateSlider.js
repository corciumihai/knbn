import React from 'react';

class DateSlider extends React.Component{
    constructor(props){
        super(props);
        this.onClick = this.onClick.bind(this);
        this.onChange =this.onChange.bind(this);
    }

    onClick(element, event){
        this.props.callback(element.name);
    }

    onChange(event){
        //check if the value is in the this.props.allValues list
        return;
    }

    render(){
        return (
            <div class="date-slider col-xl-4 col-12">
                <div class="container small-pad">
                    <div class="row">
                        <div class="date-input-description col">{this.props.unit}</div> 
                    </div>
                    <div class="form-group row date-input-wrapper">
                        <div class="col no-pad">
                            <input class="form-control date-input" onChange={this.onChange} value={this.props.initialValue}/>
                        </div>
                        <div class="date-picker-button d-flex" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <img class="mx-auto d-block align-self-center" src="./images/small-arrow-down.svg" />
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