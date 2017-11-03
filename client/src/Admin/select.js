import React, { Component } from 'react';
import Axios from 'axios';

class Select extends Component{
    constructor(props){
        super(props);
    }
    handleChange = (e) => {
        this.props.handleChange(e); //invoke the parent(itemEntryAdmin.js) callback for handling the changes
    }

    render(){
        //maping the array with option tags
        let dropdownOptions = this.props.selectOptions.map((itemValue,index) => {
            return <option key={index} value={itemValue.name} >{itemValue.name}</option>
        })
        return(
            <div>
                <select className='form-control' onChange={this.handleChange} name={this.props.name} >
                    {dropdownOptions}
                </select>
            </div>
        )
    }
}

export default Select;