import React, { Component } from 'react';
import './packageCatalog.css';

class SearchBar extends Component{

    handleChange = (e) =>{
        this.props.handleChange(e);
    }

    handleNewLetter = (e) =>{
        this.props.handleNewLetter(e);
    }

    render(){
        return(
            <div>
                <div className="seach-bar">
                    <div className="form-block">
                            <h5>Search By Category</h5>
                            <select onChange={this.handleChange} value={this.props.selectValue} >
                            <option value="All Categories">All Categories</option>
                                {this.props.categories}  
                            </select>
                    </div>
                    <div className="search-block">
                        <h5>Key Word Search</h5>
                        <input type='text'  onChange={this.handleNewLetter} placeholder='Keyword Search'/>
                    </div>
                </div> {/* end of search-bar */}
                <br/>
            </div>
        )
    }
}

export default SearchBar;