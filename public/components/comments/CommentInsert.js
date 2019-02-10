import React from 'react';
import Label from '../editor/Label';
import ReactQuill from 'react-quill';
import EditButton from '../editor/EditButton';
import axios from 'axios';
import { connect } from 'react-redux';
import Small from '../editor/Small';
import SaveButton from '../editor/SaveButton';
import AddButton from '../editor/AddButton';

class CommentInsert extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            comment: '',
            error: ''
        }

        this.setComment = this.setComment.bind(this);
        this.add = this.add.bind(this);
    }
    
    add(){
        if(this.state.comment){
            let item = {owner: this.props.currentUser, created: new Date(), value: this.state.comment}
            this.props.add(item);
            this.setState({comment: ''});
        }
        else{
            this.setState({error: 'Introdu un comentariu'});
        }
    }

    setComment(value){
        this.setState({comment: value})
    }

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

                <div class={"input-group knbn-transition knbn-bg-transparent knbn-border d-flex flex-row" + 
                    (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-3x")}>
                    <div class={"d-flex flex-column col px-0 knbn-border-right" + (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-3x")}>
                        <ReactQuill modules={quillModules} 
                                    value={this.state.comment} 
                                    onChange={this.setComment} 
                                    className={"w-100 h-100 knbn-bg-transparent knbn-no-border knbn-edit-no-border" + (this.props.themeToggled ? " knbn-dark-color-5x knbn-dark-edit-bd-2x" : " knbn-snow-color-5x knbn-snow-edit-bd-2x")}
                        />
                    </div>
                    <AddButton save={this.add}/>
                </div>

                <Small>{this.props.description}</Small>
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

export default connect(mapStateToProps)(CommentInsert);