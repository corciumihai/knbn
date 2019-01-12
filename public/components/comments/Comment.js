import React from 'react';
import EditTextArea from '../editor/EditTextArea';
import axios from 'axios';
import TouchButtonRight from '../editor/TouchButtonRight';
import TouchButtonLeft from '../editor/TouchButtonLeft';
import dateformat from 'dateformat';
import { connect } from 'react-redux';
import SelectionRemover from '../create/SelectionRemover';
import ReactHtmlParser from 'react-html-parser';
import RemoveItem from '../create/RemoveItem';

class Comment extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            canEdit: false,
            userData: {}
        }

        this.updateComment = this.updateComment.bind(this);
    }

    updateComment(value){
        if(this.props.data.value != value){
            axios.post('/component/update-comment', {
                id: this.props.data.id,
                value: value,
            });
        }
    }

    componentWillMount(){
        if(this.props.data.author != undefined){
            this.setState({canEdit: this.props.currentUser.email == this.props.data.author}, () => {
                axios.get('/user/get-user-by-email/' + this.props.data.author).then(response => {
                    if(response.data.success == true){
                        console.log(this.props.currentUser.email == this.props.data.author);
                        this.setState({userData: response.data});
                    }
                });
            })
        }
    }

    render(){        
        return(
            <div class={"knbn-comment" + (this.props.themeToggled ? " knbn-dark-color-5x" : " knbn-snow-color-5x")}>
                {this.props.data.value != undefined || this.props.value.length > 0 ?
                <div class="w-100 knbn-font-small d-flex flex-column mb-1 px-0">
                    <div class="d-flex flex-row col-xl-12 px-0 mb-2">
                    {   
                        this.state.userData.name == undefined || this.state.userData.name.length == 0 ? 
                            null 
                            : 
                            <div class="d-flex flex-row">
                                <TouchButtonLeft>{this.state.userData.name}</TouchButtonLeft>
                                <div class="knbn-dark-color-2x"> on {dateformat(new Date(parseInt(this.props.data.created)), "dS \u00B7 mmmm \u00B7 yyyy")}</div>
                            </div>
                    }
                    {
                        this.state.canEdit ? 
                        (
                            <TouchButtonRight action={(e) => {e.preventDefault();}}>Edit</TouchButtonRight>
                        )
                        : null
                    }
                    </div>

                    <RemoveItem item={ReactHtmlParser(this.props.data.value)} classes="py-2" remove={this.state.canEdit ? (e) => {e.preventDefault(); this.props.remove(this.props.data.id)} : null}/>

                    {/* <EditTextArea
                        value={this.props.data.value}
                        canEdit={this.state.canEdit}
                        save={this.updateComment}
                        classes={"knbn-font-small"}
                    /> */}
                </div>
                :
                null
                }
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

export default connect(mapStateToProps)(Comment);