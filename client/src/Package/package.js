import React, { Component } from 'react';
import Axios from 'axios';
import './package.css';
import DisplayItems from './itemsListDisplay.js';
import Select from '../Admin/select.js';
import TestModal from "../Modal/testModal.js";

class Package extends Component{
    constructor(props){
        super(props);
        this.state = {
            packageName: '',
            packageDescription: '',
            category:'',
            openingBid: '',
            increments:'',
            selectedItems: [],
            totalItems: 0,
            totalValue: 0
        }
    }

    //Input fields event handler
    onPackageChange = (e) => {
        this.setState({
        [e.target.name] : e.target.value
        })
        // console.log(e.target.value);
    }

    //Package form submit callback
    onPackageFormSubmit = (e) => {
        e.preventDefault();
        console.log(this.state)
        Axios({
            method: 'post',
            url:'/packages',
            data:{packageName: this.state.packageName, packageDescription: this.state.packageDescription,
                  category: this.state.category, openingBid: this.state.openingBid, increments: this.state.increments,
                selectedItems:this.state.selectedItems  }
        }).then((response) =>{
            console.log(response)
        }).catch((err)=>{
            console.log("Incomplete form submission" + err)
        })
    }

    capturingGroupedItems = (arr, value) =>{
        console.log(arr,value);
        this.setState({
            selectedItems: arr,
            totalItems: this.state.selectedItems.length,
            totalValue:  this.state.totalValue + value
        })        
    }

    render(){
        let items = this.state.selectedItems.map((item) =>{
            return <li>{item}</li>
        })

        return(
            <div id='package-container'>
                <form className='form-inline' onSubmit={this.onPackageFormSubmit}>
                    <div className='package-info form-group'>
                        <h3>Package Info</h3>
                        <input type='text' name='packageName' className='form-control' value={this.state.packageName} onChange={this.onPackageChange} placeholder='Package Name' required/><br/><br/>
                        <textarea name='packageDescription' className='form-control' value={this.state.packageDescription} rows='5' value={this.state.packageDescription} onChange={this.onPackageChange} placeholder='Package Description'></textarea><br/><br/>
                        
                        <Select name='category' value={this.state.category} handleChange={this.onPackageChange}/><br/>
                        <TestModal /><br/><br/>

                        <input type='number' name='openingBid' className='form-control' value={this.state.openingBid} onChange={this.onPackageChange} placeholder='Opening Bid' required/><br/><br/>
                        <input type='number' name='increments' className='form-control' value={this.state.increments} step='5' onChange={this.onPackageChange} placeholder='Increments' required/><br/><br/>
                        <input className="form-control"  value={this.state.totalValue} placeholder="Total Market value" readonly /><br/><br/>
                        <input className="form-control" value={this.state.totalItems} placeholder="Total Items" readonly /><br/><br/>
                        <input type='submit' value='Add New Package'className='btn btn-primary form-control'/>
                    </div>
                    <div className="form-group groupingItems">
                        <div className='item-select form'>
                            <h3>Grouping items</h3>
                            <div className='.table-responsive'>
                                <table className='table'>
                                    <DisplayItems capturingGroupedItems={this.capturingGroupedItems}/>
                                </table>
                            </div>                    
                        </div>                                  
                        <div className="form displaySelectedItems">
                            <h3>This package has {this.state.selectedItems.length} items</h3>
                            {items}
                        </div>
                   </div>
               </form>
            </div>
        )
    }
}

export default Package;