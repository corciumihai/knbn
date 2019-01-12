import React from 'react'; 
import { connect } from 'react-redux';

const EditButton = (props) => {
    return(
        <div class="knbn-input-grp-append input-group-append d-flex knbn-transition knbn-bg-transparent">
            <div class={"input-group-text mx-1 d-flex my-auto knbn-bg-transparent knbn-transition"}>
                <img class={"knbn-edit-btn mx-auto" + (props.themeToggled ? " knbn-img-inverted" : "")} 
                src={props.edit ? "./images/saveLight.svg" : "./images/editLight.svg"} 
                onClick={props.edit ? props.save : props.enableEditMode} title={props.edit ? "Save" : "Edit"}></img>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
    }
}

export default connect(mapStateToProps)(EditButton);