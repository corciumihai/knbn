import React from 'react'; 
import { connect } from 'react-redux';

const EditButton = (props) => {
    return(
        <div class="knbn-input-grp-append input-group-append d-flex knbn-transition knbn-bg-transparent knbn-pointer" onClick={props.edit ? props.save : props.enableEditMode} title={props.edit ? "Salvează" : "Editează"}>
            <div class={"mx-1 d-flex my-auto knbn-bg-transparent knbn-transition"}>
                <img class={"knbn-edit-btn mx-auto" + (props.themeToggled ? "" : " knbn-img-inverted")} src={props.edit ? "./images/save.svg" : "./images/edit.svg"} />
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