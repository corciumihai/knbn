import React from 'react';
import ReactDom from 'react-dom';
// import CreationModal from './CreationModal';

class Menu extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            showModal: false,
        }

        this.toggleModal = this.toggleModal.bind(this);
    }

    toggleModal(){
        this.setState({showModal: !this.state.showModal});
    }

    render(){
        return(
            <nav class="navbar navbar-expand-lg navbar-light mb-2">
                <a class="navbar-brand" href="/dashboard">KNBN</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item active">
                            <a class="nav-link" href='/create-project'>Setup new project <span class="sr-only">(current)</span></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href='/create-project'>Boards <span class="sr-only">(current)</span></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Create</a>
                        </li>
                    </ul>
                </div>
            </nav>


            // <div class="menu col mb-2">
            //     <button class="btn btn-primary" id="create" onClick={this.toggleModal}>Create</button>
            //     <button class="btn m"><a href='/create-project'>Setup new project</a></button>
            //     {/* <CreationModal show={this.state.showModal} toggle={this.toggleModal} /> */}
            // </div>
        );
    }
}

ReactDom.render(<Menu/>, document.getElementById('menu'));

export default Menu;



