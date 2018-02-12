import React from 'react';
import {DropTarget} from 'react-dnd';
import {ItemTypes} from './Constants';
import Card from './Card';
var update = require('react-addons-update');
const axios = require('axios');

const target = {
    drop(props, monitor, component){
        //get card data
        let card = monitor.getItem();
        
        if(card.laneID != props.lane){
            card.laneID = props.lane;
            
            axios.post('/cards/modify', {
                lane: card.laneID,
                id: card.id
            }).then((response) => {
                console.log(response);
            })

            console.log(card);
            component.pushCard(card);
            component.sortCards();
        }

        return {lane: props.lane};
    },

    canDrop(props, monitor, component){
        return true; // still testing styling when only an element is being dragged on the page
    }

};

@DropTarget(ItemTypes.CARD, target, (connect, monitor) => ({connectDropTarget: connect.dropTarget(), isOver: monitor.isOver({shallow: true}), canDrop: monitor.canDrop(), }))
class CardList extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            cardList: [],
        }

        this.addClass = this.addClass.bind(this);
        this.removeCard = this.removeCard.bind(this);
        this.pushCard = this.pushCard.bind(this);
        this.sortCards = this.sortCards.bind(this);
    }

    // sorting function of cards
    sortCards(){
        this.setState(
            update(this.state, {
                cardList: {$set: this.state.cardList.sort(function(a, b){ // should sort by date
                    if(a.id < b.id)
                        return -1;
                    if(a.id > b.id)
                        return 1;
                    return 0;
                })}
            })
        )    
    }

    removeCard(cardId){
        //if a card from this lane is removed, remove it from the state list
        this.state.cardList.forEach(element => {
            if(element.id === cardId){
                var index = this.state.cardList.indexOf(element);
                this.setState(update(this.state, {
                    cardList: { $splice: [[index, 1]]}
                }));
            }
        });
    }

    pushCard(card){
        // if a card is pushed in this lane, add it to the state list
        this.setState(update(this.state, { 
            cardList: {$push:[card]}
        }));
    }

    addClass(){
        const {isOver, canDrop} = this.props;
        if(isOver && canDrop){
            return "willDrop"; // green background for .card-list
        }
        if(isOver && !canDrop){
            return "noDrop"; // red background for .card-list
        }
        if(!isOver && !canDrop){
            return ""; // will style all the backgrounds in a color, but not when dragging
        }

    }   

    componentWillMount(){
        axios.get('/cards/' + this.props.lane).then((response) => {
            this.setState({cardList: response.data});
        });
    }

    render(){
        const {connectDropTarget} = this.props;
        return connectDropTarget(
            <div class={"card-list " + this.addClass()} id={this.props.id}>
                {   
                    this.state.cardList.length ?
                        this.state.cardList.map((card) => {
                            return <Card key={card.id} state={card} removeCard={this.removeCard} laneID={this.props.lane}/>
                        })
                    : null
                }
            </div>
        );
    }
}

export default CardList;