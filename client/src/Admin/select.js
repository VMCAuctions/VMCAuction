import React, { Component } from 'react';
import Axios from 'axios';

class Select extends Component{
    constructor(props){
        super(props);
        this.state = { 
            selectoptions: []
        }
    }

    componentDidMount(){
        //Get request for category dropdown list
        // console.log("Select.js componentDidMount")
        Axios.get("/categories")
        .then((response)=>{
            // console.log(response.data);
            this.setState({
                selectoptions: response.data
            })
        }).catch((err)=>{
            console.log("categoryList failed", err)
        })
    } 

    componentDidUpdate(){
        Axios.get("/categories")
        .then((response)=>{
            // console.log(response.data);
            this.setState({
                selectoptions: response.data
            })
        }).catch((err)=>{
            console.log("categoryList failed", err)
        })
    }

    handleChange = (e) => {
        this.props.handleChange(e); //invoke the parent(itemEntryAdmin.js) callback for handling the changes
    }

    render(){
        //maping the array with option tags
        let dropdownOptions = this.state.selectoptions.map((itemValue,index) => {
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