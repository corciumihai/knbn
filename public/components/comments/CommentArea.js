import React from 'react';
import { connect } from 'react-redux';

class CommentArea extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class={"col-xl-12 knbn-comment-area knbn-border knbn-no-border-left knbn-no-border-right knbn-no-border-bottom knbnb-bg-transparent" + 
            (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-2x")}>
                <div class="row">
                    <div class={"col-xl-12 knbn-font-small mt-2 mb-2 knbn-border-bottom" + (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-2x")}>
                        <ul class="nav nav-pills mb-2">
                            <li class="nav-item" onClick={(e) => {e.preventDefault(); this.props.toggle(false)}}>
                                <div class={"nav-link btn knbn-no-radius knbn-no-border-right knbn-bg-transparent" + 
                                (this.props.themeToggled ? " knbn-dark-border-2x knbn-dark-bg-2x-active knbn-dark-color-2x" + (!this.props.flag ? " knbn-dark-bg-2x-full-active knbn-dark-color-5x" : "") : " knbn-snow-bg-2x knbn-snow-border-2x knbn-snow-bg-2x-active knbn-snow-color-2x")  + (!this.props.flag ? " knbn-dark-bg-2x-full-active knbn-snow-color-5x" : "")}>
                                    Comentarii
                                </div>
                            </li>

                            <li class="nav-item" onClick={(e) => {e.preventDefault(); this.props.toggle(true)}}>
                                <div class={"nav-link btn knbn-no-radius knbn-bg-transparent" + 
                                (this.props.themeToggled ? " knbn-dark-border-2x knbn-dark-color-2x knbn-dark-bg-2x-active"  + (this.props.flag ? " knbn-dark-bg-2x-full-active knbn-dark-color-5x" : "") : " knbn-snow-border-2x knbn-snow-color-2x knbn-snow-bg-2x-active" + (this.props.flag ? " knbn-dark-bg-2x-full-active knbn-snow-color-5x" : ""))}>
                                    Înregistrare muncă
                                </div>
                            </li>
                        </ul>
                    </div>
                    {
                        this.props.children
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
    }
}

export default connect(mapStateToProps)(CommentArea);