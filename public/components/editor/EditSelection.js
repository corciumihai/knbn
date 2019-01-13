import React from 'react';
import Label from './Label';
import EditButton from './EditButton';
import DropdownMenu from '../menu/DropdownMenu';
import DropdownItem from '../menu/DropdownItem';
import Small from './Small';
import { connect } from 'react-redux';
import SaveButton from './SaveButton';
import RemoveItem from '../create/RemoveItem';

class EditSelection extends React.Component{
    
    constructor(props){
        super(props);

        this.state = {
            value: 'asdad',
            inEditMode: false,
            items: [],
            filteredItems: [],
            tempItem: {}
        }

        this.setFieldValue = this.setFieldValue.bind(this);
        this.save = this.save.bind(this);
        this.filterItems = this.filterItems.bind(this);
        this.setEditMode = this.setEditMode.bind(this);
        this.saveTemporary = this.saveTemporary.bind(this);
    }

    componentWillMount(){
        this.setState({items: this.props.items, filteredItems: this.props.items, inEditMode: false, tempItem: this.props.item, value: this.props.item.name});
    }

    componentWillReceiveProps(nextProps, nextState){
        this.setState({items: nextProps.items, filteredItems: nextProps.items, inEditMode: false}, () => {
            if(nextProps.item != this.state.tempItem){
                this.setState({tempItem: this.props.item})
            }
        });
    }

    setFieldValue(event){
        this.setState({value: event.target.value}, this.filterItems);
    }

    save(){
        this.setState({inEditMode: false});
        (this.props.save != null || this.props.save != undefined) ? this.props.save(this.state.tempItem) : {}
    }

    filterItems(){this.setState({filteredItems: this.state.items.filter(item => {return item.name.toLowerCase().includes(this.state.value.toLowerCase())})})}

    setEditMode(){
        this.setState({inEditMode: !this.state.inEditMode, value: ''});
    }

    saveTemporary(item){
        this.setState({tempItem: item, value: item.name})
    }

    render(){
        return(
            <div class="form-group knbn-bg-transparent">
                <Label label={this.props.label}/>
                {
                    this.state.inEditMode == false ? 
            
                        (this.state.tempItem == undefined || this.state.tempItem.name == undefined || this.state.tempItem.name.length == 0) ? 
                        <RemoveItem remove={this.setEditMode}>Nicio valoare</RemoveItem>
                        :
                        <RemoveItem remove={this.setEditMode}>{this.state.tempItem.name}</RemoveItem>

                    :

                    <div class={"knbn-input-grp knbn-fake-input-grp input-group dropdown knbn-bg-transparent knbn-transition" + (this.props.themeToggled ? " knbn-dark-border-2x knbn-dark-onselect" : " knbn-snow-border-2x knbn-snow-onselect")}>

                        <input type="text" class={"knbn-input form-control knbn-bg-transparent" + 
                            (this.props.themeToggled == true ? 
                                " knbn-dark-bg-2x knbn-dark-bg-2x-active knbn-dark-color-4x" 
                                : 
                                " knbn-snow-bg-2x knbn-snow-bg-2x-active knbn-snow-color-4x")} 
                        id="knbnFieldLabel" 
                        aria-describedby="knbnHelp" 
                        placeholder={this.state.value == undefined || this.state.value.length == 0 ? "Introdu nume versiune" : ""}
                        value={this.state.value}
                        onChange={this.setFieldValue}
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"/>

                        <SaveButton edit={this.state.inEditMode} save={this.save} enableEditMode={this.enterEditMode}/>

                        <DropdownMenu >
                        {
                            this.state.filteredItems == undefined || this.state.filteredItems.length == 0 ? 
                            <div class="col knbn-snow-color-1x">
                                <div class="col-xl-12">Niciun obiect găsit</div>
                            </div>
                            :
                            this.state.filteredItems.map(item => {
                                return   <a href="#" key={item.id} onClick={(event)=>{event.preventDefault(); this.saveTemporary(item)}}>
                                            <DropdownItem >{item.name}</DropdownItem>
                                        </a>})
                        }
                        </DropdownMenu>
                    </div>
                }

                    <Small>{this.props.description}</Small>
                </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
    }
}

export default connect(mapStateToProps)(EditSelection);