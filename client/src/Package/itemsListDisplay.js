import React, {Component} from 'react';
import Axios from 'axios';

class DisplayItems extends Component{
    constructor(props){
        super(props);
        this.state = {
            itemsList : [],
            groupedItems: [],
            selectedItems: props.selectedItems, 
            totalValue: props.totalValue,
            totalItems: props.totalItems
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
    
    componentWillReceiveProps(props){
        this.setState({
            selectedItems: this.state.selectedItems,
            totalValue: this.state.totalValue, 
            totalItems: this.state.totalItems
        })
    } 
    rowSelect= (e) =>{
        console.log(e.target.checked, this)
        if(e.target.checked){
            this.state.groupedItems.push(e.target.name);
            this.props.capturingGroupedItems(e.target.name, parseInt(e.target.value), e.target.checked, e.target.id)
        }else{
            console.log("removing element")
            this.state.groupedItems.splice(parseInt(e.target.id), 1)
            this.props.removeGroupedItems(parseInt(e.target.value), parseInt(e.target.id))
        }
        // console.log(e.target.checked)
        // this.setState({
        //     groupedItems: this.state.groupedItems,
        //     totalValue:  parseInt(e.target.value)
        // })
        console.log(this.state.selectedItems, this.state.totalValue, e.target.id)
        //invoking parent(package.js) callback with two arguments    
        
       
    }

    render(){
        let items = this.state.itemsList.map((item,index) =>{
            return(
                <tr key={index} >
                    <td><input type='checkbox' id={index} value={item.value} name={item._id}  onChange={this.rowSelect}/></td>
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