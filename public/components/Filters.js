import React from 'react';
import {connect} from 'react-redux';

class Filters extends React.Component{
    constructor(){
        super();
    }

    render(){
        return(
            <div class="row mb-3">
                <div class={"col-xl-12 py-2 knbn-border-top knbn-border-bottom knbn-transition" + (this.props.themeToggled ? " knbn-dark-bg-2x knbn-dark-border-2x" : " knbn-snow-bg-2x knbn-snow-border-2x")}>
                    <div class="row">
                        <div class={"px-3 mr-2 knbn-font-medium" + (this.props.themeToggled ? " knbn-dark-color-2x" : " knbn-snow-color-2x")}>Filtre</div>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return{
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(Filters);
