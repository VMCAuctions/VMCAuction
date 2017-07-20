import React, { Component } from 'react';
import Modal from './modal.js';
import AddCategory from './addCategory.js';

class TestModal extends Component {
   constructor(props) {
    super(props)
    this.state = { isModalOpen: false }
  }

  render() {
    return (
      <div>
        <button onClick={() => this.openModal()}>Add New Category</button>
        <Modal isOpen={this.state.isModalOpen} onClose={() => this.closeModal()}>
          <h1>Add New Category</h1>
          <AddCategory />
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