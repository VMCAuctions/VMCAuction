import React, { Component } from 'react';
import Axios from 'axios';
import './packageDetails.css';
import {Link} from 'react-router-dom';

  // socket import
  import openSocket from 'socket.io-client';

  if (process.env.NODE_ENV === "production") {
    // for DEPLOYMENT;
    var host = "http://" + window.location.hostname;
  } else {
    // for LOCAL;
    var host = "http://localhost:8000";
  }
  const socket = openSocket(host);

  // subscribe to bids from server
  function subscribeToBids(cb, packId ) {
    var uniqChatUpdateId = 'update_chat' + packId;
    // receiving data from server on "update Chat"
    socket.on(uniqChatUpdateId, (bidsUpdate) => cb(null, bidsUpdate));
    // sending event to refresh bids
    socket.emit('page_refresh', {pId: packId });
  }

  // make a bid
  function makeABid(cb, objectWithdata) {
    // sending event to refresh bids
    socket.emit('msg_sent', objectWithdata);
  }

  var socket_updated = false;


class PackageDetails extends Component{
    constructor(props){
        super(props);
        this.state = {
            packageId: this.props.match.params.packageId,
            listOfPackages: '',
            place_bid: '',
            // our sockets default value
            bidsUpdate: {
              lastBid:"...",
              userBidLast: "..",
              socket_current_bid: false
            }
        }

        // function to update sockets
        subscribeToBids((err, bidsUpdate) => this.setState({
          bidsUpdate
        }), this.state.packageId ); // {this.state.bidsUpdate}
    }

    componentDidMount(){
        var packIdId = this.props.match.params.packageId;
        Axios.get("/api/packages/" + packIdId)
        .then((result) =>{
            console.log(result)
          this.setState({
                listOfPackages: result.data

            })
        }).catch((err) =>{
            console.log(err);
        })


        // We are always listening to dedicated for this package channel for
        // emitted by server messegase with te same uniq name
        // step 1: generating uniq channel name
        //var packIdId = this.props.match.params.packageId;
        var packIdchannel = 'update_chat' + packIdId;
        var self = this;
        socket_updated = false;
        // step 2: making sockets to listening to this channel
        socket.on(packIdchannel,function(data){
          self.updateStateAfterBidding();
        })


    }

    updateStateAfterBidding = () =>{
      socket_updated = true;
    }


    placeBidSubmit = () =>{

        Axios({
          method: "get",
          url: "/api/users/loggedin",
          data: {}
      }).then((response) => {
          console.log(response.data)
          if (!response.data.login_check){
            alert("Please login to Bid");
            window.location.href ="/login" ;
          }else{
              var pack_id = this.state.packageId;
              var bid = this.state.place_bid;
              makeABid((err, bidsUpdate) => this.setState({
          bidsUpdate
        }),{
          bid: this.state.place_bid,
          packId: this.state.packageId,
          userName: localStorage.user
        });
          }
      }).catch((err) =>{
          console.log(err);
      })
    }

    render(){

        console.log(this.state.listOfPackages)
        // trying to find the index of the (show)package from the array
        //traversing the target package(which is JSON object)
        let packagedata = this.state.listOfPackages;
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
                if (packageValue === 0){
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
                <div key={index}>
                    <li>{item.name} - {item.description} - by <span className='donor-info'>{ item.donor}</span></li>
                    <p>Item Restriction - {item.restriction}</p>
                </div>
            )
        })
        //current_bid
        let current_bid = starting_bid;
        if (bids.length !== 0){
          current_bid = bids[bids.length - 1].bidAmount
        }
        //Place bid

        //Discovered this is a timing issue: current bid is not defined when this "render" function takes place, so it can't look inside of it; however, the function works when you don't look inside of it, because it is null and then changes to the object on render
        if(socket_updated && typeof this.state.bidsUpdate.lastBid == 'number'){
          this.state.place_bid = parseInt((this.state.bidsUpdate.lastBid),10) + bid_increment;

        } else {
          this.state.place_bid = current_bid + bid_increment;
        }

        //conditional rendering
        if(this.state.listOfPackages){
        return(
<div className="container"><div className="row">
            <div className='container-fluid bidContainer'>
            <div className='bids'>
            </div>
                <div className='row'>
                    <div className='imgNtitle  pull-left col-xs-12 col-sm-6 col-md-3'>
                        <h2 className='text-uppercase packageName'> {packageName} </h2><br/>
                        <img src='/no-image.png' alt={packageName} className='img-thumbnail col-xs-12'/>
                    </div>
                    <div className='bidDetails col-xs-12 col-sm-6 col-md-9'>
                        <h4>Package Value: {packageValue} </h4>

                        <h4>Starting Bid: {starting_bid}</h4>

                        <div className='bidSection'>
                            <div>
                                <h5>Current Bid: <b>{this.state.bidsUpdate.lastBid}</b> Made by- <b>{this.state.bidsUpdate.userBidLast}</b></h5>

                            </div>
                            <h4>Place Next Bid</h4>
                            <input className='bidInput' type='text' name='' value={this.state.place_bid} readOnly />
                            <input className='placeBid btn-primary' type='submit'  value='Place Bid!!' onClick={this.placeBidSubmit}/>
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
</div></div>
        )}
        else{
            return(
                <h3>Loading....</h3>
            )
        }

    }
}

export default PackageDetails;
