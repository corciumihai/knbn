import React from 'react';

class TextArea extends React.Component{
    constructor(props){
        super(props);

        this.setValue = this.setValue.bind(this);
    }

    setValue(event){this.props.set(event.target.value);}

    render(){
        return(
            <div class="row mb-2 pt-3 pb-3">
                <div class="col-xl-3 pr-0 info mb-xl-0 mb-2">
                    <div class="row d-flex h-100">
                        {
                            this.props.mandatory ? 
                            <div class="warning ml-3 align-self-center" title="This is a mandatory field"><img src="./images/warning.svg" class="d-block mx-auto"/></div>
                            :null
                        }
                        <div class="col d-flex"><span class="align-self-center">{this.props.title}</span></div>
                    </div>
                </div>
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
            </div>
        );
    }
}

export default TextArea;