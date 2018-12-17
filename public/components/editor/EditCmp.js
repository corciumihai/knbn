import React  from 'react';
import ReactDOM from 'react-dom'
import EditField from './EditField';
import EditForm from './EditForm';
import EditTextArea from './EditTextArea';
import EditSelection from './EditSelection';
import axios from 'axios';

class EditCmp extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            releases: [],
        }

        this.fetchRealeases = this.fetchRealeases.bind(this);
    }

    fetchRealeases(filter){
        axios.get('/get-releases-with-filter/' + filter).then(response => {
           this.setState({releases: response.data});
        });
    }

    render(){
        return(
            <div class="container-fluid mt-3">
                <h3 class="knbn-header-3">Component Editor</h3>
                <EditForm classes="col-xl-4 col-12 px-0">
                    <EditField 
                    value='This is the component name'
                    label='Name' 
                    isTextArea={false}
                    description='Component name given when it was created'/>
                    <EditTextArea
                    value='<p>This is the component description</p>'
                    label='Description' 
                    description='Component description given when it was created'/>
                    <EditSelection
                    label="Release"
                    description='Release for this component'
                    fetch={this.fetchRealeases}
                    items={this.state.releases}
                    />
                </EditForm>
            </div>
        );
    }
}

ReactDOM.render(<EditCmp/>, document.getElementById('edit-cmp'));

export default EditCmp;