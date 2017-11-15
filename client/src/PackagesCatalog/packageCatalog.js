import React, { Component } from 'react';
import Axios from 'axios';
import './packageCatalog.css';
import SearchBar from './searchBar.js';
import {Link} from 'react-router-dom';

class PackageCatalog extends Component{
    constructor(props){
        super(props);
        this.state = {
            listOfPackages: [],
            selectValue: '',
            categories: [],
            listOfItems: [],
            allPackages: [],
            admin: Boolean,
        }
    }

     componentDidMount(){
         //when the component loads set the value initially to all categories
        this.setState({selectValue:"All Categories"})
         //loading all the packages
        Axios.get("/packages")
        .then((result) =>{
            //adding to the categories drop down menu, not including duplicates//
            let categories_list = [];
            result.data.map((categories) =>{
                if(categories_list.includes(categories._category) === false){
                    categories_list.push(categories._category);
                } })
            //sorting the packages by highest bid..
            result.data.sort(function(a,b){return b._bids[b._bids.length - 1] - a._bids[a._bids.length - 1]})
            //setting the state of the categories and the list of packages
            this.setState({   listOfPackages: result.data,
                              categories: categories_list,
                              allPackages: result.data   })

        }).catch((err) =>{
            console.log(err);
        })

        //loading all the items to search.
        Axios.get("/items")
        .then((result) =>{
            this.setState({ listOfItems: result.data })
        }).catch((err) =>{
            console.log(err);
        })

        //loading user information:        //if the user's name is administrator then they have admin access
        Axios.get("/which_user_is_logged_in")
        .then((result) =>{
            this.setState({ admin: result.data.admin })
        })
        .catch((err) =>{
            console.log(err);
        })
    }

    //when the option is changed it will update the packages on display
    handleChange = (e) =>{
        this.setState({selectValue:e.target.value});
        e.preventDefault();
        if(e.target.value === "All Categories"){
            this.setState({ listOfPackages: this.state.allPackages })
        }else{
            Axios({
                method: "post",
                url: "/get_selected_packages",
                data: { category: e.target.value}
            }).then((result) =>{
                //sorting the packages according to the highest bid
                result.data.sort(function(a,b){return b._bids[b._bids.length - 1] - a._bids[a._bids.length - 1]})
                this.setState({ listOfPackages: result.data })
            }).catch((err) =>{
                console.log("there was an error making it to the server..")
            })
        }
    }

    //this function deals with the user locating packages, this function is run after every new letter
    handleNewLetter = (e) => {
        //the letter they typed in, if there is a match with the item name add it to this array
        let selected_items = [];
        //converted all the input letter to lower case
        let input_letters = e.target.value.toLowerCase();
        //when the user deletes everything in the input it will display all packages again
        if(e.target.value === "" && this.state.selectValue === "All Categories"){
            this.setState({ listOfPackages: this.state.allPackages   })

        }else{
            //first checking if there are items at all
            if(this.state.listOfItems.length !== 0){
                //iterating through the list of items pulled from the DB
                for(var i = 0; i < this.state.listOfItems.length; i++){
                    //converting each string to lowercase to match the input //we have to check the items name, description, and donor name
                    let name = this.state.listOfItems[i].name.toLowerCase()
                    let donor = this.state.listOfItems[i].donor.toLowerCase();
                    let description = this.state.listOfItems[i].description.toLowerCase();
                    //checking if the input matches any of the words in the item name //if there is a match add it to the array of selected items
                    if(name.indexOf(input_letters) >= 0 || donor.indexOf(input_letters) >= 0 || description.indexOf(input_letters) >= 0){
                        selected_items.push(this.state.listOfItems[i])
                    }
                }
            }
            //now that these selected items are the ones the user is looking for //the packages must be found that coresponds to them
            let selected_packages = [];
            //the user may also be searching for the package name so we have to add the selected package titles too
            // searching the packages in the DB if they match the key words too.
            for(var j = 0; j < this.state.allPackages.length; j++){

                let name = this.state.allPackages[j].name.toLowerCase();
                let description = this.state.allPackages[j].description.toLowerCase();
                let category = this.state.allPackages[j]._category

                if(name.indexOf(input_letters) >= 0 || description.indexOf(input_letters) >= 0){
                    if(category === this.state.selectValue || this.state.selectValue === "All Categories"){
                        selected_packages.push(this.state.allPackages[j])
                    }
                }
            }
            //iterate through each item and check it to all the packages one at a time
            for(var m = 0; m < selected_items.length; m++){
                for(var n = 0; n < this.state.allPackages.length; n++){

                    //if the selected item's package matches one of the package id's
                    //AND if it has not already been added to the array, push it to the selected packages array
                    if(selected_items[m]._package === this.state.allPackages[n]._id ){
                        if(selected_packages.includes(this.state.allPackages[n]) === false){
                            if(this.state.allPackages[n]._category === this.state.selectValue || this.state.selectValue === "All Categories"){
                                selected_packages.push(this.state.allPackages[n]);
                            }
                        }
                    }
                }
            }

            //repopulate the list of packages that will be rendered to the screen //sort the packages according to highest bid
            selected_packages.sort(function(a,b){return b._bids[b._bids.length - 1] - a._bids[a._bids.length - 1]})
            this.setState({ listOfPackages: selected_packages })

        }
    }

    editPackage =(e) =>{
        //write code for editing the package
        alert("Do you want to edit");
    }

    deletePackage = (e) => {
        e.persist();
        this.setState({ listOfPackages: this.state.listOfPackages })

        Axios({
            method: "post",
            url: "/remove_package",
            data: { package_id: e.target.id}
        }).then((result) =>{
            Axios.get('/packages')
            .then((result=>{    this.setState({  listOfPackages: result.data}) } ))
            .catch((err)=>{ console.log(err); })
        }).catch((err) =>{
            console.log(err);
        })
    }

    render(){
        let action_button_header = "";
        let packageList = this.state.listOfPackages.map((packages,index) =>{
            let action_button = "";
            if(this.state.admin === true){
                action_button = <td><button onClick={this.editPackage} id={packages._id} value={index}>Edit</button>
                                    <button onClick={this.deletePackage} id={packages._id} value={index}>Delete</button> </td>
                action_button_header = <th>Actions</th>
            }
            return(

                    <div className="card package_card w-75">
                        <img className="card-img-top card_img" src="" alt={`${packages.name} Image`}/>
                        <div className="card-block">
                        <h4 className="card-title text-uppercase">{packages.name}</h4>
                        <p class="card-text">Category: {packages._category}</p>
                        <p class="card-text">STARTING BID: {packages.amount}</p>
                        <p class="card-text">Current Bid: Placholder for conditional logic involving bid being empty</p>
                        <p className="card-text"><Link to={`/packageDetails/${packages._id}`}>Show</Link></p>
                        {action_button}
                        </div>
                    </div>
            )
            /*return(
                <tr key={index}>
                    {action_button}
                    <td>{packages._id}</td>
                    <td>{packages.name}</td>
                    <td>{packages._category}</td>
                    <td>{packages.value}</td>
                    <td>{packages.description}</td>
                    <td>{packages.bid_increment}</td>
                    <td>{packages._bids[0].amount}</td>
                    <td>{packages._items.map((item,index)=>{ return <li key={index} >{item}</li>}) } </td>
                    <td><Link to={`/packageDetails/${packages._id}`}>Show</Link></td>
                </tr>
            )*/
        })
        let categories = this.state.categories.map((category,index) =>{
            return( <option key={index} value={category}>{category}</option> )
        })

        return(
            <div>
                  <SearchBar handleChange={this.handleChange} handleNewLetter={this.handleNewLetter}
                            categories={categories} selectValue={this.state.selectValue}/>

                <div className='table-responsive table-container'>
                    <div className="search-block">
                        <h3>Key Word Search</h3>
                        <input type='text'  onChange={this.handleNewLetter} ref="search_bar"/>
                    </div>
                </div> {/* end of search-bar */}
                <br/>
                {/*<div className='table-responsive table-container'>
>>>>>>> package-cards
                    <table className='table table-striped table-bordered'>
                        <thead>
                            <tr>
                                {action_button_header}
                                <th>Package Number</th>
                                <th>Package Name</th>
                                <th>Category </th>
                                <th>Package Value</th>
                                <th>Item Description</th>
                                <th>Increments</th>
                                <th>Starting Bid</th>
                                <th>Items in Package</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {packageList}
                        </tbody>
                    </table>
                </div>*/}

                <div className='card-deck'>
                    {packageList}
                </div>

            </div>
        )
    }
}
export default PackageCatalog;
