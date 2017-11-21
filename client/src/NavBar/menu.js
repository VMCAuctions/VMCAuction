import React from 'react';
import {Link} from 'react-router-dom';
import "./menu.css";
import Axios from 'axios';


class Menu extends React.Component{
    constructor (props){
      super(props);
      this.state = {
        loggedIn: false,
        admin: Boolean
      }
    }

    logOut = () => {
      Axios({
          method: "get",
          url: "/api/users/logout",
          data: {}
      }).then((response) => {
          this.loggedin()
      }).catch((err) =>{
          console.log(err);
      })
    }

    loggedin = () => {
      Axios({
          method: "get",
          url: "/api/users/loggedin",
          data: {}
      }).then((response) => {
         if (response.data.login_check !== this.state.loggedin){
            this.setState({
                    loggedin: response.data.login_check,
                    admin : response.data.admin
            })
          }
      }).catch((err) =>{
          console.log(err);
      })
    }
  
    componentWillMount(){
        this.loggedin();
    }

    componentWillUpdate(){
        this.loggedin();
    }

    render(){
        var htmlLogCode = "";
        if (this.state.loggedin === true){
          htmlLogCode = <div>
                            <li>Hi, {localStorage.user} </li>
                            <li><Link to='/' onClick={this.logOut}><span className="glyphicon glyphicon-log-out"></span> Logout</Link></li>
                        </div>
        }
        else{
          htmlLogCode = <div>
                            <li><Link to='/register'><span className="glyphicon glyphicon-user"></span> Sign Up</Link></li>
                            <li><Link to='/login'><span className="glyphicon glyphicon-log-in"></span> Login</Link></li>
                        </div>
        }

        var htmlAdminItems = "";
        if(this.state.admin === true){
            htmlAdminItems = <li><Link to='/item/new'>Items</Link></li>
        }

        var htmlAdminPackage = "";
        if(this.state.admin === true){
            htmlAdminPackage = <li><Link to='/packages/new'>Package</Link></li>
        }
        return(
            <nav className="navbar navbar-inverse">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="/">VMC POTR</a>
                    </div>
                    <div className="collapse navbar-collapse" id="myNavbar">
                        <ul className="nav navbar-nav">
                            <li>
                                <Link to='/'>Home</Link>
                            </li>
                            {htmlAdminItems}
                            <li>
                                <Link to='/items'>Catalog</Link>
                            </li>
                            {htmlAdminPackage}
                            <li>
                                <Link to='/package'>Packages/Bids</Link>
                            </li>

                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            {htmlLogCode}
                        </ul>
                    </div>
                </div>
          </nav>
        )
    }
}

export default Menu;
