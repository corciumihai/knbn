import React from 'react';

class People extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            hideRows: true,
        }
        
        this.toggleRows = this.toggleRows.bind(this);
    }

    toggleRows(){
        this.setState({hideRows: !this.state.hideRows})
    }

    render(){
        return(
            this.props.people.length > 0 ?
            // People
            <div class="row"> 
                <div class="col">   
                    <div class="col d-flex justify-content-center">
                        <div class="toggle d-flex justify-content-center" onClick={this.toggleRows}><img src="./images/small-arrow-down.svg" class="mx-auto d-block" 
                            style={{transform: this.state.hideRows ? "rotate(180deg)": "rotate(0deg)"}}/></div>
                    </div>
                    <table class="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <td scope="col">#</td>
                                <td scope="col">Name</td>
                                <td scope="col">Position</td>
                            </tr>
                        </thead>
                        <tbody style={{display: this.state.hideRows ? "" : "none"}}>
                        {  
                            this.props.people.map(person => {
                                return(
                                <tr key={person.name}>
                                    <th scope="row">{person.index}</th>
                                    <td>{person.name}</td>
                                    <td>{person.position}</td>
                                </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>
            :
            null
        );
    }
}

export default People;