import React from 'react';
import axios from 'axios';
import dateformat from 'dateformat';
import { connect } from 'react-redux';
import ReactHtmlParser from 'react-html-parser';
import RemoveItem from '../create/RemoveItem';
import ReactQuill from 'react-quill';

dateformat.i18n = {
    dayNames: [
        'Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâ',
        'Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'
    ],
    monthNames: [
        'Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
    ],
    timeNames: [
        'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
    ]
};

let quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link'],
      ['clean']
    ],
}

class Worklog extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            canEdit: false,
            userData: {},
            editMode: false,
            comment: '',
            hours: 0
        }

        this.setEditMode = this.setEditMode.bind(this);
        this.save = this.save.bind(this);
        this.setComment = this.setComment.bind(this);
        this.setHours = this.setHours.bind(this);
        this.remove = this.remove.bind(this);
    }

    componentWillMount(){
        if(this.props.data.comment){
            this.setState({comment: this.props.data.comment})
        }

        if(this.props.data.hours){
            this.setState({hours: this.props.data.hours});
        }

        if(this.props.data.owner != undefined){
            axios.get('/user/get-user-by-email/' + this.props.data.owner).then(response => {
                this.setState({userData: response.data, canEdit: this.props.currentUser == response.data.email});
            });
        }
    }

    componentWillReceiveProps(nextState, nextProps){
        if(nextState.data.comment != this.state.comment){
            this.setState({comment: nextState.data.comment, h})
        }

        if(nextState.data.hours){
            this.setState({hours: nextState.data.hours});
        }

        if(nextState.data.owner != undefined){
            axios.get('/user/get-user-by-email/' + nextState.data.owner).then(response => {
                this.setState({userData: response.data});
            });
        }
    }

    setEditMode(){
        this.setState({editMode: !this.state.editMode})
    }

    setComment(value){
        this.setState({comment: value});
    }

    setHours(event){
        this.setState({hours: event.target.value});
    }

    save(){
        let item = {comment: this.state.comment, hours: this.state.hours, id: this.props.data.id}
        this.props.update(item);
        this.setState({editMode: false});
    }

    remove(){
        this.props.remove({id: this.props.data.id});
    }

    render(){
        return(
            <div class="col-xl-12">
                <div class="row mt-2 mb-2">
                    <div class="col-xl-12 d-flex flex-row">
                        <div class={"d-flex knbn-font-small text-truncate" + (this.props.themeToggled ? " knbn-dark-color-5x" : " knbn-dark-color-5x")}>
                        {
                            this.state.userData && this.state.userData.name ?
                            this.state.userData.name + " \u00B7 " + this.props.data.hours + " ore \u00B7 " + dateformat(this.props.data.created, "dd mmmm yyyy")
                            :
                            this.props.data.hours + " ore \u00B7 " + dateformat(this.props.data.created, "dd mmmm yyyy")
                        }
                        </div>

                        <div class="ml-auto"> 
                            <div class={"knbn-font-small knbn-pointer px-2 py-1" + (this.props.themeToggled ? " knbn-dark-color-2x knbn-dark-onselect": " knbn-snow-color-2x knbn-snow-onselect")}
                                onClick={this.state.editMode ? this.save : this.setEditMode}>
                                {
                                    this.state.editMode ? "Salvează" : "Editează"
                                }
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-12">
                    {
                        this.state.editMode ? 
                        <div class={"knbn-border" + (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-2x")}>
                            <input  type="text" 
                                    class={"knbn-input form-control knbn-editing-mode knbn-bg-transparent knbn-transition knbn-no-border-radius knbn-no-border knbn-font-medium knbn-no-box-shadow knbn-border-bottom" + (this.props.themeToggled == true ? 
                                    " knbn-dark-color-4x knbn-dark-bg-2x knbn-dark-bg-2x-active knbn-dark-border-2x" 
                                    : 
                                    " knbn-snow-color-4x knbn-snow-bg-2x knbn-snow-bg-4x-active knbn-snow-border-2x")} 
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
                        :
                        <RemoveItem remove={this.state.canEdit ? (e) => {e.preventDefault(); this.remove();} : null}>
                        {
                            this.props.data.comment ? ReactHtmlParser(this.props.data.comment) : <div class={this.props.themeToggled ? "knbn-dark-color-2x" : "knbn-snow-color-2x"}>Fără comentariu</div>
                        }
                        </RemoveItem>
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

export default connect(mapStateToProps)(Worklog);