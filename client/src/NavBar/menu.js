import React from 'react';
import {Link} from 'react-router-dom';
import "./menu.css";
import Axios from 'axios';


class Menu extends React.Component{
    constructor (props){
      super(props);
      this.state = {
        loggedIn: false
      }
    }
    logOut = () => {
      console.log("logOut function reached")
      Axios({
          method: "get",
          url: "/users/logout",
          data: {}

      }).then((response) => {
          console.log("logout function returned from database")

      }).catch((err) =>{
          console.log(err);
      })
    }
    loggedin = () => {
      console.log("loggedIn function reached")
      Axios({
          method: "get",
          url: "/users/loggedin",
          data: {}

      }).then((response) => {
          console.log("/".repeat(80))
          console.log("loggedin function returned from database")
          console.log(response.data.login_check)
          console.log()
          this.setState({
            loggedin: response.data.login_check
          })
          console.log(this.state.loggedIn)

      }).catch((err) =>{
          console.log(err);
      })
    }
    render(){
        this.loggedin();
        var htmlLogCode = "";
        if (this.state.loggedIn == true){
          htmlLogCode =
          <div><li><Link to='/' onClick={this.logOut}><span className="glyphicon glyphicon-log-out"></span> Logout</Link></li>
          </div>
        }
        else{
          htmlLogCode =
          <div><li><Link to='/register'><span className="glyphicon glyphicon-user"></span> Sign Up</Link></li>
          <li><Link to='/login'><span className="glyphicon glyphicon-log-in"></span> Login</Link></li></div>
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
                            <li>
                                <Link to='/item/new'>Items</Link>
                            </li>
                            <li>
                                <Link to='/items'>Catalog</Link>
                            </li>
                            <li>
                                <Link to='/packages/new'>Package</Link>
                            </li>
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
