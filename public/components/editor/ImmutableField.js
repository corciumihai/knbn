import React from 'react';
import { connect } from 'react-redux';
import Label from './Label';
import Small from './Small';

const ImmutableField = (props) => {
    return (
        <div class={"form-group w-100 knbn-font-medium"}>
            <Label label={props.label}/>
            <div class={"knbn-fake-input form-control text-truncate knbn-transition" + 
            (props.themeToggled ? " knbn-dark-color-5x knbn-dark-border-2x" : " knbn-snow-color-5x knbn-snow-border-2x")}>
                {props.children}
            </div>
            <Small>{props.description}</Small>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(ImmutableField);