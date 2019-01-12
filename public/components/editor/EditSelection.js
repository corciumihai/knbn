import React from 'react';
import Label from './Label';
import EditButton from './EditButton';
import DropdownMenu from '../menu/DropdownMenu';
import DropdownItem from '../menu/DropdownItem';
import Small from './Small';
import { connect } from 'react-redux';

class EditSelection extends React.Component{
    render(){
        return(
            <div class="form-group knbn-bg-transparent">
                <Label label={this.props.label}/>
                <div class={"knbn-input-grp knbn-fake-input-grp input-group dropdown knbn-bg-transparent knbn-transition" + 
                (this.props.themeToggled ? " knbn-dark-border-2x knbn-dark-onselect" : " knbn-snow-border-2x knbn-snow-onselect")}>
                {this.state.inEditMode == false ? 
                    <div class={"knbn-fake-input form-control text-truncate knbn-bg-transparent" + (this.props.themeToggled == true ? " knbn-dark-color-5x" : " knbn-snow-color-5x")}>
                        {this.state.value == undefined || this.state.value.length == 0 ? 
                        <span class={"knbn-label-muted knbn-bg-transparent" + this.props.themeToggled ? " knbn-dark-color-5x" : " knbn-snow-color-5x"}>
                            {this.props.filler == undefined || this.props.filler.length == 0 ? 'No items set yet' : this.props.filler}
                        </span> : this.state.value}
                    </div> 
                    : 
                    <input type="text" class={"knbn-input form-control knbn-bg-transparent" + 
                        (this.props.themeToggled == true ? 
                            " knbn-dark-bg-2x knbn-dark-bg-2x-active knbn-dark-color-4x" 
                            : 
                            " knbn-snow-bg-2x knbn-snow-bg-2x-active knbn-snow-color-4x")} 
                    id="knbnFieldLabel" 
                    aria-describedby="knbnHelp" 
                    placeholder={this.state.value == undefined || this.state.value.length == 0 ? "Enter release name" : ""}
                    value={this.state.value}
                    onChange={this.setFieldValue}
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"/>
                }
                    <EditButton edit={this.state.inEditMode} save={this.save} enableEditMode={this.enterEditMode}/>
                    <DropdownMenu >
                        {
                            !this.props.filterItems == true ? 
                                this.state.items == undefined || this.state.items.length == 0 ? 
                                'No items found'
                                :
                                this.props.items.map(item => {
                                    return  <a href="#" key={item.id} onClick={(event)=>{event.preventDefault(); this.setItem(item)}}>
                                                <DropdownItem >{item.name}</DropdownItem>
                                            </a>})
                            :
                                this.state.filteredItems == undefined || this.state.filteredItems.length == 0 ? 
                                <div class="col knbn-snow-color-1x">No items found</div>
                                :
                                this.state.filteredItems.map(item => {
                                    return   <a href="#" key={item.id} onClick={(event)=>{event.preventDefault(); this.setItem(item)}}>
                                                <DropdownItem >{item.name}</DropdownItem>
                                            </a>})
                        }
                    </DropdownMenu>
                </div>
                <Small>{this.props.description}</Small>
            </div>
        );
    }

    constructor(props){
        super(props);

        this.state = {
            value: '',
            inEditMode: false,
            items: [],
            selectedItem: {},
            filteredItems: [],
        }

        this.setFieldValue = this.setFieldValue.bind(this);
        this.enterEditMode = this.enterEditMode.bind(this);
        this.save = this.save.bind(this);
        this.setItem = this.setItem.bind(this);
        this.filterItems = this.filterItems.bind(this);
    }

    componentDidMount(){
        this.setState({items: this.props.items, value: this.props.value});
        if(this.props.filterItems == true) this.setState({filteredItems: this.props.items});
    }

    componentWillReceiveProps(nextProps, nextState){
        if(nextProps.items != this.state.items){
            this.setState({items: nextProps.items});
            if(this.props.filterItems == true) {this.setState({filteredItems: nextProps.items})}
        }
        nextProps.value != this.state.value ? this.setState({value: nextProps.value}) : {}
    }

    enterEditMode(){this.setState({inEditMode: true})}

    setFieldValue(event){
        this.setState({value: event.target.value}, () => {
            if(this.props.filterItems == true) this.filterItems();
        });
    }

    save(){
        this.setState({inEditMode: false});
        this.props.save != null || this.props.save != undefined ? this.props.save(this.state.selectedItem) : {}
    }

    setItem(item){
        this.setState({selectedItem: item, value: item.name});
    }

    filterItems(){this.setState({filteredItems: this.state.items.filter(item => {return item.name.toLowerCase().includes(this.state.value.toLowerCase())})})}
}

const mapStateToProps = (state) => {
    return {
        themeToggled: state.themeToggled,
    }
}

export default connect(mapStateToProps)(EditSelection);