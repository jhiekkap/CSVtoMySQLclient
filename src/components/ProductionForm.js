import React, { useState } from 'react'
import {
  Container,
  Row,
  Col,
  Dropdown,
  DropdownButton,
  Table,
  Button,
  Modal,
  Form,
} from 'react-bootstrap'
import axios from 'axios'

const ProductionForm = ({ productions, setProductions }) => {
  const [showModal, setShowModal] = useState(false)

  const [title, setTitle] = useState('')
  const [story, setStory] = useState('')
  const [districts, setDistricts] = useState([])
  const [show, setShow] = useState(false)
  const [meters, setMeters] = useState([])

  const handleClose = () => setShowModal(false)
  const handleCancel = () => {
    setShowModal(false)

    setTitle('')
    setStory('')
    setDistricts([])
    setShow(false)
    setMeters([])
  }

  const allDistricts = ['Kyrölä', 'Jamppa', 'Keskusta', 'Loutti']

  const handleSave = () => {
    const cloneProductions = [...productions]
    const newProduction = {
      title,
      story,
      districts,
      show,
      meters,
    }
    cloneProductions.push(newProduction)
    setProductions(cloneProductions)
    handleCancel()
    console.log(cloneProductions)
    axios.put('https://api.myjson.com/bins/7vqws', cloneProductions).then(res => console.log(res))
  }
  const handleShow = () => setShowModal(true)

  const handleSetDistrict = district => {
    setDistricts(districts.concat(district))
  }

  const handleDeleteDistrict = district => {
    setDistricts(districts.filter(dist => dist !== district))
  }

  return (
    <>
      <Row onClick={handleShow}>LUO UUSI HANKE</Row>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>UUSI HANKE</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId='formGroupEmail'>
              <Form.Label>Otsikko</Form.Label>
              <Form.Control
                value={title}
                type='text'
                onChange={({ target }) => setTitle(target.value)}
              />
            </Form.Group>

            <Form.Group controlId='formGroupEmail'>
              <Form.Label>Sisältö</Form.Label>
              <Form.Control
                value={story}
                type='text'
                onChange={({ target }) => setStory(target.value)}
              />
            </Form.Group>

            <DropdownButton
              variant='light'
              id='dropdown-basic-button'
              title='VALITSE KAUPUNGINOSA'
              multiple={true}
            >
              {allDistricts.map((dist, i) => (
                <Dropdown.Item key={i} onClick={() => handleSetDistrict(dist)}>
                  {dist}
                </Dropdown.Item>
              ))}
            </DropdownButton>
            {districts.map(dist => (
              <p>
                {dist}&nbsp;
                <span onClick={() => handleDeleteDistrict(dist)}>X</span>
              </p>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant='primary' onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ProductionForm
