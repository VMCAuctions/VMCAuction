import React, { Component } from 'react';
import './App.css';
import {BrowserRouter, Route} from 'react-router-dom';
import Home from "./Welcome/home.js";
import Menu from './NavBar/menu.js';
import ItemEntryAdmin from './Admin/itemEntryAdmin.js';
import Catalog from './Catalog/catalog.js';
import Package from './Package/package.js';
import PackageCatalog from './PackagesCatalog/packageCatalog.js';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Menu />
          <Route exact path='/' component={Home}/>
          <Route path='/items/new' component={ItemEntryAdmin}/>
          <Route path='/items' component={Catalog}/>
          <Route path='/packages/new' component={Package}/> 
          <Route path='/packages' component={PackageCatalog}/>
          {/*<Route path='/login' component={Login}/>  
          <Route path='/dashboard/:userId' component={Dashboard}/>   */}

        </div>
      </BrowserRouter>
    );
  }
}

export default App;
