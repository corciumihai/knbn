import React from 'react';
import Search from '../Search';

class DeveloperName extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="row">
                <div class="col-xl-12 col-12">
                    <form class='name'>
                        <div class="form-group">
                            <label for="name">Developer name</label>
                            <input type="text" class="form-control" id="name" aria-describedby="help" placeholder="Enter developer name" onChange={this.props.onChange}/>
                            <small id="help" class="form-text text-muted">This is the developer's name</small>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default DeveloperName;