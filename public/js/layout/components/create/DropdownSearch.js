import React from 'react';
import Caret from './Caret';

class DropdownSearch extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            list: [],
            searched: '',
            toggle: false,
        }

        this.search = this.search.bind(this);
        this.change = this.change.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    toggle(){
        this.setState({toggle: !this.state.toggle});
    }

    change(user){
        this.props.change(user);
    }

    search(event){
        let value = event.target.value;
        this.setState({
            searched: value
        });
    }

    render(){
        let list = [];
        if(this.state.searched.length == 0){
            list = this.props.list;
        }
        else{
            list = this.props.list.filter(item => item.value.toLowerCase().includes(this.state.searched.toLowerCase()));
        }
        return(
            <div class="btn-group w-100" onClick={this.toggle} onBlur={this.toggle}>
                <button type="button" class="btn dropdown-toggle w-100" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={this.getUsers}>
                    <span class="float-left">{this.props.item.value.length == 0 ? this.props.placeholder : this.props.item.value}</span>
                    <Caret toggle={this.state.toggle}/>
                </button>
                <div class="dropdown-menu w-100">
                    <div class="pl-3 pr-3"><input type="text" class="search form-control" onChange={this.search} value={this.state.searched}/></div>
                    <div class="users">
                    {
                    list.length > 0 ? 
                        list.map(item => {
                            let boundClick = this.change.bind(this, item);
                            return <a key={item.key} class="dropdown-item" href="#" onClick={boundClick}>{item.value}</a>
                        }) 
                    : 
                        <div class="col">No items matching this criteria</div>
                    }
                    </div>
                </div>
            </div>
        );
    }
}

export default DropdownSearch;