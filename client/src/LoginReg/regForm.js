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
            address:'',
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
                  address:this.state.address,
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
                    address:'',
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
                    <input type='text' id='firstName' name='firstName' placeholder='First Name' onChange={this.handleChange} value={this.state.firstName} required/>
                    <br></br>
                    <input type='text' id='lastName' name='lastName' placeholder='Last Name'onChange={this.handleChange} value={this.state.lastName} required/>
                    <br></br>
                    <textarea name='address' id='address' placeholder='Address'onChange={this.handleChange} value={this.state.address}  />
                    <br></br>
                    <input type='text' id='phoneNumber' name='phoneNumber'placeholder='Phone Number'onChange={this.handleChange} value={this.state.phoneNumber} />
                    <br></br>
                    <input type='text' id='email' name='email' placeholder='Email ID'onChange={this.handleChange} value={this.state.email} required/>
                    <br></br>
                    <input type='text' id='userName' name='userName' placeholder='User Name' onChange={this.handleChange} value={this.state.userName} required/>
                    <br></br>
                    <input type='password' id='password' name='password' placeholder='Password'onChange={this.handleChange} value={this.state.password} required/>
                    <br></br>
                    <input type='password' id='cnfmPassword' name='cnfmPassword' placeholder='Confirm Password'onChange={this.handleChange} value={this.state.cnfmPassword} required/>
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