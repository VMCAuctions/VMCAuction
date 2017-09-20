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
    register= () => {
        console.log("register function");
        <RegForm />
    }
    render(){
         return(
            <div className='container row'>  
                <label><h1>Login</h1> </label>
                <div className='login-form '>
                    <form onSubmit={this.formSubmit} >
                        <div className="form-group row" >
                            <label for="userName" className="col-sm-2 col-form-label">User Name</label>
                            <div className="col-sm-10">
                                <input className='form-control' type='text' id='userName' name='userName' 
                                        placeholder='User Name' onChange={this.handleChange} value={this.state.userName} required  />
                            </div>
                        </div>
                       
                        <div className="form-group row">
                            <label for="password" className="col-sm-2 col-form-label">Password</label>
                            <div className="col-sm-10">
                                <input className='form-control' type='password' id='password' name='password'
                                        placeholder='Password' onChange={this.handleChange} value={this.state.password} required />
                            </div>
                        </div>
                        <div className="form-group row">
                            <input type='submit' id='submit' value='Submit' className='btn btn-primary ' />
                        </div>
                        <p>Not registered yet? Register now!</p>

                    </form>
                        <p><Link to='/register'>Register</Link></p>
                </div>
            </div>


         )


    }

}
export default LoginForm;

