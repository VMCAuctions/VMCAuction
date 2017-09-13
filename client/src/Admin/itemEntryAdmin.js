import React, { Component } from 'react';
import "./itemEntryAdmin.css";
import Axios from 'axios';
import Select from './select.js'
import TestModal from "../Modal/testModal.js";

class ItemEntryAdmin extends Component{
    constructor(props){
        super(props);
        this.state = {
                itemName: '',
                donor: '',
                category: '',
                fairMarketValue: '',
                itemDescription: '',
                itemRestriction: ''
        }
    }

    //callback function for capturing user input changes
    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })  
        console.log(e.target.value);     
    }   
    
    
    addingCategory = (value) =>{
        console.log('adding category from admin item entry page')
        Axios({
            method: "post",
            url: "/categories",
            data: { category: value},
        }).then((response)=>{
            console.log(response);
        }).catch((err)=>{
            console.log(err);
        })
        
    }
    
//posting data to the database on form submission
    formSubmit = (e) =>{             
        e.preventDefault(); // prevent default form submission behaviour        
        Axios({
            method: "post",
            url:"/items",
            data:{itemName: this.state.itemName, donor: this.state.donor, category: this.state.category,
                  fairMarketValue: this.state.fairMarketValue, itemDescription: this.state.itemDescription,
                itemRestriction: this.state.itemRestriction},
                // headers: {Authorization: localStorage.getItem("jw-token")}
        }).then((response) => {
            console.log(response);
            this.setState({
                itemName: '',
                donor: '',
                category:'',
                fairMarketValue:'',
                itemDescription: '',
                 itemRestriction: ''
            })
            // localStorage.setItem("jw-token", response.data.token);
        }).catch((err) =>{
            console.log("Incomplete Form", err);
        })
    }
    
    render(){
        return(
            <div className='item-entry-admin-container row'>
                <label><h2>Item Info</h2> </label>
                <div className='item-info'>
                    <form  onSubmit={this.formSubmit}>

                         <input className='form-control input-lg' type='text' name='itemName' 
                                placeholder='Item Name' onChange={this.handleChange} value={this.state.itemName} required/><br/><br/>
                         <input className='form-control input-lg' type='text' name='donor' 
                                placeholder='Donor' onChange={this.handleChange} value={this.state.donor} required/><br/><br/>
                         
                        {/*Select component renders the dropdown for category selection*/}
                         <Select name='category' handleChange={this.handleChange}/><br/>

                        {/*TestModal component renders the popup modal for adding new category option to the dropdown*/}
                        <TestModal addingCategory={this.addingCategory}/><br/><br/>
                        
                        <div className="form-group">
                            {/*<label className="sr-only" >Amount (in dollars)</label>*/}
                            <div className="input-group">
                                <div className="input-group-addon">$</div>
                                    <input type="number" name='fairMarketValue' className="form-control" placeholder="Fair Market Value" 
                                            value={this.state.fairMarketValue} onChange={this.handleChange} required />
                                <div className="input-group-addon">.00</div>
                            </div>
                        </div> <br/>
                        <textarea name='itemDescription' className="form-control" rows='5' 
                                  placeholder='Item Description' value={this.state.itemDescription} onChange={this.handleChange} required></textarea><br/><br/>
                        <textarea name='itemRestriction' className="form-control" rows='4' 
                                  placeholder='Item Restrcition' value={this.state.itemRestriction} onChange={this.handleChange}></textarea><br/><br/>
                        <input type='submit' className='btn btn-primary' value='Add' />
                    </form>
                </div>
                
            </div>
        )
    }
}

export default ItemEntryAdmin;