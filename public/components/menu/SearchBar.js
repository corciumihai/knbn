import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled
    }
}

class SearcBar extends React.Component {
    constructor(){
        super();

        this.state = {
            searchedTerm: ''
        }

        this.setValue = this.setValue.bind(this);
        this.search = this.search.bind(this);
    }

    componentWillReceiveProps(){
        this.setState({redirect: false})
    }

    setValue(event){
        this.setState({searchedTerm: event.target.value});
    }

    search(e){
        if(e.key == 'Enter'){
            this.setState({redirect: true})
        }
    }

    render(){
        
        return(
            // this.state.redirect ? 
            // <Redirect to={"/search/value/" + this.state.searchedTerm}></Redirect>
            // :
            <form class={"form-inline my-2 my-lg-0 knbn-transition knbn-no-border"}>
                <input  
                class={"knbn-form-control form-control search-inpt col knbn-transition knbn-bg-transparent knbn-border" + 
                        (this.props.themeToggled ? 
                            " knbn-dark-bg-2x-active knbn-dark-color-2x knbn-dark-color-2x-active knbn-dark-border-3x" 
                            : 
                            " knbn-snow-bg-2x-active knbn-snow-color-2x knbn-snow-color-2x-active knbn-snow-border-3x")} 
                placeholder="Caută" 
                aria-label="Caută" 
                title='Caută'
                onKeyPress={this.search}
                onChange={this.setValue}
                value={this.state.searchedTerm}
                />
                {
                    <Link to={"/search/value/" + this.state.searchedTerm}>
                        <div class="btn search-btn align-self-end mr-0">
                            <img src={this.props.themeToggled ? "/images/search.svg" : "/images/bSearch.svg"} class={"d-block mx-auto"} title="Caută"/>
                        </div>
                    </Link>
                }
                
            </form>
        );
    }
}

export default connect(mapStateToProps)(SearcBar);