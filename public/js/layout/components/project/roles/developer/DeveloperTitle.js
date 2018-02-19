import React from 'react';

class DeveloperTitle extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="row">
                <div class="col">
                    <form class='developer-title'>
                        <div class="form-group">
                            <label for="developer-title">Developer title</label>
                            <input type="text" class="form-control" id="developer-title" aria-describedby="developer-title-help" placeholder="Enter developer title"
                                onChange={this.props.onChange}/>
                            <small id="developer-title-help" class="form-text text-muted">This is the developer's title</small>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default DeveloperTitle;