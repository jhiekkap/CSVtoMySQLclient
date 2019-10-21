import React, { useState } from 'react'
import { Button, Container, Col, Row, Table, Form } from 'react-bootstrap'
const endpoint = 'http://localhost:3001/'

const UploadCSV = () => {
  const [upLoadedCSV, setUpLoadedCSV] = useState([])
  const [newTableName, setNewTableName] = useState('excelpaatteita')

  function empty(data) {
    if (typeof data == 'number' || typeof data == 'boolean') {
      return false
    }
    if (typeof data == 'undefined' || data === null) {
      return true
    }
    if (typeof data.length != 'undefined') {
      return data.length == 0
    }
    var count = 0
    for (var i in data) {
      if (data.hasOwnProperty(i)) {
        count++
      }
    }
    return count == 0
  }

  const handleUploadFile = () => {
    const file = document.getElementById('uploadedFile')
    const type = file.files[0].type
    const name = file.files[0].name.split('.')[0]
    console.log(type)
    console.log(name)
    setNewTableName(name)
    //if (file.files[0].type === 'text/csv') {
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
      console.log(uploadedRows)
      let CSVrows = []
      uploadedRows.forEach(row => CSVrows.push(row.trim().split(delimiter)))
      //console.log(CSVrows)

      let cleanerCSV = CSVrows.filter(row => row.length > 1)
      while (true) {
        let lastCol = cleanerCSV[0][cleanerCSV[0].length - 1]
        console.log('LAST COL:', lastCol)
        console.log(typeof lastCol, lastCol.length, lastCol === '')
        if (empty(lastCol) || lastCol === '' || lastCol.length < 2) {
          console.log('hep')
          cleanerCSV = cleanerCSV.map(row => {
            let rowToPop = row
            rowToPop.pop()
            console.log('POPPED ROW', rowToPop)
            return rowToPop
          })
        } else {
          console.log('BREAK!')
          break
        }
      }
      console.log(cleanerCSV)
      setUpLoadedCSV(cleanerCSV)
      cleanerCSV[1].forEach(cell => console.log(!isNaN(cell)))
    }

    reader.readAsText(file.files[0])
    // }
  }

  const handleSaveFile = async () => {
    console.log('TRYING TO SAVE')
    if (newTableName) {
      const columns = upLoadedCSV[0].map((col, i) => ({
        name: col,
        type: isNaN(upLoadedCSV[0][i]) ? 'varchar(256)' : 'int',
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
          {upLoadedCSV[0] && (
            <tbody>
              <tr><td></td>
                {upLoadedCSV[0].map((row, r) => (
                  <td key={r}>x</td>
                ))}
              </tr>
              {upLoadedCSV.map((row, r) => (
                <tr key={r}>
                  <td>x</td>
                  {row.map((cell, c) => (
                    <td key={c}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </Table>
      </Row>
    </Container>
  )
}

export default UploadCSV
