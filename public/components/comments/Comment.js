import React from 'react';
import axios from 'axios';
import dateformat from 'dateformat';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
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

class Comment extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            canEdit: false,
            userData: {},
            editMode: false,
            comment: ''
        }

        this.save = this.save.bind(this);
        this.setEditMode = this.setEditMode.bind(this);
        this.setComment = this.setComment.bind(this);
        this.remove = this.remove.bind(this);
    }

    componentDidMount(){
        this.setState({comment: this.props.data.value}, () => {
            if(this.props.data.owner){
                axios.get('/user/' + this.props.data.owner).then(response => {
                    this.setState({userData: response.data, canEdit: response.data.email == this.props.currentUser});
                });
            }
        })
    }

    componentWillReceiveProps(nextProps, nextState){
        if(nextProps.data.value != this.state.comment){
            this.setState({comment: nextProps.data.value});
        }

        if(nextProps.data.owner){
            axios.get('/user/' + nextProps.data.owner).then(response => {
                this.setState({userData: response.data, canEdit: response.data.email == this.props.currentUser});
            });
        }
    }

    setComment(value){
        this.setState({comment: value});
    }

    remove(){
        this.props.remove({id: this.props.data.id});
    }

    save(){
        this.props.update({id: this.props.data.id, value: this.state.comment});
        this.setState({editMode: false, comment: ''});
    }

    setEditMode(){
        this.setState({editMode: true})
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
            <div class="col-xl-12">
                <div class="row mt-2 mb-2">
                    <div class="col-xl-12 d-flex flex-row">
                        <div class={"d-flex knbn-font-small" + (this.props.themeToggled ? " knbn-dark-color-5x" : " knbn-snow-color-5x")}>
                        {
                            this.state.userData && this.state.userData.name ?
                            <div>
                                <Link to={"/edit/profile/" + this.state.userData.email}>{this.state.userData.name}</Link>
                                {" \u00B7 " + dateformat(this.props.data.created, "dd mmmm yyyy")}
                            </div>
                            :
                            "Adăugat pe " + dateformat(this.props.data.created, "dd mmmm yyyy")
                        }
                        </div>

                        <div class="ml-auto d-flex flex-row"> 
                        {
                            this.state.userData.email == this.props.currentUser || this.props.isAdmin ? 
                            <div class={"knbn-font-small knbn-pointer px-2 py-1" + (this.props.themeToggled ? " knbn-dark-color-2x knbn-dark-onselect": " knbn-snow-color-2x knbn-snow-onselect")}
                            onClick={this.remove}>
                                Elimină
                            </div>
                            :null
                        }
                        {
                            this.state.userData.email == this.props.currentUser || this.props.isAdmin ? 
                            <div class={"knbn-font-small knbn-pointer px-2 py-1" + (this.props.themeToggled ? " knbn-dark-color-2x knbn-dark-onselect": " knbn-snow-color-2x knbn-snow-onselect")}
                            onClick={this.state.editMode ? this.save : this.setEditMode}>
                            {
                                this.state.editMode ? "Salvează" : "Editează"
                            }
                            </div>
                            :null
                        }
                        </div>
                    </div>
                        
                    <div class="col-xl-12">
                    {
                        this.state.editMode ? 
                        <div class={"knbn-border" + (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-3x")}>
                            <ReactQuill     modules={quillModules} 
                                            value={this.state.comment} 
                                            onChange={this.setComment} 
                                            className={"w-100 h-100 knbn-bg-transparent knbn-no-border knbn-edit-no-border" + (this.props.themeToggled ? " knbn-dark-color-5x knbn-dark-edit-bd-2x" : " knbn-snow-color-5x knbn-snow-edit-bd-2x")}
                            />
                        </div>
                        :
                        <RemoveItem remove={this.state.canEdit ? (e) => {e.preventDefault(); this.props.remove({id: this.props.data.id})} : null}>
                            {ReactHtmlParser(this.props.data.value)}
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
        currentUser: state.currentUser,
        isAdmin: state.isAdmin
    }
}

export default connect(mapStateToProps)(Comment);