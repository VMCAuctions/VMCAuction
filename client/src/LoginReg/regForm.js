import React from 'react';
import './register.css';
import Axios from 'axios';
import {Link} from 'react-router-dom';


class RegForm extends React.Component{
    constructor (props){
        super(props);
        this.state={
            firstName:'',
            lastName:'',
            streetAddress:'',
            city:'',
            states:'',
            zip:'',
            phoneNumber:'',
            email:'',
            creditCard:'',
            userName:'',
            password:'',
            cnfmPassword:''
        };
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
        console.log(e.target.value);
    }
    formSubmit = (e) =>{
        e.preventDefault(); // prevent default form submission behaviour

        //Sree, please add prompt asking for user to insert matching passwords if the below condition is met

        if (this.state.password != this.state.cnfmPassword) {
          alert("Passwords do not match. Please try again.")

          return;
        }

        Axios({
            method: "post",
            url: "/users",
            data: {
                  firstName: this.state.firstName,
                  lastName:this.state.lastName,
                  streetAddress:this.state.streetAddress,
                  city:this.state.city,
                  states:this.state.states,
                  zip:this.state.zip,
                  phoneNumber:this.state.phoneNumber,
                  email:this.state.email,
                  creditCard:this.state.creditCard,
                  userName: this.state.userName,
                  password: this.state.password,
                   },

        }).then((response) => {
            console.log(response);
            if(response.data.validated) {
              this.setState({
                      firstName:'',
                      lastName:'',
                      streetAddress:'',
                      city:'',
                      states:'',
                      zip:'',
                      phoneNumber:'',
                      email:'',
                      creditCard:'',
                      userName:'',
                      password:'',
                      cnfmPassword:''
              })

              window.location.href ="/package"

            };
            alert(response.data.message);


        }).catch((err) =>{
            console.log(err);
        })
    }

    render(){
        return(
            <div className='container row'>
                <label><h2> Register</h2></label>
                <div className='registration-form'>
                <form onSubmit={this.formSubmit} >

          
                    <div className="form-group row">
                      <label for="firstName" className="col-sm-2 col-form-label">First Name</label>
                      <div className="col-sm-10">
                        <input type='text' id='firstName' className='form-control' name='firstName' 
                        placeholder='First Name' onChange={this.handleChange} value={this.state.firstName} required/>
                      </div>
                    </div>          
                    
                    <div className="form-group row">
                      <label for="lastName" className="col-sm-2 col-form-label">Last Name</label>
                      <div className="col-sm-10">
                        <input type='text' id='lastName' className='form-control' name='lastName' 
                        placeholder='Last Name' onChange={this.handleChange} value={this.state.lastName} required/>
                      </div>
                    </div>                            
                    
                    <div className="form-group row">
                            <label for="streetAddress" className="col-sm-2 col-form-label">Street Address</label>
                            <div className="col-sm-10">
                              <input type='text' id='streetAddress' className='form-control' name='streetAddress' 
                              placeholder='Street Address' onChange={this.handleChange} value={this.state.streetAddress} required/>
                            </div>
                    </div>     
                    
                    <div className="form-group row">
                            <label for="city" className="col-sm-2 col-form-label">City</label>
                            <div className="col-sm-10">
                              <input type='text' id='city' className='form-control' name='city' 
                              placeholder='City' onChange={this.handleChange} value={this.state.city} required/>
                            </div>
                    </div>    
                    
                    <div className="form-group row">
                            <label for="states" className="col-sm-2 col-form-label">State</label>
                            <div className="col-sm-10">
                              <input type='text' id='states' className='form-control' name='states' 
                              placeholder='State' onChange={this.handleChange} value={this.state.states} required/>
                            </div>
                    </div>
                   
                    <div className="form-group row">
                      <label for="zip" className="col-sm-2 col-form-label">Zip Code</label>
                      <div className="col-sm-10">
                        <input type='text' id='zip' className='form-control' name='zip' 
                        placeholder='Zip Code' onChange={this.handleChange} value={this.state.zip} required/>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label for="phoneNumber" className="col-sm-2 col-form-label">Phone Number</label>
                      <div className="col-sm-10">
                        <input type='text' id='phoneNumber' className='form-control' name='phoneNumber'
                        placeholder='Phone Number' onChange={this.handleChange} value={this.state.phoneNumber} />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label for="email" className="col-sm-2 col-form-label">Email Address</label>
                      <div className="col-sm-10">
                        <input type='text' id='email' className='form-control' name='email' 
                        placeholder='Email Address' onChange={this.handleChange} value={this.state.email} required/>
                      </div>
                    </div>
                    <div className='form-group row">
                      <label for="credCard" className="col-sm-2 col-form-label">Credit Card</label>
                      <div className="col-sm-10"?
                      <input type='text' id='creditCard' className='form-control name='creditCard' placeholder='Credit Card' onChange={this.handleChange} value={this.state.creditCard} required/>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label for="userName" className="col-sm-2 col-form-label">User Name</label>
                      <div className="col-sm-10">
                        <input type='text' id='userName' className='form-control' name='userName' 
                        placeholder='User Name' onChange={this.handleChange} value={this.state.userName} required/>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label for="password" className="col-sm-2 col-form-label">Password</label>
                      <div className="col-sm-10">
                        <input type='password' id='password' className='form-control' name='password' 
                        placeholder='Password' onChange={this.handleChange} value={this.state.password} required/>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label for="cnfmPassword" className="col-sm-2 col-form-label">Confirm Password</label>
                      <div className="col-sm-10">
                        <input type='password' id='cnfmPassword' className='form-control' name='cnfmPassword' 
                        placeholder='Confirm Password' onChange={this.handleChange} value={this.state.cnfmPassword} required/>
                      </div>
                    </div>
                    <div className="form-group row">
                     <input type='submit' id='submit' value='Submit' className='btn btn-primary ' />
                    </div>


                    <p>Already registered? Go to Login! </p>


                    </form>
                       <p><Link to='/'>Login</Link></p>
                </div>
            </div>
        )
    }

}

export default RegForm;
