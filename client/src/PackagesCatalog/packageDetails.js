import React, { Component } from 'react';
import Axios from 'axios';

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
        console.log(this.state.packageId);
        let packageIndex = '';
        for(var i=0; i < this.state.listOfPackages.length; i++){
            let eachPackage = this.state.listOfPackages[i];
            let id = eachPackage._id;
            console.log("eachPackage--",id,this.state.packageId);
            if(id === parseInt((this.state.packageId),10)){
                packageIndex = i;
            }
            console.log("packageIndex--", packageIndex);            
        }
        
        let packagedata = this.state.listOfPackages[packageIndex];
        console.log(packagedata);
        let x = [];
        let packageName = '', packageDescription='', packageValue = '';
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
            }
        }

        if(this.state.listOfPackages){
        return(
            <div>
                <h1> {packageName} </h1>
                <h4>Description: {packageDescription}</h4>
                <h4>Package Value: {packageValue} </h4>
                <h4>Items in package: {x[10]}</h4>
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