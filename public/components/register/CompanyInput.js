import React from 'react';

class CompanyInput extends React.Component{
    render(){
        return(
            <div class="form-group">
                <input 
                    type="text"
                    class={"form-control"} 
                    id="company"
                    placeholder="company"  
                    value={this.props.value} 
                    title={this.props.title} 
                    onChange={this.props.onChange}
                    onClick={this.props.onClick}
                />
            </div>
        );
    }
}

CompanyInput.defaultProps = {
    type: 'text',
    class: undefined,
    id: undefined,
    value: undefined,
    title: 'Please enter a company',
    onChange: undefined,
    onClick: undefined
}

export default CompanyInput;