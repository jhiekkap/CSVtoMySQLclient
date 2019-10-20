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
        let splitter = ','
        if(uploadedRows[0].split(';').length > uploadedRows[0].split(',').length){
            splitter = ';'
        }
        //console.log(uploadedRows)
        let CSVrows = []
        uploadedRows.forEach(row => CSVrows.push(row.split(splitter)))
        //console.log(CSVrows)
        setUpLoadedCSV(CSVrows)
      }
      reader.readAsText(file.files[0])
    }
  }
  return (
    <Container>
      <Row>
        <Form onChange={handleUploadFile}>
          <Form.Label>Upload CSV</Form.Label>
          <Form.Control type='file' id='uploadedFile' />
        </Form>
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
