import React, { Component } from 'react';
import Axios from 'axios';

class AddCategory extends Component{
    constructor(props){
        super(props);
        this.state = { newCategoryValue:''}
    }
    
    handleChange = (e) =>{
        this.setState({
            [e.target.name]: e.target.value
        })
        console.log(e.target.value)
    }

    addingCategory = () =>{
        console.log(this.state.newCategoryValue);
        // Axios.post('' , {
        //     category: this.state.newCategoryValue
        // }).then(function (response) {
        //     console.log(response);
        //     }) 
        //   .catch(function (error) {
        //     console.log(error);
        //     });
    }

    render(){
        return(
            <div>
                <input type='text' name='newCategoryValue' value={this.state.newValue} onChange={this.handleChange}/><br/><br/>
                <button onClick={this.addingCategory}>Add</button>
            </div>
        )
    }
}
    

    // addingCategory = () => {
    //     console.log(this.state.selectOptions);
    //     console.log(this.state.newCategoryValue);
    //     this.state.selectOptions.push(this.state.newCategoryValue)
    //     this.setState({
    //         selectOptions: this.state.selectOptions
    //     })
    //     console.log(this.state.selectOptions);
    // } 


export default AddCategory; 
