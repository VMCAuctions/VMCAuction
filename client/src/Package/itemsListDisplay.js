import React, {Component} from 'react';
import Axios from 'axios';

class DisplayItems extends Component{
    constructor(props){
        super(props);
        this.state = {
            itemsList : [],
            groupedItems: [],
            totalValue: 0
        }
    }

    componentDidMount(){
        Axios.get("/items")
        .then((result) =>{
            console.log(result);
            this.setState({
                itemsList: result.data
            })
        }).catch((err) =>{
            console.log(err);
        })
    }

    rowSelect= (e) =>{
        // console.log(this)
        // console.log(this.state.groupedItems)
        
        this.state.groupedItems.push(e.target.name);
        console.log(e.target.checked)
        this.setState({
            groupedItems: this.state.groupedItems,
            totalValue:  parseInt(e.target.value)
        })
        console.log(this.state.groupedItems, this.state.totalValue)
        //invoking parent(package.js) callback with two arguments    
        this.props.capturingGroupedItems(this.state.groupedItems, this.state.totalValue)
       
    }

    render(){
        let items = this.state.itemsList.map((item,index) =>{
            return(
                <tr key={index} >
                    <td><input type='checkbox' value={item.value} name={item.name}  onChange={this.rowSelect}/></td>
                    <td>{item._id}</td>
                    <td>{item.name}</td>
                    <td>{item.value}</td>
                    <td>{item.description}</td>
                    <td>{item.restrictions}</td>
                </tr>
            )
        })
        return(
           <div className='table-responsive table-container'>
                <table className='table table-striped table-bordered'>
                    <thead>
                        <tr>
                            <th>Select</th>
                            <th>Item Number</th>
                            <th>Item Name</th>                            
                            <th>Fair Market Value</th>
                            <th>Item Description</th>
                            <th>Item Restriction</th>                            
                        </tr>
                    </thead>
                    <tbody>
                        {items}                        
                    </tbody>
                </table>
            </div>
        )
    }
}

export default DisplayItems;