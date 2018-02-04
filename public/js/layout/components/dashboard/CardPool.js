import React from 'react';
import ReactDom from 'react-dom';
import Section from './Section.js';
import Column from './Column';
import Card from  './Card';
import CardList from './CardList';

const axios = require('axios');

class CardPool extends React.Component{
    constructor(props){
        super(props);
    }

    render(){

        return(
            <div class="row">
                <Section name="Construction of Component 1 with a huge ass name that wont really fit in the section">
                    <Column columnName="BACKLOG">
                        <CardList id="card-list-1" laneId="backlog"/>
                    </Column>
                    <Column columnName="IN PROGRESS">
                        <CardList id="card-list-2" laneId="progress"/>
                    </Column>
                    <Column columnName="DOING">
                        <CardList id="card-list-3" laneId="doing"/>
                    </Column>
                    <Column columnName="DONE">
                        <CardList id="card-list-4" laneId="done"/>
                    </Column>
                </Section>
            </div>
        );
    }
}

export default CardPool;