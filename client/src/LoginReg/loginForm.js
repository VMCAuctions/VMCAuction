import React, {Component} from 'react';
import './login.css';
import Axios from 'axios';
import {Link} from 'react-router-dom';

class LoginForm extends Component{
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
    }

    formSubmit = (e) =>{
        e.preventDefault(); // prevent default form submission behaviour
        Axios({
            method: "post",
            url:"/api/users/:id/login",
            data:{userName: this.state.userName,
                  password: this.state.password  },
            }).then((response) => {
                if(response.data.search){
                    window.location.href ="/package" ;
                }
                this.setState({
                    userName:'',
                    password:''

                });
            localStorage.setItem('user',response.data.user.userName);
            alert(response.data.message)
            
        }).catch((err) =>{
            console.log(err);
        })
    }

    render(){
         return(

            <div className='container'>  
                <div className='well login-form'>
                     <h1>Login</h1>
           
                    <form onSubmit={this.formSubmit} >
                        <div className="form-group row" >
                            <label className="col-sm-2 col-form-label">User Name</label>
                            <div className="col-sm-10">
                                <input className='form-control' type='text' id='userName' name='userName'
                                        placeholder='User Name' onChange={this.handleChange} value={this.state.userName} required  />
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Password</label>
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
