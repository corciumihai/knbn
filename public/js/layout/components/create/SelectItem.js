import React from 'react';
import ItemName from './ItemName';

class SelectItem extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="row mb-3">
                <div class="col-xl-12"> 
                    <div class="row">
                        <div class="selection">
                            <div class="btn-group">
                                <button type="button" class="btn btn-danger">Item</button>
                                <button type="button" class="btn btn-danger dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span class="sr-only">Toggle Dropdown</span>
                                </button>
                                <div class="dropdown-menu">
                                    <a class="dropdown-item" href="#">Task</a>
                                    <a class="dropdown-item" href="#">Ticket</a>
                                    <a class="dropdown-item" href="#">Component</a>
                                </div>
                            </div>
                        </div>

                        <ItemName/>
                    </div>
                </div>
            </div>
        );
    }
}

export default SelectItem;