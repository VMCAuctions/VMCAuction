import React, { Component } from 'react';
import "./catalog.css";
import Axios from 'axios';
import {Link} from 'react-router-dom';

class Catalog extends Component{
    constructor(props){
        super(props);
        this.state = {
            listOfItems: [],
            admin: Boolean,
            title: "Catalog"
        }
    }

    componentDidMount(){
        Axios.get("/api/items")
        .then((result) =>{
            this.setState({
                listOfItems: result.data.listOfItems,
                admin: result.data.admin
            })
        }).catch((err) =>{
            console.log(err);
        })
    }

// editItem = (e) =>{
//     //Write logic for editing an item
//     alert("Are you sure you want to edit an item.")
//     Axios.get("/api/items/"+ e.target.id)
//     .then((result) =>{
//             console.log("result", result.data);
//             // console.log("Was able to remove a item from the list", result)
//         }).catch((err) =>{
//             console.log("there was an error making it to the server..")
//         })
// }

    deleteItem = (e) => {
        this.state.listOfItems.splice(e.target.value, 1)
        this.setState({listOfItems:this.state.listOfItems})
        Axios({
            method: "post",
            url: "/api/remove_item",
            data: { item_id: e.target.id}
        }).then((result) =>{
            console.log("Was able to remove a item from the list", result)
        }).catch((err) =>{
            console.log("there was an error making it to the server..")
        })
    }

    render(){
        let action_button_header = "";
        let itemsList = this.state.listOfItems.map((item,index) =>{
            let action_button ;
            // only shoing a delete button if they have admin access
            //only deleting items that are not packaged
            if(this.state.admin === true){
                action_button = <td>In Package</td>
                action_button_header = <th>Actions</th>
                if(item.packaged === false){
                    action_button = <td><button ><Link to={`/item/edit/${item._id}`}>Edit</Link></button>
                                        <button onClick={this.deleteItem} id={item._id} value={index}>Delete</button></td>
                    action_button_header = <th>Actions</th>
                }
            }
            if (item.value === 0){
              item.value = "Priceless"
            }

            return(
                <tr key={index}>
                    {action_button}
                    <td>{item._id}</td>
                    <td>{item.name}</td>
                    <td>{item._package}</td>
                    <td>{item._category}</td>
                    <td>{item.value}</td>
                    <td>{item.description}</td>
                    <td>{item.donor}</td>
                    <td>{item.restrictions}</td>
                </tr>
            )
        })
        return(
<div className="container"><div className="row">
            <h1 className="h1">{this.state.title}</h1>
            <div className='table-responsive table-container'>
                <table className='table table-striped table-bordered'>
                    <thead>
                        <tr>
                            {action_button_header}
                            <th>Item Number</th>
                            <th>Item Name</th>
                            <th>Package</th>
                            <th>Category</th>
                            <th>Fair Market Value</th>
                            <th>Item Description</th>
                            <th>Donor</th>
                            <th>Item Restriction</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemsList}
                    </tbody>
                </table>
            </div>
</div></div>
        )
    }
}

export default Catalog;
