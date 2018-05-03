import React from 'react';
import ReactDOM from 'react-dom';
import SelectItem from './SelectItem';
import ItemSetup from './ItemSetup';
import DueDate from './DueDate';

class CreateMain extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            type: '',
        }
    }

    render(){
        return(
            <div class="create col-xl-6 offset-xl-3">
                <SelectItem/>
                <DueDate/>
            </div>
        );
    }
}

ReactDOM.render(<CreateMain/>, document.getElementById('create'));

// export default CreateMain;