import React from 'react';
import axios from 'axios';
import crypto, { timingSafeEqual } from 'crypto';
import Label from '../editor/Label';
import { TouchButtonRight } from '../editor/TouchButtonRight';
import DropdownMenu from '../menu/DropdownMenu';
import DropdownItem from '../menu/DropdownItem';
import Small from '../editor/Small';
import { connect } from 'react-redux';
import SelectionRemover from './SelectionRemover';
import RemoveItemSmall from './RemoveItemSmall';

class SelectionField extends React.Component{
    render(){
        return(
            <div class="form-group">
                <div class={"d-flex flex-row"}>  
                    <Label label={this.props.label}/>
                </div>
                <div class={"knbn-input-grp knbn-fake-input-grp input-group dropdown knbn-bg-transparent knbn-transition"  + 
                (this.props.themeToggled ? " knbn-dark-border-2x knbn-dark-onselect" : " knbn-snow-border-2x knbn-snow-onselect")}>
                {
                    <div class={"d-flex flex-row w-100"}>
                    {
                        this.state.currentItem.name != undefined && this.state.currentItem.name.length > 0 ?
                        <SelectionRemover>
                            <RemoveItemSmall remove={this.RemoveItemSmall}>{this.state.currentItem.name}</RemoveItemSmall>
                        </SelectionRemover>
                        :
                        <input type="text" class={"knbn-input form-control knbn-bg-transparent knbn-transition" + 
                        (this.props.themeToggled == true ? 
                            " knbn-dark-bg-2x knbn-dark-bg-2x-active knbn-dark-color-5x" 
                            : 
                            " knbn-snow-bg-2x knbn-snow-bg-2x-active knbn-snow-color-5x" )} id="knbnFieldLabel" aria-describedby="knbnHelp" 
                            placeholder={this.state.value == undefined || this.state.value.length == 0 ? "Introdu numele obiectului" : ""}
                            value={this.state.value}
                            onChange={this.setFieldValue}
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                        />
                    }
                        <DropdownMenu classes="w-100">
                        {
                            this.state.filteredItems == undefined || this.state.filteredItems.length == 0 ? 
                            <div class="col text-truncate">Niciun obiect găsit</div>
                            :
                            (
                                this.state.filteredItems.map(item => 
                                {
                                    return  <a href="#" key={item.id} onClick={(event)=>{event.preventDefault(); this.set(item)}}>
                                                <DropdownItem >
                                                    <div class="w-100 my-auto text-truncate d-flex flex-row">
                                                        <div class="d-flex mr-2">
                                                            <img src={this.props.imgSrc != undefined ? this.props.imgSrc : './images/comp.svg'} class="my-auto mx-auto"/>
                                                        </div>
                                                        {item.name}
                                                    </div>
                                                </DropdownItem>
                                            </a>
                                })
                            )
                        }
                        </DropdownMenu>
                    </div>
                }
                </div>
                <Small>{this.props.description}</Small>
            </div>
        );
    }

    constructor(props){
        super(props);

        this.state = {
            value: '',
            filteredItems: [],
            items: [],
            currentItem: {}, 
        }

        this.setFieldValue = this.setFieldValue.bind(this);
        this.set = this.set.bind(this);
        this.RemoveItemSmall = this.RemoveItemSmall.bind(this);
    }

    componentWillMount(){
        this.setState({
            value: (this.props.value != undefined) ? this.props.value : '', 
            currentItem: this.props.currentItem != undefined ? this.props.currentItem : {}
        });
    }

    componentWillReceiveProps(nextProps, nextState){
        this.setState({
            items: nextProps.items, 
            filteredItems: nextProps.items, 
            value: (nextProps.value != undefined) ? nextProps.value : '', 
            currentItem: nextProps.currentItem != undefined ? nextProps.currentItem : {}
        });
    }

    setFieldValue(event){this.setState({value: event.target.value, filteredItems: this.state.items.filter(item => {
        return item.name.toLowerCase().includes(event.target.value.toLowerCase());
    })});}
    
    set(item){this.props.action(item);}

    RemoveItemSmall(){
        this.set({});
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled
    }
}

export default connect(mapStateToProps)(SelectionField);