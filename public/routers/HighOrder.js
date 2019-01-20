import {Redirect} from 'react-router-dom';
import React from 'react';

export default function withAuth(ComponentToProtect){
    return class extends React.Component{
        constructor(){
            super();
            this.state = {
                loading: true,
                redirect: false
            }
        }

        componentDidMount(){
            fetch('/checktoken')
            .then(response => {
                if(response.status === 200){
                    this.setState({loading: false});
                }
                else{
                    this.setState({loading: false, redirect: true})
                }
            })
        }

        render(){
            const{loading, redirect} = this.state;
            if(loading){
                return null;
            }

            if(redirect){
                return <Redirect to="/login"/>
            }

            return (
                <React.Fragment>
                    <ComponentToProtect {...this.props}/>
                </React.Fragment>
            )
        }
    }
}