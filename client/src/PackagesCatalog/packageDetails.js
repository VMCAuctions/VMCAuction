import React, { Component } from 'react';
import Axios from 'axios';
import './packageDetails.css';
import {Link} from 'react-router-dom';

class PackageDetails extends Component{
    constructor(props){
        super(props);
        this.state = {
            packageId: this.props.match.params.packageId,
            listOfPackages: '',
            place_bid: ''
        }
    }

    componentDidMount(){
        Axios.get("/packages")
        .then((result) =>{
            this.setState({
                listOfPackages: result.data
            })
        }).catch((err) =>{
            console.log(err);
        })
    }

    placeBidSubmit = () =>{
        alert("Yay!!! You are the top bidder.");
    }

    render(){
        // trying to find the index of the (show)package from the array
        let packageIndex = '';
        for(var i=0; i < this.state.listOfPackages.length; i++){
            let eachPackage = this.state.listOfPackages[i];
            let id = eachPackage._id;
            if(id === parseInt((this.state.packageId),10)){
                packageIndex = i;
            }

        }

        //traversing the target package(which is JSON object)
        let packagedata = this.state.listOfPackages[packageIndex];
        let x = [];
        let packageName = '', packageDescription='', packageValue = '',packageItems=[], starting_bid="", bids = [], bid_increment='';

        for(var key in packagedata){
            x.push(packagedata[key]);
            // console.log(x[3]);
            if(key === "name"){
                packageName = packagedata[key];
            }else if(key === "description"){
                packageDescription = packagedata[key];
            }else if(key === 'value'){
                packageValue = packagedata[key];
                if (packageValue == 0){
                  packageValue = "Priceless"
                }
            }else if( key === '_items'){
                packageItems = packagedata[key];
                console.log(packageItems)
            }else if( key === 'amount'){
                starting_bid = packagedata[key];
            }else if( key === 'bids'){
                bids = packagedata[key];
            }else if( key === 'bid_increment'){
                bid_increment = packagedata[key];
            }
        }
        //listing the items in the package
        let itemsInPackage = packageItems.map((item, index)=>{
            return(
                <li key={index}>{item.name}</li>
            )
        })
        //current_bid
        let current_bid = starting_bid;
        if (bids.length != 0){
          current_bid = bids[bids.length - 1].bid
        }

        //Place bid

        //Discovered this is a timing issue: current bid is not defined when this "render" function takes place, so it can't look inside of it; however, the function works when you don't look inside of it, because it is null and then changes to the object on render
        this.state.place_bid = current_bid + bid_increment;


        //conditional rendering
        if(this.state.listOfPackages){
        return(
            <div className='container-fluid bidContainer'>
                <div className='row'>
                    <div className='imgNtitle  pull-left col-xs-12 col-sm-6 col-md-3'>
                        <h2 className='text-uppercase packageName'> {packageName} </h2><br/>
                        <img src='' alt={packageName} className='img-thumbnail col-xs-12'/>
                    </div>
                    <div className='bidDetails col-xs-12 col-sm-6 col-md-9'>
                        <h4>Package Value: {packageValue} </h4>
                        <h4>Starting Bid: {starting_bid}</h4>
                        <div className='bidSection'>
                            <h4>Current Bid:{}</h4>
                            <input className='bidInput' type='text' name='' value={this.state.place_bid} readOnly />
                            <input className='btn-primary' type='submit'  value='Place Bid!!' onClick={this.placeBidSubmit}/>
                            <br/>
                        </div>
                        <div className='packageDescription'>
                            <br/><h4>Description: </h4>
                            <p>{packageDescription}</p>
                            <h5>Items in package: {itemsInPackage}</h5>
                        </div>
                        <Link to='/package'><h5>Back to All Packages</h5></Link>

                    </div>
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
