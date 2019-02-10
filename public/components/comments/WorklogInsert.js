import React from 'react';
import Label from '../editor/Label';
import ReactQuill from 'react-quill';
import EditButton from '../editor/EditButton';
import axios from 'axios';
import { connect } from 'react-redux';
import Small from '../editor/Small';
import Error from '../create/Error';
import AddButton from '../editor/AddButton';

class WorklogInsert extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            hours: 0,
            comment: '',
            error: ''
        }

        this.setComment = this.setComment.bind(this);
        this.setHours = this.setHours.bind(this);
        this.addComment = this.addComment.bind(this);
        this.resetError = this.resetError.bind(this);
    }

    setComment(value){
        this.setState({comment: value}, this.resetError);
    }

    setHours(event){
        this.setState({hours: event.target.value}, this.resetError);
    }

    addComment(){
        if(this.state.hours){
            this.props.add({hours: this.state.hours, comment: this.state.comment, owner: this.props.currentUser}); 
            this.setState({comment: '', hours: 0}, this.resetError);
        }
        else{
            this.setState({error: 'Adaugă numărul de ore petrecute'});
        }
    }

    resetError(){
        this.setState({error: ''})
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
                <Error>{this.state.error}</Error>

                <Label label="Adaugă raport muncă"/>

                <div class={"input-group knbn-transition knbn-bg-transparent knbn-border d-flex flex-row" + 
                    (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-3x")}>
                    <div class={"d-flex flex-column col px-0 knbn-border-right" + (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-3x")}>
                        <input  type="text" 
                                class={"form-control knbn-bg-transparent knbn-transition knbn-no-border-radius knbn-no-border knbn-font-medium knbn-no-box-shadow knbn-border-bottom" + (this.props.themeToggled == true ? 
                                " knbn-dark-color-4x knbn-dark-bg-2x-active knbn-dark-border-2x" 
                                : 
                                " knbn-snow-color-4x knbn-snow-bg-4x-active knbn-snow-border-3x")} 
                                aria-describedby="knbnHelp" 
                                placeholder={this.state.hours ? "" : "Introdu ore muncă"}
                                value={this.state.hours}
                                onChange={this.setHours}
                        />

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

export default connect(mapStateToProps)(WorklogInsert);