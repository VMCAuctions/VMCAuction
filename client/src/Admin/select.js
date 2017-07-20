import React, { Component } from 'react';
// import Axios from './axios';

class Select extends Component{
    constructor(props){
        super(props);
        this.state = { selectoptions:['Category','Electronics','Food','Wine','Travel','Getaway'] }
    }

    // componentDidMount(){
    //     Axios.get("")
    //     .then((response) => {
    //         console.log(rsponse);
    //         this.setState({
    //             selectOptions: response.data
    //         })
    //     }).catch((err) =>{
    //         console.log(err);
    //     })
    // }

    handleChange = (e) => {
        this.props.handleChange(e); //invoke the parent callback for handling the changes
    }

    render(){
        //maping the array with option tags
        let dropdownOptions = this.state.selectoptions.map((itemValue) => {
            return <option value={itemValue}>{itemValue}</option>
        })
        // console.log(this.props.value);
        // console.log(this.props.name);
        return(
            <div>
                <select className='form-control input-lg' value={this.props.value} onChange={this.handleChange} name={this.props.name} >
                    {dropdownOptions}
                </select>
            </div>
        )
    }
}

export default Select;