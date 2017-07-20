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
            // localStorage.setItem("jw-token", response.data.token);
        }).catch((err) =>{
            console.log("Incomplete Form");
        })
    }
    
    render(){
        return(
            <div className='item-entry-admin-container row'>
                <label><h2>Item Info</h2> </label>
                <div className='item-info'>
                    <form  onSubmit={this.formSubmit}>
                        {/*decided to auto-generate item number on form submission*/}
                        {/*Item Number: <input type='number' name='itemNumber' required/><br/><br/>*/}                           
                         <input className='form-control input-lg' type='text' name='itemName' 
                                placeholder='Item Name' onChange={this.handleChange} value={this.state.itemName} required/><br/><br/>
                         <input className='form-control input-lg' type='text' name='donor' 
                                placeholder='Donor' onChange={this.handleChange} value={this.state.donor}/><br/><br/>
                         {/*<select name='category' value={this.state.category} onChange={this.handleChange} className="form-control input-lg" required> 
                            <option value=''>Category</option>
                            <option value='travel'>Travel</option>
                            <option value='art'>Art</option>
                            <option value='wine'>Wine</option>
                            <option value='food'>Food</option>
                            <option value='toys'>Electronics</option>
                        </select><br/>   */}
                        
                         <Select name='category' value={this.state.category} handleChange={this.handleChange}/><br/>

                            <TestModal /><br/><br/>
                        
                        <div className="form-group">
                            {/*<label className="sr-only" >Amount (in dollars)</label>*/}
                            <div className="input-group">
                                <div className="input-group-addon">$</div>
                                    <input type="number" name='fairMarketValue' className="form-control" placeholder="Fair Market Value" 
                                            value={this.state.fairMarketValue} onChange={this.handleChange} />
                                <div className="input-group-addon">.00</div>
                            </div>
                        </div> <br/>
                        <textarea name='itemDescription' className="form-control" rows='5' 
                                  placeholder='Item Description' value={this.state.itemDescription} onChange={this.handleChange}></textarea><br/><br/>
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