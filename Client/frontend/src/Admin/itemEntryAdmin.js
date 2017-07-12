import React, { Component } from 'react';
import "./itemEntryAdmin.css";
import Axios from 'axios';

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

    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })   
        console.log(e.target.value);     
    }

    formSubmit = (e) =>{
        e.preventDefault();
        Axios({
            method: "post",
            url:"",
            data:{itemName: this.state.itemName, donor: this.state.donor, category: this.state.category,
                  fairMarketValue: this.state.fairMarketValue, itemDescription: this.state.itemDescription,
                itemRestriction: this.state.itemRestriction},
                headers: {Authorization: localStorage.getItem("jw-token")}
        }).then((response) => {
            console.log(response.data);
            localStorage.setItem("jw-token", response.data.token);
        }).catch((err) =>{
            console.log("Incomplete Form", err.response.data);
        })
    }
    
    render(){
        return(
            <div className='item-entry-admin-container row'>
                <label><h2>Item Info</h2> </label>
                <div className='item-info'>
                    <form onSubmit={this.formSubmit}>
                        {/*Item Number: <input type='number' name='itemNumber' required/><br/><br/>*/}
                         <input className='form-control input-lg' type='text' name='itemName'  placeholder='Item Name' onChange={this.handleChange} required/><br/><br/>
                         <input className='form-control input-lg' type='text' name='donor' placeholder='Donor' onChange={this.handleChange}/><br/><br/>
                         <select className="form-control input-lg"> 
                            <option>Category</option>
                            <option value='travel'>Travel</option>
                            <option value='art'>Art</option>
                            <option value='wine'>Wine</option>
                            <option value='food'>Food</option>
                            <option value='toys'>Toys</option>
                        </select><br/><br/>
                        {/*<input type='number' name='marketvalue' placeholder='Market Value' required/><br/><br/>*/}
                        <div className="form-group">
                            <label className="sr-only" >Amount (in dollars)</label>
                            <div className="input-group">
                                <div className="input-group-addon">$</div>
                                    <input type="number" className="form-control" id="exampleInputAmount" placeholder="Fair Market Value" onChange={this.handleChange}/>
                                <div className="input-group-addon">.00</div>
                            </div>
                        </div>
                        <textarea className="form-control" rows='5' placeholder='Item Description' onChange={this.handleChange}></textarea><br/><br/>
                        <textarea className="form-control" rows='4' placeholder='Item Restrcition' onChange={this.handleChange}></textarea><br/><br/>
                        <input type='submit' className='btn btn-primary' value='Add' />
                    </form>
                </div>
                
            </div>
        )
    }
}

export default ItemEntryAdmin;