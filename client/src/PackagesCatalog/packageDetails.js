import React, { Component } from 'react';
import Axios from 'axios';

class PackageDetails extends Component{
    constructor(props){
        super(props);
        this.state = {
            packageId: this.props.match.params.packageInfo,
            packageInfo: ''
        }
    }
    componentDidMount(){
        Axios.get("/packages")
        .then((result) =>{
            console.log(result);
            this.setState({
                packageInfo: result.data
            })
        }).catch((err) =>{
            console.log(err);
        })
    }
    render(){
        console.log(this.state.packageInfo[this.state.packageId]);
        let packagedata = this.state.packageInfo[this.state.packageId];
        console.log(packagedata);
        let x = [];
        for(var key in packagedata){
            console.log(key, packagedata[key]);
            x.push(packagedata[key]);
            // console.log(x[3]);
        }
        console.log(x[3]);
        return(
            <div>
                <h1> {x[3]} </h1>
                <h4>Description: {x[4]}</h4>
                <h4>Package Value: {x[5]} </h4>
                <h4>Items in package: {x[10]}</h4>
            </div>
        )
    }
}

export default PackageDetails;