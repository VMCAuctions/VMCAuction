import React, {Component} from 'react';
import './login.css';
import Axios from 'axios';
import {Route, Link} from 'react-router-dom';
import RegForm from "./regForm.js";
class LoginForm extends React.Component{


    constructor(props){
        super(props)
        this.state = {
            userName:'',
            password:''
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
        Axios({
            method: "post",
            url:"/users/:id/login",
            data:{userName: this.state.userName,
                  password: this.state.password     },
                // headers: {Authorization: localStorage.getItem("jw-token")}
        }).then((response) => {
            console.log("Login promise invoked!")
            if(response.data.search){
                window.location.href ="/package"
            }
            this.setState({
                userName:'',
                password:''
            })
            alert(response.data.message)
        }).catch((err) =>{
            console.log(err);
        })
    }
    
    render(){
         return(
             <div>
                <h1>Login </h1>
                <form onSubmit={this.formSubmit} >
                    <br></br>
                    <input type='text' id='userName' name='userName' placeholder='User Name' onChange={this.handleChange} value={this.state.userName} required  />
                    <br></br>
                    <input type='password' id='password' name='password' placeholder='Password'onChange={this.handleChange} value={this.state.password} required />
                    <br></br>
                    <input type='submit' id='submit' value='Submit' className='btn btn-primary form-control' />
                    <p>Not registered yet? Register now!</p>

                </form>
                    <p><Link to='/register'>Register</Link></p>

                </div>


         )


    }

}
export default LoginForm;
