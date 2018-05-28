import React from 'react';
import axios from 'axios';

class CategoryDropdown extends React.Component{
    constructor(props){
        super(props);

        this.state = {disciplines: []}
    }

    componentWillMount(){
        axios.get('/get-disciplines').then(response => {
            this.setState({disciplines: response.data});
        });
    }

    render(){
        return(
            <div class="col ticket-data modifiable py-1">
                <div class="row" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    { this.props.discipline.name.length > 0 ? <div class="edit-field ml-1" title="Category"><img src="/images/category.svg" class="d-block mx-auto"/></div> : null }
                    <div class="col"> { this.props.discipline.name.length > 0 ? this.props.discipline.name : "Select category" }</div>
                    <div class="edit-field mr-1 float-right"><img src="/images/arr-dwn.svg" class="d-block mx-auto"/></div>
                </div>
                <div class="dropdown-menu tag w-100 modifiable">
                {
                    this.state.disciplines.length > 0 ?
                        this.state.disciplines.map(discipline => {
                            let bound = this.props.set.bind(this, discipline);
                            return <a class="dropdown-item" key={discipline.key} href="#" onClick={bound}>{discipline.value}</a>
                        })
                    :
                    "No disciplines were found"
                }
                </div>
            </div>
        );
    }
}

export default CategoryDropdown;