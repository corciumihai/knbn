import React from 'react'; 
import { connect } from 'react-redux';

const SaveButton = (props) => {
    return(
        <div class="knbn-input-grp-append input-group-append d-flex knbn-transition knbn-bg-transparent">
            <div class={"d-flex h-100 knbn-bg-transparent knbn-transition"}>
                <img    class={"knbn-edit-btn mx-auto my-auto"}
                        src="./images/save.svg"
                        onClick={props.edit ? props.save : props.enableEditMode} title={props.edit ? "Salvează" : "Editează"}></img>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
    }
}

export default connect(mapStateToProps)(SaveButton);