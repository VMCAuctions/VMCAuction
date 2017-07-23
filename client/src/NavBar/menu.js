import React from 'react';
import {Link} from 'react-router-dom';
import "./menu.css";


class Menu extends React.Component{
    render(){
        return(
            <div className='navbar navbar-inverse bg-inverse'>
                <ul id='myNav'>
                    <li>
                        <Link to='/'>Home</Link>
                    </li>
                    <li>
                        <Link to='/items/new'>Items</Link>
                    </li>
                    <li>
                        <Link to='/packages/new'>Package</Link>
                    </li>
                    <li>
                        <Link to='/items'>Catalog</Link>
                    </li>
                    <li>
                        <Link to='/packages'>Packages/Bids</Link>
                    </li>
                    {/*<li>
                        <Link to='/login'>Login</Link>
                    </li>*/}
                </ul>
            </div>
        )
    }
}

export default Menu;