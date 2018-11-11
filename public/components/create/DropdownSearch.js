import React from 'react';
import Caret from './Caret';

class DropdownSearch extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            list: [],
            searched: undefined,
            toggle: false,
        }

        this.search = this.search.bind(this);
        this.click = this.click.bind(this);
        this.toggle = this.toggle.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
    }

    toggle(){
        this.setState({toggle: !this.state.toggle});
    }

    click(item, event){
        event.preventDefault();
        this.props.onClick(item);
    }

    search(event){
        let value = event.target.value;
        this.setState({searched: value});
    }

    clearSearch(){
        this.setState({searched: ''});
    }

    render(){
        let list = [];
        if(this.state.searched != undefined && this.state.searched.length > 0){
            list = this.props.list.filter(item => item.value.toLowerCase().includes(this.state.searched.toLowerCase()));
        }
        else{
            list = this.props.list;
        }
        return(
            <div class="btn-group w-100" onClick={this.props.fetch != undefined ? this.props.fetch : null}>
                <div type="button" class="btn dropdown-toggle w-100 pl-3 pr-3" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={this.getUsers}>
                    <div class="row">
                        <div class="col text-truncate dropdown-text">
                        {this.props.item.img == undefined || this.props.item.img.length == 0 ? null : <img src={'./images/' + this.props.item.img}/>}
                        {
                            this.props.item.value != undefined && this.props.item.value.length > 0 ?  this.props.item.value :
                            this.props.placeholder != undefined && this.props.placeholder.length > 0 ? this.props.placeholder : "Default" 
                        }
                        </div>
                        <Caret/>
                    </div>
                </div>
                <div class="dropdown-menu w-100">
                    <div class="pl-3 pr-3"><input type="text" class="search form-control mb-1" onChange={this.search} onBlur={this.clearSearch}
                        value={this.state.searched!= undefined && this.state.searched.length > 0 ? this.state.searched : ''} placeholder="Type to search"/></div>
                    <div class="users">
                    {   
                        this.props.loading ? <div class="loading"><span>Loading...</span></div> : 
                        list.length > 0 ? 
                            list.map(item => {
                                let boundClick = this.click.bind(this, item);
                                return <a key={item.key} class="dropdown-item px-3 d-flex" href="#" onClick={boundClick}>
                                    {item.img == undefined || item.img.length == 0 ? null : <img src={"./images/" + item.img} />}{item.value}</a>
                            }) 
                    : 
                        <div class="no-match col">No items matching this criteria</div>
                    }
                    </div>
                </div>
            </div>
        );
    }
}

export default DropdownSearch;