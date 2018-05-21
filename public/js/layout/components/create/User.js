import React from 'react';
import DropdownSearch from './DropdownSearch';

class User extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="col-xl-6">
                <div class="row">
                    <div class="col-xl-5 pr-0 info mb-xl-0 mb-2">
                        <div class="row d-flex h-100">
                            <div class="warning ml-3 align-self-center" title="This is a mandatory field"><img src="./images/warning.svg" class="d-block mx-auto"/></div>
                            <div class="col d-flex"><span class="align-self-center">{this.props.title}</span></div>
                        </div>
                    </div>
                    <div class="col-xl-7 pb-xl-0 pb-2">
                        <div class="row">
                            <div class="col-xl-12">
                                <DropdownSearch list={this.props.users} item={{value: this.props.name, key: this.props.id}} 
                                    fetch={this.props.fetch} onClick={this.props.set} loading={this.props.loading} placeholder="Reporter"/>
                            </div>
                        {
                            this.props.error != undefined && this.props.error.length > 0 ?
                                <div class="col-xl-12"><span class="error">{this.props.error}</span></div>
                                :   
                                null
                        }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default User;