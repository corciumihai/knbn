import React from 'react';

class ItemName extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="col">
                <div class="item-name">
                    <div class="form-group">
                        <input type="email" class="form-control" placeholder="Item name"/>
                    </div>
                </div>
            </div>
        );
    }
}

export default ItemName;