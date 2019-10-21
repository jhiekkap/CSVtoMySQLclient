import React, { useState } from 'react'
import {
  Button,
  Container,
  Col,
  Row,
  Table,
  Dropdown,
  DropdownButton,
  Form,
} from 'react-bootstrap'
import axios from 'axios'
const endpoint = 'http://localhost:3001/'

const UploadCSV = () => {
  const [upLoadedCSV, setUpLoadedCSV] = useState([])
  const [newTableName, setNewTableName] = useState('vaesto')

  const handleUploadFile = () => {
    const file = document.getElementById('uploadedFile')
    console.log(file.files[0].type)
    if (file.files[0].type === 'text/csv') {
      const reader = new FileReader()

      reader.onload = e => {
        let text = e.target.result
        text = text.replace(/Ã¤/g, 'ä')
        text = text.replace(/Ã¶/g, 'ö')

        const uploadedRows = text.split('\n')
        const delimiter =
          uploadedRows[0].split(';').length > uploadedRows[0].split(',').length
            ? ';'
            : ','
        //console.log(uploadedRows)
        let CSVrows = []
        uploadedRows.forEach(row => CSVrows.push(row.split(delimiter)))
        //console.log(CSVrows)
        setUpLoadedCSV(CSVrows)
        //CSVrows[0].forEach(cell=>console.log(isNaN(cell)))
      }

      reader.readAsText(file.files[0])
    }
  }

  const handleSaveFile = async () => {
    console.log('TRYING TO SAVE')
    if (newTableName) {
      const columns = upLoadedCSV[0].map(col => ({
        name: col,
        type: isNaN(col) ? 'varchar(20)' : 'int',
      }))
      const table = upLoadedCSV.slice(1)
      console.log('TABLE CONTENTS', table)

      try {
        let response = await fetch(endpoint + 'create', {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'post',
          body: JSON.stringify({ newTableName, columns, table }),
        })
        console.log(response)
        if (response.status === 422) {
          alert('invalid input')
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
  return (
    <Container>
      <Row>
        <Col>
          <Form>
            <Form.Label>Upload CSV</Form.Label>
            <Form.Control
              type='file'
              id='uploadedFile'
              onChange={handleUploadFile}
            />
          </Form>
        </Col>
        {upLoadedCSV.length > 0 && (
          <Col>
            <Button variant='outline-secondary' onClick={handleSaveFile}>
              SAVE TO DATABASE
            </Button>
          </Col>
        )}
      </Row>
      <Row>
        <Table striped bordered hover>
          <tbody>
            {upLoadedCSV &&
              upLoadedCSV.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c}>{cell}</td>
                  ))}
                </tr>
              ))}
          </tbody>
        </Table>
      </Row>
    </Container>
  )
}

export default UploadCSV
