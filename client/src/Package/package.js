import React, { Component } from 'react';
import Axios from 'axios';
import './package.css';
import Catalog from './Catalog/catalog.js';

class Package extends Component{
    constructor(props){
        super(props);
        this.state = {
            packageName: '',
            packageDescription: '',
            openingBid: '',
            increments:'',
        }
    }
    onPackageChange = (e) => {
        this.setState({
        [e.target.name] : e.target.value
        })
        console.log(e.target.value);
    }

    render(){
        return(
            <div id='package-container'>
                <form className='form-inline'>
                    <div className='package-info form-group'>
                        <h3>Package Info</h3>
                        <input type='text' name='packageName' className='form-control' value={this.state.packageName} onChange={this.onPackageChange} placeholder='Package Name' required/><br/><br/>
                        <textarea name='packageDescription' className='form-control' value={this.state.packageDescription} rows='5' value={this.state.packageDescription} onChange={this.onPackageChange} placeholder='Package Description'></textarea><br/><br/>
                        <input type='number' name='openingBid' className='form-control' value={this.state.openingBid} onChange={this.onPackageChange} placeholder='Opening Bid' required/><br/><br/>
                        <input type='number' name='increments' className='form-control' value={this.state.increments} step='5' onChange={this.onPackageChange} placeholder='Increments' required/><br/><br/>
                        <input className="form-control"  placeholder="Total Market value" readonly /><br/><br/>
                        <input className="form-control"  placeholder="Total Items" readonly /><br/><br/>
                        <input type='submit' value='Add New Package'className='btn btn-primary form-control'/>
                    </div>
                    <div className='item-select form-group'>
                        <h3>Grouping items</h3>
                        <Catalog />
                    </div>
                </form>
            </div>
        )
    }
}

export default Package;