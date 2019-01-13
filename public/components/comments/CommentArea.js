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

        this.addComment = this.addComment.bind(this);
        this.removeComment = this.removeComment.bind(this);
        this.update = this.update.bind(this);
    }

    addComment(value){
        axios.post('/add-component-comment', {
            author: this.props.currentUser.email,
            id: this.props.id,
            value: value,
            created: new Date().getTime()
        })
        .then(response => {
            if(response.data.success == true){
                this.update();
            }
        })
    }

    componentWillMount(){
        this.update();
    }

    componentWillReceiveProps(nextProps, nextState){
        if(nextProps.id != this.props.id){
            this.update(nextProps.id);
        }
    }

    update(value){
        if(value != undefined){
            axios.get('/get-component-comments/' + value)
            .then(response => {
                this.setState({compComments: response.data});
            });
        }
        else{
            axios.get('/get-component-comments/' + this.props.id)
            .then(response => {
                this.setState({compComments: response.data});
            });
        }
    }

    removeComment(id){
        axios.post('/remove-comment', {id: id})
        .then(response => {
            if(response.data.success == true){
                this.update();
            }
        })
    }

    render(){
        return(
            <div class={"knbn-comment-area w-100 knbn-border knbn-no-border-left knbn-no-border-right knbn-no-border-bottom knbnb-bg-transparent" + 
            (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-2x")}>
                <div class="col-xl-12 col-12 d-flex mt-2">
                    <Header2>Comentarii</Header2>
                </div>
                <div class={"container-fluid knbn-transition knbn-bg-transparent"}>
                    <div class={"col-12 px-0 knbn-border-bottom pt-2" + (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-2x")}>
                        <div class={"col-xl-4 px-0 knbn-transition knbn-bg-transparent"}>
                        {    
                            this.state.compComments.length > 0 ? 
                                this.state.compComments.map(item => {
                                    return <Comment data={item} key={item.id} remove={this.removeComment}/>
                                })
                                : null
                        }
                        </div>
                    </div>

                    <div class={"col-12 px-0 knbn-border-bottom" + (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-2x")}>
                        <div class={"col-xl-4 px-0 knbn-transition knbn-bg-transparent"}>
                            <CommentInsert id={this.props.id} add={this.addComment}/>
                        </div>
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