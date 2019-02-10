import React from 'react';
import { connect } from 'react-redux';

class DismissableError extends React.Component{
    constructor(){
        super();

        this.dismiss = this.dismiss.bind(this);
    }

    dismiss(){
        this.props.dismissError();
    }

    render(){
        return(
            this.props.children ? 
            <div class="row">
                <div class={"col-xl-12 knbn-error d-flex py-2 text-truncate mb-2" + (this.props.themeToggled ? " knbn-dark-error-color knbn-dark-bg-error" : " knbn-snow-error-color knbn-snow-bg-error")}>
                    {this.props.children}
                    <img class={"ml-auto my-auto knbn-pointer"} src={(this.props.themeToggled ? "./images/remove.svg" : "./images/bRemove.svg")} onClick={this.dismiss}/>
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

export default connect(mapStateToProps)(DismissableError);