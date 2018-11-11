import React from 'react';
import dateformat from 'dateformat';

class Comment extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            editText: false,
            comment: '',
        }

        this.setEditText = this.setEditText.bind(this);
        this.saveComment = this.saveComment.bind(this);
        this.setComment = this.setComment.bind(this);
    }

    componentWillMount(){
        
        this.setState({comment: this.props.data.val})
    }

    setComment(event){
        this.setState({comment: event.target.value});
    } 

    setEditText(){
        this.setState({editText: !this.state.editText});
    }

    saveComment(){
        let comm = this.props.data;
        
        if(this.state.comment == this.props.data.text){this.setState({editText: false})}
        else{
            comm.val = this.state.comment;
            this.setState({editText: false}, this.props.save(comm));
        }
        
    }

    render(){
        let remove = this.props.remove.bind(this, this.props.data);
        return(
            <div class="row">
                <div class="col-xl-12 comment mb-3">
                    <div class="row">
                        <div class="col user-text">
                            <div class="row">
                                <div class="col py-1 align-self-center">Comment wrote on {dateformat(this.props.data.created, 'dd.mm.yyyy')}
                                    (last modified on {dateformat(this.props.data.lastModified, 'dd.mm.yyyy')})</div>
                                
                                {this.props.disabled ? null:
                                    <div class="col-xl-2 align-self-end d-flex justify-content-xl-end justify-content-center">
                                        <div class="edit-field edit d-flex mr-2 my-1 alig-self-end" title="Edit">
                                        {
                                            !this.state.editText ? <img src="/images/edit.svg" class="d-block mx-auto" onClick={this.setEditText}/>:
                                            <img src="/images/save.svg" class="d-block mx-auto" onClick={this.saveComment}/>
                                        }
                                        
                                        </div>
                                        <div class="edit-field edit d-flex my-1 alig-self-end" title="Remove" onClick={remove}><img src="/images/close.svg" class="d-block mx-auto"/></div>
                                    </div>
                                }
                                    
                            </div>
                        </div>
                    </div>
                    {
                        !this.state.editText ? 
                        <div class="row"><div class="col py-2 comment-space px-3">{this.props.data.val}</div></div>
                        :
                        <div class="row"><textarea type="text" class="form-control comment-edit px-3 py-2" onChange={this.setComment} value={this.state.comment}/></div>
                    }
                </div>
            </div>
        );
    }
}

export default Comment;