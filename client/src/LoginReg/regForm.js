import React from 'react';
import './register.css';
import Axios from 'axios';
import {Route, Link} from 'react-router-dom';
import LoginForm from './loginForm.js';


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
            userName:'',
            password:'',
            cnfmPassword:''
        };
    }
    handleClick = (e) => {

    }
    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
        console.log(e.target.value);
    }
    formSubmit = (e) =>{
        e.preventDefault(); // prevent default form submission behaviour
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
                  userName: this.state.userName,
                  password: this.state.password,
                  confmPassowrd:this.state.cnfmPassword
                   },

        }).then((response) => {
            console.log(response);
            this.setState({
                    firstName:'',
                    lastName:'',
                    streetAddress:'',
                    city:'',
                    states:'',
                    zip:'',
                    phoneNumber:'',
                    email:'',
                    userName:'',
                    password:'',
                    cnfmPassword:''
        })


        }).catch((err) =>{
            console.log(err);
        })
    }

    render(){
        return(
            <div>
                <h1> Register</h1>
                <form onSubmit={this.formSubmit} >
                    <br></br>
                    <input type='text' id='firstName' className='inputField' name='firstName' placeholder='First Name' onChange={this.handleChange} value={this.state.firstName} required/>
                    <br></br>
                    <input type='text' id='lastName' className='inputField' name='lastName' placeholder='Last Name'onChange={this.handleChange} value={this.state.lastName} required/>
                    <br></br>
                    <input type='text' id='streetAddress' className='inputField' name='streetAddress' placeholder='Street Address' onChange={this.handleChange} value={this.state.streetAddress} required/>
                    <br></br>
                    <input type='text' id='city' className='inputField' name='city' placeholder='City' onChange={this.handleChange} value={this.state.city} required/>
                    <br></br>
                    <input type='text' id='states' className='inputField' name='states' placeholder='State' onChange={this.handleChange} value={this.state.states} required/>
                    <br></br>
                    <input type='text' id='zip' className='inputField' name='zip' placeholder='Zip Code' onChange={this.handleChange} value={this.state.zip} required/>
                    <br></br>
                    <input type='text' id='phoneNumber' className='inputField' name='phoneNumber'placeholder='Phone Number'onChange={this.handleChange} value={this.state.phoneNumber} />
                    <br></br>
                    <input type='text' id='email' className='inputField' name='email' placeholder='Email Address'onChange={this.handleChange} value={this.state.email} required/>
                    <br></br>
                    <input type='text' id='userName' className='inputField' name='userName' placeholder='User Name' onChange={this.handleChange} value={this.state.userName} required/>
                    <br></br>
                    <input type='password' id='password' className='inputField' name='password' placeholder='Password'onChange={this.handleChange} value={this.state.password} required/>
                    <br></br>
                    <input type='password' id='cnfmPassword' className='inputField' name='cnfmPassword' placeholder='Confirm Password'onChange={this.handleChange} value={this.state.cnfmPassword} required/>
                    <br></br>
                    <input type='submit' id='submit' value='Submit' className='btn btn-primary form-control' />
                    <p>Already registered? Go to Login! </p>


                </form>
                    <p><Link to='/'>Login</Link></p>

            </div>
        )
    }

}

export default RegForm;
