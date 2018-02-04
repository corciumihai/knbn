import React from 'react';

class Remember extends React.Component{
    render(){
        return(
            <div class="form-check">
                <label class="form-check-label custom-control custom-checkbox">
                    <input 
                        id={this.props.id} 
                        type="checkbox" 
                        class="custom-control-input" 
                        checked={this.props.checked} 
                        onChange={this.props.onChange}
                    />
                    <span class="custom-control-indicator"></span>
                    <span 
                        id='remember-text'>
                            Remember password
                    </span>
                </label>
            </div>
        );
    }
}

export default Remember;