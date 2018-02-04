import React from 'react';

class InputField extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="fields row">
                <div id="field" class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-12">{this.props.label}</div>
                <div id="field-value" class="col-xl-7 col-lg-7 col-md-7 col-sm-7 col-12">
                    {this.props.text.length > 50 ? this.props.text.substring(0, 50) + "..." : this.props.text}
                </div>
            </div>
        );
    }
}

export default InputField;