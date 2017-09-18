import React, { Component } from 'react';
import Axios from 'axios';
import './packageDetails.css';

class PackageDetails extends Component{
    constructor(props){
        super(props);
        this.state = {
            packageId: this.props.match.params.packageId,
            listOfPackages: ''
        }
    }

    componentDidMount(){
        Axios.get("/packages")
        .then((result) =>{
            console.log(result);
            this.setState({
                listOfPackages: result.data
            })
        }).catch((err) =>{
            console.log(err);
        })
    }

    render(){
        // trying to find the index of the (show)package from the array 
        let packageIndex = '';
        for(var i=0; i < this.state.listOfPackages.length; i++){
            let eachPackage = this.state.listOfPackages[i];
            let id = eachPackage._id;
            // console.log("eachPackage--",id,this.state.packageId);
            if(id === parseInt((this.state.packageId),10)){
                packageIndex = i;
            }
            // console.log("packageIndex--", packageIndex);            
        }
        
        //traversing the target package(which is JSON object)
        let packagedata = this.state.listOfPackages[packageIndex];
        console.log(packagedata);
        let x = [];
        let packageName = '', packageDescription='', packageValue = '',packageItems=[], starting_bid='', bid_increment='';
        
        for(var key in packagedata){
            console.log(key, packagedata[key]);
            x.push(packagedata[key]);
            // console.log(x[3]);
            if(key === "name"){
                packageName = packagedata[key];
                console.log(packageName);
            }else if(key === "description"){
                packageDescription = packagedata[key];
                console.log(packageDescription);
            }else if(key === 'value'){
                packageValue = packagedata[key];
                console.log("packageValue--", packageValue);
            }else if( key === '_items'){
                packageItems = packagedata[key];
                console.log("packageItems--", packageItems);
            }else if( key === '_bids'){
                starting_bid = packagedata[key];
                console.log("starting_bid--",starting_bid);
            }else if( key === 'bid_increment'){
                bid_increment = packagedata[key];
                console.log("bid_increment--", bid_increment);
            }
        }
        //listing the items in the package
        let itemsInPackage = packageItems.map((item, index)=>{
            return(
                <li key={index}>{item}</li>
            )
        })
        //current_bid
        let current_bid = starting_bid[starting_bid.length-1];

        //Place bid
        let place_bid = current_bid + bid_increment;


        //conditional rendering
        if(this.state.listOfPackages){
        return(
            <div className='container-fluid'>
                <div className='row'>
                    <div className='imgNtitle  pull-left col-xs-12 col-sm-6 col-md-3'>
                        <h2 className='text-uppercase packageName'> {packageName} </h2><br/>
                        <img src='' alt={packageName} className='img-thumbnail col-xs-12'/>
                    </div>
                    <div className='bidDetails col-xs-12 col-sm-6 col-md-9'>
                        <h4>Package Value: {packageValue} </h4>
                        <h4>Starting Bid: {starting_bid[0]}</h4>
                        <h4>Current Bid:{current_bid}</h4>
                        <input type='text' name='' value={place_bid} readOnly />
                        <input className='btn-primary' type='submit'  value='Place Bid!!'/>
                        {/*<h4>Place Bid: {place_bid}</h4>
                        <button>Place Bid</button>*/}
                    </div>
                </div>
                <div className='packageDescription'>
                        <br/><h4>Description: {packageDescription}</h4>
                        <h4>Items in package: {itemsInPackage}</h4>
                        {/*<div className=''>
                        </div>*/}
                </div>                
            </div>
        )}
        else{
            return(
                <h3>Loading....</h3>
            )
        }
    }
}

export default PackageDetails;