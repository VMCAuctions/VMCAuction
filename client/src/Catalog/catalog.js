import React, { Component } from 'react';
import "./catalog.css";
import Axios from 'axios';

class Catalog extends Component{
    constructor(props){
        super(props);
        this.state = {
            listOfItems: [],
            admin: Boolean
        }
    }

    componentDidMount(){
        Axios.get("/api/items")
        .then((result) =>{
            this.setState({
                listOfItems: result.data
            })
        }).catch((err) =>{
            console.log(err);
        })

        //loading user information:
        //if the user's name is administrator then they have admin access
        Axios.get("/api/which_user_is_logged_in")
        .then((result) =>{
            console.log("if true they are admin, if false they are not: ", result.data.admin);
            this.setState({
                admin: result.data.admin
            })
        })
        .catch((err) =>{
            console.log(err);
        })
    }

editItem = (e) =>{
    //Write logic for editing an item
    alert("Are you sure you want to edit an item.")
}

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
                    action_button = <td><button onClick={this.editItem} id={item._id} value={index}>Edit</button>
                                        <button onClick={this.deleteItem} id={item._id} value={index}>Delete</button></td>
                    action_button_header = <th>Actions</th>
                }
            }
            if (item.value == 0){
              item.value = "Priceless"
            } 
            
          
          

            return(
                <tr key={index}>
                    {action_button}
                    <td>{item._id}</td>
                    <td>{item.name}</td>
                    <td>{item._package}</td>
                    <td>{item.value}</td>
                    <td>{item.description}</td>
                    <td>{item.donor}</td>
                    <td>{item.restrictions}</td>
                </tr>
            )
        })
        return(
            <div className='table-responsive table-container'>
                <table className='table table-striped table-bordered'>
                    <thead>
                        <tr>
                            {action_button_header}
                            <th>Item Number</th>
                            <th>Item Name</th>
                            <th>Package</th>
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
        )
    }
}

export default Catalog;
