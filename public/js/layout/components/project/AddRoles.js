import React from 'react';

class AddRoles extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            role: "",
        }

        this.onChange = this.onChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    onChange(event){
        this.setState({role: event.target.value});
    }

    onKeyDown(event){
        if(event.keyCode == 13){
            event.preventDefault();
            this.props.add(this.state.role.trim());
            this.setState({role: ""});
        }
    }

    onClick(event){
        event.preventDefault();
        this.props.add(this.state.role.trim());
        this.setState({role: ""});
    }

    render(){
        return(
            <div class="form-group mb-2">
                <div class="col">
                    <label for="add-role">Add roles in your project</label>
                    <input type="text" class="form-control" id="add-role" aria-describedby="add-role-help" placeholder="Enter position" 
                        onChange={this.onChange} onKeyDown={this.onKeyDown} value={this.state.role}/>
                    <small id="add-role-help" class="form-text text-muted" >Separate positions with ','/ Add them with 'Enter'</small>
                </div>
                <div class="col-auto">
                    <button type="submit" class="btn button mb-2 col-xl-2 col-12" onClick={this.onClick}>Add position</button>
                </div>
            </div>
        
        );
    }
}

export default AddRoles;