import React from 'react';
import {Link} from 'react-router-dom';
import "./menu.css";


class Menu extends React.Component{
    render(){
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
                            <li>
                                <Link to='/packageDetails/packageInfo'> </Link>
                            </li>
                        </ul>  
                        <ul className="nav navbar-nav navbar-right">
                            <li><Link to='/register'><span className="glyphicon glyphicon-user"></span> Sign Up</Link></li>
                            <li><Link to='/login'><span className="glyphicon glyphicon-log-in"></span> Login</Link></li>
                        </ul>                  
                    </div>
                </div>
          </nav>
        )
    }
}

export default Menu;