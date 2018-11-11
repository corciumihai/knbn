import React from 'react';
import axios from 'axios';
import Comment from './Comment';
import update from 'react-addons-update';

class CommentArea extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            input: '',
            comments: [],
            id: 0,
            error: '',
        }

        this.setComment = this.setComment.bind(this);
        this.insertComment = this.insertComment.bind(this);
        this.removeComment = this.removeComment.bind(this);
        // this.sortCom = this.sortCom.bind(this);
        this.saveComment = this.saveComment.bind(this);
    }

    componentWillMount(){
        //get comments for this ticket
        axios.get('/get/comments/' + this.props.ticketId).then(response => {
            if(response.data.length > 0)
                this.setState({comments: response.data});
        })
    }

    setComment(event){
        this.setState({input: event.target.value, error: ''});
    }

    insertComment(){
        if(this.state.input.length == 0){this.setState({error: 'Comment empty'}); return};
        let date = new Date().getTime();
        let comment = {val: this.state.input, ticketId: this.props.ticketId, created: date, lastModified: date}
        axios.post('/add/comment', comment).then(response => { 
            if(response.status == 200){
                this.setState({comments: update(this.state.comments, {$push: [comment]}), input: ''});
            }
         });
    }

    removeComment(comm){
        axios.post('/remove/comment', comm).then(response => {
            if(response.status == 200){
                this.setState({comments: update(this.state.comments, {$splice: [[(this.state.comments.findIndex(comment => {return comment.created == comm.created})), 1]]})});
            }
        });
        
    }

    saveComment(comm){
        let date = new Date();
        comm.lastModified = date.getTime();
        axios.post('/update/comment', comm).then(response => {
            if(response.status == 200){
                this.setState({comments: update(this.state.comments, {$splice: [[(this.state.comments.findIndex(comment => {return comment.id == comm.id})), 1]]})}, () => {
                    this.setState({comments: update(this.state.comments, {$push: [comm]}).sort((a, b) => {return b.created - a.created})}, () => {
                });
            });}
        });        
    }

    render(){        
        return(
            <div class="container-fluid">
                <div class="col-xl-12 comments tag px-3 py-3">
                    {
                        this.props.disabled ? 
                        <div class="row">
                            <div class="col-xl-6 col-12 comment">
                                Submitting comments is disabled when ticket is closed
                            </div>
                        </div> 
                        : 
                        <div class="row">
                            <div class="col-xl-6 col-12"><textarea type="text" class="form-control comment-text" onChange={this.setComment} value={this.state.input} placeholder="Comment"/></div>
                        </div>
                    }
                    {
                        this.props.disabled ? null : 
                        <div class="row ">
                            <div class="col-xl-8 col-12 mt-2">
                                <button type="button" class="submit btn btn-primary" onClick={this.insertComment}>Submit comment</button>
                            </div>
                            {
                                this.state.error.length > 0 ?   <div class="col-xl-8 col-12 mt-2">
                                                                    <span class="error">{this.state.error}</span>
                                                                </div>
                                                                :
                                                                null
                            }
                            
                        </div>
                    }
                    <div class="row">
                        <div class="container-fluid">
                        {
                            this.state.comments.length > 0 ? 
                                <div class="col mt-3 comment-container">
                               { 
                                   this.state.comments.map(comment => {
                                        return <Comment key={comment.created} data={comment} remove={this.removeComment} save={this.saveComment} disabled={this.props.disabled}/>
                                    })
                                }
                                </div>
                            : null
                        }
                        </div>
                    </div>
                </div>
            </div>
            
        );
    }
}

export default CommentArea;