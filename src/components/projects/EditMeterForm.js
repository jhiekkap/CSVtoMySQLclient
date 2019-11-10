import React, { useState } from 'react'
import {
  Container,
  Row,
  Col,
  Dropdown,
  DropdownButton,
  Table,
  Button,
  Modal
} from 'react-bootstrap'
 
 
function EditMeterForm() {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <> 
        <span onClick={handleShow}> EDIT   </span>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title> MITTARI</Modal.Title>
          </Modal.Header>
          <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  export default EditMeterForm 