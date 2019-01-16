import React from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
import ViewComponent from './ViewComponent';

class ViewProject extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            components: [],
            tickets: [],
            showComp: false,
            showTickets: false
        }

        this.fetchComponents = this.fetchComponents.bind(this);
        this.fetchTickets = this.fetchTickets.bind(this);
        this.showTickets = this.showTickets.bind(this);
        this.showComponents = this.showComponents.bind(this);
    }

    fetchComponents(){
        Axios.get('/get-components/' + this.props.data.id)
        .then(response => {
            this.setState({components: response.data})
        })
    }

    fetchTickets(){
        Axios.get('/get-tickets/' + this.props.data.id)
        .then(response => {
            this.setState({tickets: response.data})
        })
    }

    componentWillMount(){
        this.fetchComponents();
        this.fetchTickets();
    }

    showComponents(){
        this.setState({showComp: !this.state.showComp})
    }

    showTickets(){
        this.setState({showTickets: !this.state.showTickets})
    }

    render(){
        return(
            <div class={"knbn-view-project col-xl-12 py-2 mb-2 d-flex flex-column" + (this.props.themeToggled ? " knbn-dark-bg-2x" : " knbn-snow-bg-2x")}>

                <div class="d-flex flex-row w-100 py-2">

                    <div class="col-xl-2 d-flex flex-row">
                        <div class="h-100 d-flex mr-1"><img src="./images/project.svg" class="mx-auto my-auto"/></div>
                        <div class="mr-2">Nume</div>
                        <div class={"knbn-font-medium text-truncate" + (this.props.themeToggled ? " knbn-dark-color-5x" : " knbn-snow-color-5x")} title={this.props.data != undefined ? this.props.data.name : 'Fără nume'}>
                            {this.props.data.name}
                        </div>
                    </div>

                    <div class="col-xl-1 px-0 d-flex flex-row mr-3">
                        <div class="h-100 d-flex knbn-collapse mr-1" title="Arată obiectele curente" onClick={this.showComponents}>
                            <img src="./images/play.svg" class={"mx-auto my-auto" + (this.state.showComp ? " knbn-flip-90-deg" : "")}/>
                        </div>
                        <div class="mr-2">Componente #</div>
                        <div class={"knbn-font-medium text-truncate" + (this.props.themeToggled ? " knbn-dark-color-5x" : " knbn-snow-color-5x")}>
                            {this.state.components.length}
                        </div>
                    </div>

                    <div class="col-xl-1 px-0 d-flex flex-row mr-3">
                        <div class="h-100 d-flex knbn-collapse mr-1" title="Arată obiectele" onClick={this.showTickets}>
                            <img src="./images/play.svg" class={"mx-auto my-auto" + (this.state.showTickets ? " knbn-flip-90-deg" : "")}/>
                        </div>
                        <div class="mr-2">Tichete #</div>
                        <div class={"knbn-font-medium text-truncate" + (this.props.themeToggled ? " knbn-dark-color-5x" : " knbn-snow-color-5x")}>
                            {this.state.tickets.length}
                        </div>
                    </div>

                </div>

                <div class={"col-xl-12 knbn-border-top" + (this.state.showComp ? "" : " hide") + (this.props.themeToggled ? " knbn-dark-border-2x" : " knbn-snow-border-2x")}>
                    <div class={"col-xl-12 mt-2"}>
                    {
                        this.state.components.map(item => {
                            return <ViewComponent key={item.id} data={item} />
                        })
                    }
                    </div>
                </div>

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(ViewProject);