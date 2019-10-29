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

const MeterForm = ({ productID, products, setProducts, tables }) => {
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

  const handleSave = () => {
    const updatedProducts = [...products]
    const newMeter = {
      title,
      table,
      col,
      unit,
      importance,
      number,
      points,
      show: false,
    } 
    updatedProducts[productID].meters.push(newMeter)
    setProducts(updatedProducts)
    handleCancel()
    console.log(updatedProducts)
  }
  const handleShow = () => setShowModal(true)

  const handleSetTable = async table => {
    setTable(table)
    const chosenTable = await fetchTable(table)
    setMeterTable(chosenTable)
  }

  const handleSetColumn = col => {
    setCol(meterTable[0][col])
    //console.log('METERTABLE', meterTable)
    const valueSet = [...new Set(meterTable.map(row => row[col]))].filter(
      value => value !== null && value !== undefined
    )
    valueSet.shift()
    setNumber(typeof valueSet[0] === 'number' ? true : false)
    setPoints(valueSet)
  }

  const handleGoUp = index => {
    console.log('UP', index)
    const newPoints = []
    if (index > 0) {
      points.forEach((point, i) => {
        if (i + 1 === index) {
          newPoints.push(points[i + 1])
          newPoints.push(points[i])
        } else if (i != index) {
          newPoints.push(point)
        }
      })
      setPoints(newPoints)
      console.log(newPoints)
    }
  }

  const handleGoDown = index => {
    console.log('Down', index)
    const newPoints = []
    if (index < points.length - 1) {
      points.forEach((point, i) => {
        if (i === index) {
          newPoints.push(points[i + 1])
          newPoints.push(point)
        } else if (i != index + 1) {
          newPoints.push(point)
        }
      })
      setPoints(newPoints)
      console.log(newPoints)
    }
  }

  return (
    <>
      <Row onClick={handleShow}>UUSI MITTARI</Row>

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
                title={col ? col : 'VALITSE VERRATTAVA ARVO'}
              >
                {meterTable[0].map((colu, i) => (
                  <Dropdown.Item key={i} onClick={() => handleSetColumn(i)}>
                    {colu}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            )}

            {!number && points && (
              <Col md={6}>
                VALITSE ARVOJÄRJESTYS (1 = korkein)
                <Table>
                  <tbody>
                    {points.map((point, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{point}</td>
                        <td onClick={() => handleGoUp(i)}>+</td>
                        <td onClick={() => handleGoDown(i)}>-</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            )}
            {number && (
              <>
                <Col>
                  MIN: {Math.min(...points)} MAX: {Math.max(...points)} AVG:{' '}
                  {(points.reduce((a, b) => a + b) / points.length).toFixed(2)}{' '}
                  MD: {points[Math.floor(points.length / 2)]}
                </Col>
                <DropdownButton
                  variant='light'
                  id='dropdown-basic-button'
                  title={unit ? unit : 'YKSIKKÖ'}
                >
                  {['€', '€/m2', '-'].map((uni, i) => (
                    <Dropdown.Item
                      key={i}
                      onClick={() => setUnit(uni != '-' ? uni : '')}
                    >
                      {uni}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
                <DropdownButton
                  variant='light'
                  id='dropdown-basic-button'
                  title={`TÄRKEYS ${importance * 5} / 5`}
                >
                  {[1, 2, 3, 4, 5].map((imp, i) => (
                    <Dropdown.Item
                      key={i}
                      onClick={() => setImportance(imp / 5)}
                    >
                      {imp}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </>
            )}
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

export default MeterForm
