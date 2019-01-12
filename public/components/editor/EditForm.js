import React from 'react';

const EditForm = (props) => {
    return(
        <form class={"col-xl-4 col-12 px-0 knbn-bg-transparent" + (" " + props.classes)}>
            {props.children}
        </form>
    );
}

export default EditForm;