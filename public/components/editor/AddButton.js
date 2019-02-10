import React from 'react'; 
import { connect } from 'react-redux';

const AddButton = (props) => {
    return(
        <div class="knbn-input-grp-append input-group-append d-flex knbn-transition knbn-bg-transparent knbn-pointer" onClick={props.save} title={"Salvează"}>
            <div class={"mx-1 d-flex my-auto knbn-bg-transparent knbn-transition"}>
                <img class={"knbn-edit-btn mx-auto"} src={props.themeToggled ? "./images/add.svg" : "./images/bAdd.svg"} />
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
    }
}

export default connect(mapStateToProps)(AddButton);