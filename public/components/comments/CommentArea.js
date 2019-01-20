import React from 'react';
import CommentInsert from './CommentInsert';
import Comment from './Comment';
import axios from 'axios';
import update from 'react-addons-update';
import Header2 from '../editor/Header3';
import { connect } from 'react-redux';

class CommentArea extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            compComments: [],
        }
    }

    render(){
        return(
            <div class={"col-xl-12 knbn-comment-area knbn-border knbn-no-border-left knbn-no-border-right knbn-no-border-bottom knbnb-bg-transparent" + 
            (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-2x")}>
                <div class="row">
                    <div class="col-xl-12 knbn-font-small mt-2 mb-2">
                        <ul class="nav nav-pills">
                            <li class="nav-item">
                                <div class={"nav-link active btn knbn-no-radius knbn-no-border-right" + 
                                (this.props.themeToggled ? " knbn-dark-bg-2x knbn-dark-border-2x knbn-dark-bg-2x-active" : " knbn-snow-bg-2x knbn-snow-border-2x knbn-snow-bg-2x-active")}>
                                    Comentarii
                                </div>
                            </li>

                            <li class="nav-item">
                                <div class={"nav-link btn knbn-no-radius" + 
                                (this.props.themeToggled ? " knbn-dark-border-2x knbn-dark-color-2x knbn-dark-bg-2x-active" : " knbn-snow-border-2x knbn-snow-color-2x knbn-snow-bg-2x-active")}>
                                    Înregistrare muncă
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div class={"col-xl-12 knbn-transition knbn-bg-transparent"}>
                    {    
                        this.props.comments.length > 0 ? 
                            this.props.comments.map(item => {
                                return <Comment data={item} key={item.id} remove={this.props.remove}/>
                            })
                            : null
                    }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
        currentUser: state.currentUser
    }
}

export default connect(mapStateToProps)(CommentArea);