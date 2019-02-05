import React from 'react';
import axios from 'axios';

class ReleaseDropdown extends React.Component{
    constructor(props){
        super(props);

        this.state = {releases: []}
        this.setRel = this.setRel.bind(this);
    }

    componentWillMount(){
        axios.get('release/multi/get').then(response => {
            this.setState({releases: response.data});
        }, () => {console.log(this.state.releases)})
    }

    setRel(rel, event){
        event.preventDefault();
        this.props.set(rel);
    }

    render(){
        return(
            <div class="col ticket-data modifiable py-1">
                <div class="row" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    { this.props.release != undefined && this.props.release.name.length > 0 ? <div class="edit-field ml-1" title="Release"><img src="/images/release.svg" class="d-block mx-auto"/></div> : null }
                    <div class="col text-truncate"> { this.props.release != undefined && this.props.release.name.length > 0 ? this.props.release.name : "Select release" }</div>
                    <div class="edit-field mr-1 float-right"><img src="/images/arr-dwn.svg" class="d-block mx-auto"/></div>
                </div>
                <div class="dropdown-menu tag w-100 modifiable">
                {
                    this.state.releases.length > 0 ?
                        this.state.releases.map(release => {
                            let bound = this.setRel.bind(this, release);
                            return <a class="dropdown-item text-truncate" key={release.key} href="#" onClick={bound}>{release.value}</a>
                        })
                    :
                    "No releases were found"
                }
                </div>
            </div>
        );
    }
}

export default ReleaseDropdown;