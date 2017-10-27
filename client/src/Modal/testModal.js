import React, { Component } from 'react';
import Modal from './modal.js';

class TestModal extends Component {
   constructor(props) {
    super(props)
    this.state = { 
      isModalOpen: false,
      newCategoryValue: ''
    }
} 

  handleChange = (e) =>{
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  addingCategory = () =>{
    this.props.addingCategory(this.state.newCategoryValue)
    this.setState({
      newCategoryValue: ''
    })
  }

  render() {
    return (
      <div>
        <button onClick={() => this.openModal()}>Add New Category</button>
              
        <Modal isOpen={this.state.isModalOpen} onClose={() => this.closeModal()}>
          <h1>Add New Category</h1>
          <input type='text' name='newCategoryValue' value={this.state.newCategoryValue} onChange={this.handleChange} /><br/><br/>
          <button onClick={this.addingCategory}>Create New Category</button>
          <button onClick={() => this.closeModal()}>Close</button>
        </Modal>
      </div>
    )
  }

  openModal() {
    this.setState({ isModalOpen: true })
  }

  closeModal() {
    this.setState({ isModalOpen: false })
  }
}

export default TestModal;