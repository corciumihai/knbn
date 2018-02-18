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
            <div class="row">
                <button class="btn btn-primary" id="create" onClick={this.toggleModal}>Create</button>
                <a href='/create-project'>Setup new project</a>
                {/* <CreationModal show={this.state.showModal} toggle={this.toggleModal} /> */}
            </div>
        );
    }
}

ReactDom.render(<Menu/>, document.getElementById('menu'));

export default Menu;



