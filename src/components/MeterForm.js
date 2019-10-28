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
import { fetchTable } from './../utils/fetchData'

const MeterForm = ({ tables }) => {
  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState('')
  const [table, setTable] = useState('')
  const [col, setCol] = useState('')
  const [unit, setUnit] = useState('')
  const [importance, setImportance] = useState(1)
  const [number, setNumber] = useState(false)
  const [points, setPoints] = useState(null)
  const [meterTable, setMeterTable] = useState([])

  const handleClose = () => setShowModal(false)
  const handleCancel = () => {
    setShowModal(false)
    setTitle('')
    setTable('')
    setCol('')
    setUnit('')
    setImportance(1)
    setNumber('')
    setPoints(null)
    setMeterTable([])
  }
  const handleShow = () => setShowModal(true)

  const handleSetTable = async table => {
    setTable(table)
    const chosenTable = await fetchTable(table)
    setMeterTable(chosenTable)
  }

  const handleSetColumn = col => {
    setCol(col)
    console.log('METERTABLE', meterTable)
    const valueSet = [...new Set(meterTable.map(row => row[col]))].filter(
      value => value !== null && value !== undefined
    )
    valueSet.shift()
    console.log('VALUE SET', valueSet)
    /* if (typeof valueSet[0] !== 'number') {
      console.log('TYYPPI', typeof valueSet[0])
      const pointsObj = {}
      {
        valueSet.forEach((value, i) => {
          pointsObj[value] = i
        })
        setPoints(pointsObj)
      }
    } */
    setPoints(valueSet)
  }

  const handleUp = index => {
    console.log('UP', index)
    if(index > 0){
      const newPoints = []
        for(let i = points.length; i--; i > 0){
          const lower = points[i - 1]
          const point = points[i]
          console.log('POINT',point)
          if(i === index){
            newPoints.push(lower)
            newPoints.push(point)
          } else if (i != index - 1) {
            newPoints.push(point)
          }
          setPoints(newPoints)
          console.log(newPoints)
        }
    }
    
  }

  const handleDown = index => {
    console.log('Down', index)
    if (index < points.length - 1) {
      const newPoints = []
      points.forEach((point, i) => {
        const upper = points[i + 1] 
        if (i === index) {
          newPoints.push(upper)
          newPoints.push(point)
        } else if (i != index + 1) { 
          newPoints.push(point)
        }
      })
      //newPoints.reverse()
      setPoints(newPoints)
      console.log(newPoints)
    } 
  }

  return (
    <>
      <Row onClick={handleShow}> + UUSI MITTARI</Row>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>UUSI MITTARI</Modal.Title>
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

            <DropdownButton
              variant='light'
              id='dropdown-basic-button'
              title={!table ? 'VALITSE TAULU' : table}
            >
              {tables.map((table, i) => (
                <Dropdown.Item key={i} onClick={() => handleSetTable(table)}>
                  {table}
                </Dropdown.Item>
              ))}
            </DropdownButton>

            {meterTable.length > 0 && (
              <DropdownButton
                variant='light'
                id='dropdown-basic-button'
                title={'VALITSE VERRATTAVA ARVO'}
              >
                {meterTable[0].map((colu, i) => (
                  <Dropdown.Item key={i} onClick={() => handleSetColumn(i)}>
                    {colu}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            )}

            {points && (
              <Col md={6}>
                VALITSE ARVOJÄRJESTYS (1 = korkein)
                <Table>
                  <tbody>
                    {points.map((point, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{point}</td>
                        <td onClick={() => handleUp(i)}>+</td>
                        <td onClick={() => handleDown(i)}>-</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant='primary' onClick={handleClose}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default MeterForm
