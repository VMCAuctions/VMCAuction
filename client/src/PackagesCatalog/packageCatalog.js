import React, { Component } from 'react';
import Axios from 'axios';
import './packageCatalog.css';
import {Link} from 'react-router-dom';
import ReactDOM from 'react-dom'

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

        this.handleChange = this.handleChange.bind(this);
        this.handleNewLetter = this.handleNewLetter.bind(this);
        this.deletePackage = this.deletePackage.bind(this);
    }
     componentDidMount(){
         //when the component loads set the value initially to all categories
        this.setState({selectValue:"All Categories"})

         //loading all the packages
        Axios.get("/packages")
        .then((result) =>{
            console.log("this is the result", result);

            //adding to the categories drop down menu, not including duplicates//
            let categories_list = [];
            result.data.map((categories) =>{
                if(categories_list.includes(categories._category) === false){
                    categories_list.push(categories._category);
                }
            })
            //sorting the packages by highest bid..
            result.data.sort(function(a,b){return b._bids[b._bids.length - 1] - a._bids[a._bids.length - 1]})
            //setting the state of the categories and the list of packages 
            this.setState({
                listOfPackages: result.data,
                categories: categories_list,
                allPackages: result.data
            })
            
        }).catch((err) =>{
            console.log(err);
        })

        //loading all the items to search.
        Axios.get("/items")
        .then((result) =>{
            // console.log(result);
            this.setState({
                listOfItems: result.data
            })
            console.log(this.state.listOfItems)
        }).catch((err) =>{
            console.log(err);
        })

        //loading user information:
        //if the user's name is administrator then they have admin access
        Axios.get("/which_user_is_logged_in")
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

    //when the option is changed it will update the packages on display
    handleChange(e){
        this.setState({selectValue:e.target.value});
        e.preventDefault();

        if(e.target.value === "All Categories"){
            console.log("loading all categories")
            this.setState({
                listOfPackages: this.state.allPackages
            })
        }else{
            Axios({
                method: "post",
                url: "/get_selected_packages",
                data: { category: e.target.value}
            }).then((result) =>{
                console.log("filtered these pacakges through the database", result)
                //sorting the packages accoring to the highest bid
                result.data.sort(function(a,b){return b._bids[b._bids.length - 1] - a._bids[a._bids.length - 1]})
                this.setState({
                    listOfPackages: result.data
                })
            }).catch((err) =>{
                console.log("there was an error making it to the server..")
            })
        }

        //reset the tyed search bar to an empty string when the category option is clicked
        ReactDOM.findDOMNode(this.refs.search_bar).value = "";
        
    }

    //this function deals with the user locating packages, this function is run after every new letter
    handleNewLetter(e){
        //the letter they typed in//
        console.log(e.target.value);

        //if there is a match with the item name add it to this array
        let selected_items = [];
        //converted all the input letter to lower case
        let input_letters = e.target.value.toLowerCase();

        //when the user deletes everything in the input it will display all packages again
        if(e.target.value === "" && this.state.selectValue === "All Categories"){
            this.setState({listOfPackages: this.state.allPackages})
            
        }else{

            //first checking if there are items at all
            if(this.state.listOfItems.length !== 0){

                //iterating through the list of items pulled from the DB
                for(var i = 0; i < this.state.listOfItems.length; i++){
                    //converting each string to lowercase to match the input
                    //we have to check the items name, description, and donor name
                    let name = this.state.listOfItems[i].name.toLowerCase()
                    let donor = this.state.listOfItems[i].donor.toLowerCase();
                    let description = this.state.listOfItems[i].description.toLowerCase();

                    //checking if the input matches any of the words in the item name
                    //if there is a match add it to the array of selected items
                    if(name.indexOf(input_letters) >= 0 || donor.indexOf(input_letters) >= 0 || description.indexOf(input_letters) >= 0){
                        selected_items.push(this.state.listOfItems[i])
                    }
                }
            }
            console.log("the selected items are: ", selected_items)

            //now that these selected items are the ones the user is looking for
            //the packages must be found that coresponds to them
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
            for(var i = 0; i < selected_items.length; i++){
                for(var j = 0; j < this.state.allPackages.length; j++){
                    
                    //if the selected item's package matches one of the package id's
                    //AND if it has not already been added to the array, push it to the selected packages array

                    if(selected_items[i]._package == this.state.allPackages[j]._id ){
                        if(selected_packages.includes(this.state.allPackages[j]) === false){
                            if(this.state.allPackages[j]._category == this.state.selectValue || this.state.selectValue == "All Categories"){
                                selected_packages.push(this.state.allPackages[j]);
                            }
                        }
                    }
                }
            }

            console.log("the selected packages based on the drop down restrictions: ",selected_packages);

            //repopulate the list of packages that will be rendered to the screen
            //sort the packages according to highest bid
            selected_packages.sort(function(a,b){return b._bids[b._bids.length - 1] - a._bids[a._bids.length - 1]})
            
            this.setState({listOfPackages: selected_packages})
        }

    }


    deletePackage(e){
        e.persist();
        console.log("you clicked the button and this is the ID", e.target.id);
        console.log(e.target.value)
        let deleted_package = this.state.listOfPackages.splice(e.target.value, 1)
        this.setState({listOfPackages:this.state.listOfPackages})
        
        Axios({
            method: "post",
            url: "/remove_package",
            data: { package_id: e.target.id}
        }).then((result) =>{
            console.log("Was able to remove a package from the list", result)
            
        }).catch((err) =>{
            console.log("there was an error making it to the server..")
        })
    }

    render(){
        let del_button_header = "";

        let packageList = this.state.listOfPackages.map((packages,index) =>{
            let del_button = "";
            if(this.state.admin === true){
                del_button = <td><button onClick={this.deletePackage} id={packages._id} value={index}>Delete</button></td>
                del_button_header = <th></th>
            }
                // console.log(packages._bids);
            return(
                <tr key={index}>
                    {del_button}
                    <td>{packages._id}</td>
                    <td>{packages.name}</td>
                    <td>{packages._category}</td>
                    <td>{packages.value}</td>
                    <td>{packages.description}</td>
                    <td>{packages.bid_increment}</td>
                    <td>{packages._bids[0]}</td>
                    <td>{packages._items.map((item,index)=>{
                        return <li key={index} >{item}</li>})}</td>
                    <td><Link to={`/packageDetails/${packages._id}`}>Show</Link></td>
                </tr>
            )
        })
        let categories = this.state.categories.map((category,index) =>{
            return(
                <option key={index} value={category}>{category}</option>
            )
        })

        return(
            <div>
                
                <div className="seach-bar">
                    <div className="form-block">
                        <form>
                            <h3>Search By Category</h3>
                            <select onChange={this.handleChange} value={this.state.selectValue} >
                            <option value="All Categories">All Categories</option>
                                {categories}  
                            </select>
                        </form>
                    </div>

                    <div className="search-block">
                        <h3>Key Word Search</h3>
                        <input type='text'  onChange={this.handleNewLetter} ref="search_bar"/>
                    </div>
                </div> {/* end of search-bar */}
                <br/>

                <div className='table-responsive table-container'>
                    <table className='table table-striped table-bordered'>
                        <thead>
                            <tr>
                                {del_button_header}
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
                </div>
            </div>
        )
    }
}

export default PackageCatalog;