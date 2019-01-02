import React from 'react';
import { throws } from 'assert';

class EditSelection extends React.Component{
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

    filterItems(){
        this.setState({filteredItems: this.state.items.filter(item => {return item.name.toLowerCase().includes(this.state.value.toLowerCase())})})
    }

    render(){
        return(
            <div class="form-group">
                <label for="knbnFieldLabel" class="knbn-edit-field w-100">{this.props.label}</label>
                <div class="knbn-input-grp knbn-fake-input-grp input-group dropdown">
                {this.state.inEditMode == false ? 
                    <div class="knbn-fake-input form-control text-truncate">
                        {this.state.value == undefined || this.state.value.length == 0 ? 
                        <span class="knbn-label-muted">
                            {this.props.filler == undefined || this.props.filler.length == 0 ? 'No items et yet' : this.props.filler}
                        </span> : this.state.value}
                    </div> 
                    : 
                    <input type="text" class="knbn-input form-control" id="knbnFieldLabel" aria-describedby="knbnHelp" 
                    placeholder={this.state.value == undefined || this.state.value.length == 0 ? "Enter release name" : ""}
                    value={this.state.value}
                    onChange={this.setFieldValue}
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"/>
                }
                    <div class="knbn-input-grp-append input-group-append d-flex">
                        <div class="input-group-text mx-1 d-flex my-auto ">
                            {this.state.inEditMode ? 
                                <div>
                                    <img class="knbn-edit-btn mx-auto" src="./images/save.svg" onClick={this.save}></img>
                                </div>
                                :
                                <img class="knbn-edit-btn mx-auto d-none" src="./images/edit.svg" onClick={this.enterEditMode}></img>}
                        </div>
                    </div>
                    <div id="knbnDropdownMenu" class="knbn-dropdown-menu dropdown-menu w-100">
                        {
                            !this.props.filterItems == true ? 
                                this.state.items == undefined || this.state.items.length == 0 ? 
                                'No items found'
                                :
                                this.props.items.map(item => {return <a class="knbn-dropdown-item dropdown-item text-truncate" href="#" key={item.id} onClick={(event)=>{event.preventDefault(); this.setItem(item)}}>{item.name}</a>})
                            :
                                this.state.filteredItems == undefined || this.state.filteredItems.length == 0 ? 
                                <div class="col">No items found</div>
                                :
                                this.state.filteredItems.map(item => {return <a class="knbn-dropdown-item dropdown-item text-truncate" href="#" key={item.id} onClick={(event)=>{event.preventDefault(); this.setItem(item)}}>{item.name}</a>})
                        }
                    </div>
                </div>
                <small id="knbnHelp" class="knbn-edit-help form-text text-muted">{this.props.description}</small>
            </div>
        );
    }
}

export default EditSelection;