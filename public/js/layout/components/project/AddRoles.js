import React from 'react';

class AddRoles extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            role: "",
        }

        this.onChange = this.onChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
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

    render(){
        return(
            <div class="row">
                <div class="col">
                    <form class='add-role'>
                        <div class="form-group">
                            <label for="add-role">Add roles in your project</label>
                            <input type="text" class="form-control" id="add-role" aria-describedby="add-role-help" placeholder="Enter role" 
                                onChange={this.onChange} onKeyDown={this.onKeyDown} value={this.state.role}/>
                            <small id="add-role-help" class="form-text text-muted">Add your roles above</small>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default AddRoles;