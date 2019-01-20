import React from 'react';
import Label from '../editor/Label';
import ReactQuill from 'react-quill';
import EditButton from '../editor/EditButton';
import axios from 'axios';
import { connect } from 'react-redux';
import Small from '../editor/Small';

class CommentInsert extends React.Component{
    render(){
        let quillModules = {
            toolbar: [
              ['bold', 'italic', 'underline','strike', 'blockquote'],
              [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
              ['link'],
              ['clean']
            ],
        }

        return(
            <div class="form-group knbn-bg-transparent">
                <Label label="Adaugă comentariu"/>

                <div class={"knbn-input-grp knbn-fake-input-grp input-group knbn-transition knbn-bg-transparent" + 
                    (this.props.themeToggled ? " knbn-dark-onselect knbn-dark-border-2x" : " knbn-snow-onselect knbn-snow-border-2x")}>

                    <ReactQuill modules={quillModules} value={this.state.comment} onChange={this.setComment} className={"w-100 h-100 knbn-bg-transparent knbn-no-border knbn-edit-no-border" 
                    + (this.props.themeToggled ? " knbn-dark-color-5x knbn-dark-edit-bd-2x" : " knbn-snow-color-5x knbn-snow-edit-bd-2x")
                    }/>
                    <div class="ml-auto">
                        <EditButton edit={true} save={this.addComment}/>
                    </div>
                </div> 

                <Small>{this.props.description}</Small>
            </div>
        );
    }
    
    constructor(props){
        super(props);

        this.state = {
            comment: '',
        }

        this.setComment = this.setComment.bind(this);
        this.addComment = this.addComment.bind(this);
    }

    setComment(value){
        this.setState({comment: value});
    }

    addComment(){
        if(this.state.comment.length > 0){
            this.props.add(this.state.comment); 
            this.setState({comment: ''});
        }
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
        currentUser: state.currentUser
    }
}

export default connect(mapStateToProps)(CommentInsert);