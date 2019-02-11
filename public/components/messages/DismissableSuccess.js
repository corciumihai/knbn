import React from 'react';
import { connect } from 'react-redux';

class DismissableSucces extends React.Component{
    constructor(){
        super();
    }

    render(){
        return(
            this.props.children ? 
            <div class="col-12">
                <div class="row">
                    <div class={"col-xl-12 knbn-font-small d-flex py-2 text-truncate mb-2" + (this.props.themeToggled ? " knbn-dark-success-color knbn-dark-bg-success" : " knbn-snow-success-color knbn-snow-bg-success")}>
                        {this.props.children}
                        <img class={"ml-auto my-auto knbn-pointer"} src={(this.props.themeToggled ? "./images/remove.svg" : "./images/bRemove.svg")} onClick={this.props.dismiss}/>
                    </div>
                </div>
            </div>
            :
            null
        )
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(DismissableSucces);