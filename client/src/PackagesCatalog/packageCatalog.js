import React, { Component } from 'react';
import Axios from 'axios';

class PackageCatalog extends Component{
    constructor(props){
        super(props);
        this.state = {listOfPackages: []}
    }
     componentDidMount(){
        Axios.get("/packages")
        .then((result) =>{
            console.log(result);
            this.setState({
                listOfPackages: result.data
            })
            console.log(this.state.listOfPackages)
        }).catch((err) =>{
            console.log(err);
        })
    }
    render(){
        let packageList = this.state.listOfPackages.map((packages,index) =>{
            return(
                <tr key={index}>
                    <td>{packages.itemId}</td>
                    <td>{packages.name}</td>
                    <td>{packages._category}</td>
                    <td>{packages.value}</td>
                    <td>{packages.description}</td>
                    <td>{packages.bid_increment}</td>
                    <td>{packages._bids[0]}</td>
                    <td>{packages._items}</td>
                </tr>
            )
        })
        return(
            <div className='table-responsive table-container'>
                <table className='table table-striped table-bordered'>
                    <thead>
                        <tr>
                            <th>Package Number</th>
                            <th>Package Name</th>
                            <th>Category </th>
                            <th>Package Value</th>
                            <th>Item Description</th>
                            <th>Increments</th> 
                            <th>Starting Bid</th>   
                            <th>Items in Package</th>                        
                        </tr>
                    </thead>
                    <tbody>
                        {packageList}                        
                    </tbody>
                </table>
            </div>
        )
    }
}

export default PackageCatalog;