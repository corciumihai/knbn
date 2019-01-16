import React from 'react';
import {connect} from 'react-redux';

class TouchButtonLeft extends React.Component{
    render(){
        return(
            <div class="knbn-font-small ml-auto">
                <a  href="" 
                    onClick={(this.props.action != undefined ? this.props.action : null)} 
                    class={"knbn-self-assign knbn-edit-field w-100 px-2 py-1 knbn-transition" + 
                (this.props.themeToggled == true ? 
                    " knbn-dark-color-3x knbn-dark-color-3x-active" 
                    : 
                    " knbn-snow-color-3x knbn-snow-color-3x-active")}>{this.props.children}</a>
            </div> 
        );
    }

    constructor(props){
        super(props);
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(TouchButtonLeft);