import React from 'react';
import ReactDom from 'react-dom';

class CreateProject extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class='project'>
            </div>
        );
    }
}

ReactDom.render(<CreateProject/>, document.getElementById('project'));

export default CreateProject;