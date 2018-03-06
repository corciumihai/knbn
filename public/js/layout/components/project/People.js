import React from 'react';

class People extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            this.props.people.length > 0 ?
            <div class="row">
                <div class="col">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Number</th>
                                <th scope="col">Name</th>
                                <th scope="col">Position</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">1</th>
                                <td>Mark</td>
                                <td>Otto</td>
                            </tr>
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