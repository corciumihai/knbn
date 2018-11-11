import React from 'react';

class TextArea extends React.Component{
    constructor(props){
        super(props);

        this.setValue = this.setValue.bind(this);
    }

    setValue(event){this.props.set(event.target.value);}

    render(){
        return(
            <div class="col">
                <div class="row"><div class="col">
                    <div class="form-group mb-0">
                        <textarea type="text" class="form-control" onChange={this.setValue} value={this.props.value} placeholder={this.props.placeholder}/>
                    </div>
                </div></div>
                <div class="row">
                {
                    this.props.error != undefined && this.props.error.length > 0 ?
                        <div class="col"><span class="error">{this.props.error}</span></div>
                        :   
                        null
                }
                </div>
            </div>
        );
    }
}

export default TextArea;