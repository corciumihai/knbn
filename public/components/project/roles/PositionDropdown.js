import React from 'react';

class PositionDropdown extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="col-xl-4 col-12">
                <label for="title">Position</label>
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {
                            this.props.position == undefined || this.props.position.length == 0 ? 
                            "Position"
                            :
                            this.props.position
                        }
                    </button>
                    {/* <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                        {
                            this.props.positions.length == 0 || this.props.positions == undefined ? 
                                <a href="#" class="dropdown-item">No roles added yet</a>
                                :
                                this.props.positions.map(role => {
                                    let boundClick = this.props.changePosition.bind(this, role);
                                    return <a href="#" key={role} onClick={boundClick} class="dropdown-item">{role}</a>
                                })
                        }
                    </div> */}
                </div>
                <small id="title-help" class="form-text text-muted">This is your employee position in this project</small>
            </div>
        );
    }
}

export default PositionDropdown;