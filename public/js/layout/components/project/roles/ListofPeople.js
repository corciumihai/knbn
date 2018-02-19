import React from 'react';

class ListOfPeople extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="col-xl-6 col-12 list-of-people">
                <div class="container">
                    <div class="list-header row">
                        <div class="col"><label>List of people</label></div>
                    </div>
                    <div class="row">
                    {
                        !this.props.list.length ? 
                        <div class="no-roles col">No roles assigned yet</div>
                        :
                        <table class="users table table-responsive">
                            <thead>
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Title</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.props.list.map((item) => {
                                        return  <tr key={item.index}>
                                                    <th scope="row">{item.index + 1}</th>
                                                    <td>{item.name}</td>
                                                    <td>{item.title}</td>
                                                </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    }
                    </div>
                </div>
            </div>
        );
    }
}

export default ListOfPeople;