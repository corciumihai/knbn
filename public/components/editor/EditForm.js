import React from 'react';

const EditForm = (props) => {
    return(
        <form class={"col-xl-4 col-12 knbn-bg-transparent" + (props.classes != undefined ? " " + props.classes : "")}>
            {props.children}
        </form>
    );
}

export default EditForm;