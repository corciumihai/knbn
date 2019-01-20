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
            userData: {}
        }

        this.updateComment = this.updateComment.bind(this);
    }

    updateComment(value){
        // if(this.props.data.value != value){
        //     axios.post('/component/update-comment', {
        //         id: this.props.data.id,
        //         value: value,
        //     });
        // }
    }

    componentWillMount(){
        if(this.props.data.owner != undefined){
            axios.get('/user/get-user-by-email/' + this.props.data.owner).then(response => {
                this.setState({userData: response.data});
            });
        }
    }

    componentWillReceiveProps(nextState, nextProps){
        if(nextState.data.owner != undefined){
            axios.get('/user/get-user-by-email/' + nextState.data.owner).then(response => {
                this.setState({userData: response.data});
            });
        }
    }

    render(){        
        return(
            <div class="row mt-2 mb-2">
                <div class={"col-xl-12 d-flex knbn-font-small" + (this.props.themeToggled ? " knbn-dark-color-2x" : " knbn-dark-color-2x")}>
                    {
                        this.state.userData && this.state.userData.name ?
                        "Adăugat de " + this.state.userData.name + " pe data de " + dateformat(new Date(this.props.data.created), "dd mmmm yyyy")
                        :
                        "Adăugat pe data de " + dateformat(new Date(this.props.data.created), "dd mmmm yyyy")
                    }
                </div>
                <div class="col-xl-12">
                    <RemoveItem remove={this.state.canEdit ? (e) => {e.preventDefault(); this.props.remove(this.props.data.id)} : null}>
                        {ReactHtmlParser(this.props.data.value)
                    }</RemoveItem>
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

export default connect(mapStateToProps)(Comment);