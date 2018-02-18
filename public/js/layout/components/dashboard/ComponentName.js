import React from 'react';
import axios from 'axios';

class ComponentName extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            loading: true,
            components: {},
        }
    }
    
    componentDidMount(){
        axios.get('/components').then((response) => {
            this.setState({
                loading: false,
                components: response.data,
            });
        });
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.project.id){
            axios.post('/components', nextProps.project).then((response) => {
                this.setState({
                    loading: false,
                    components: response.data,
                });
            });
        }
    }

    onChange(element){
        this.props.onChange(element);
    }

    render(){
        return(
            <div class="row">
                <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 modal-label">
                    <span class="align-middle">Component name</span>
                </div>
                
                <div class="col">
                    <div class="container">
                        {!this.state.loading ? 
                        <div class="row">
                            <div class="col-xl-8 project-selection offset-xl-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <div class="container">
                                    <div class="row">
                                        <div class="col project-name">
                                            {
                                                this.props.component.name ? this.props.component.name : "Select component"
                                            }
                                        </div>
                                        <div class="d-flex project-small-button">
                                            <img src="/images/small-arrow-down.svg" class="mx-auto d-block align-self-center"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="dropdown-menu">
                                {   this.state.components.length ?
                                    this.state.components.map((component) => {
                                        let boundClick = this.onChange.bind(this, component);
                                        return <a class="dropdown-item" key={component.id} href="#" onClick={ boundClick } >{component.name}</a>
                                    })
                                    :
                                    "No components configured"
                                }
                            </div>
                        </div>
                        :
                        <div class="row">
                            <div class="col project-name">Loading components...</div>
                        </div> 
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default ComponentName;