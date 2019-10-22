import React, { useState } from 'react'
import { Button, Container, Col, Row, Table, Form } from 'react-bootstrap'
const endpoint = 'http://localhost:3001/'

const UploadCSV = () => {
  const [newTable, setNewTable] = useState([])
  const [newTableClone, setNewTableClone] = useState([])
  const [newTableName, setNewTableName] = useState('excelpaatteita')
  const [edit, setEdit] = useState(false)
  const [findCell, setFindCell] = useState('')
  const [replaceCell, setReplaceCell] = useState('')

  function empty(data) {
    if (typeof data == 'number' || typeof data == 'boolean') {
      return false
    }
    if (typeof data == 'undefined' || data === null) {
      return true
    }
    if (typeof data.length !== 'undefined') {
      return data.length === 0
    }
    var count = 0
    for (var i in data) {
      if (data.hasOwnProperty(i)) {
        count++
      }
    }
    return count === 0
  }

  const handleUploadFile = () => {
    const file = document.getElementById('uploadedFile')
    const type = file.files[0].type
    const name = file.files[0].name.split('.')[0]
    console.log(type)
    console.log(name)
    console.log(file.files[0])
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
      //console.log(uploadedRows)
      let CSVrows = []
      uploadedRows.forEach(row => CSVrows.push(row.trim().split(delimiter)))
      //console.log(CSVrows)

      let cleanerCSV = CSVrows.filter(row => row.length > 1)

      /* let merkki1 = cleanerCSV[0][5].charAt(14)
      console.log('OUTO MERKKI', merkki1) */
      while (true) {
        let lastCol = cleanerCSV[0][cleanerCSV[0].length - 1]
        //console.log('LAST COL:', lastCol)
        //console.log(typeof lastCol, lastCol.length, lastCol === '')
        if (empty(lastCol) || lastCol === '' || lastCol.length < 2) {
          //console.log('hep')
          cleanerCSV = cleanerCSV.map(row => {
            let rowToPop = row
            rowToPop.pop()
            //console.log('POPPED ROW', rowToPop)
            return rowToPop
          })
        } else {
          //console.log('BREAK!')
          break
        }
      }
      console.log(cleanerCSV)
      setNewTable(cleanerCSV)
      setNewTableClone(cleanerCSV)
      cleanerCSV[1].forEach(cell => console.log(!isNaN(cell)))
    }

    reader.readAsText(file.files[0])
    // }
  }

  const handleSaveFile = async () => {
    console.log('TRYING TO SAVE')
    if (newTableName) {
      const columns = newTable[0].map((col, i) => ({
        name: col,
        type: isNaN(newTable[0][i]) ? 'varchar(256)' : 'int',
      }))
      const table = newTable.slice(1)
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

  const handleInputColName = (value, Row, Col) => {
    console.log(value, Row, Col)
    setNewTableClone(
      newTableClone.map((row, r) => r === Row ?
        row.map((cell, c) => c === Col  ? value : cell) : row  ////TÄMÄ RIKKI
      )
    )
  }

  //const filtered = countries.filter(country => country.name.toLowerCase().match(newFilter.toLowerCase()))

  const handleFindCell = e => {
    let word 
    ///???????????????
    console.log('SANA', word)
    setFindCell(e.target.value)
  }

  const handleReplaceCell = e => {
    setReplaceCell(e.target.value)
  }

  const handleReplace = () => {
    setNewTableClone(newTableClone.map((row, r) => row.map((col, c) => col === findCell ? replaceCell : col)))
  }


  return (
    <Container>
      <Row>
        <Col>
          <Form>
            <Form.Control
              type='file'
              id='uploadedFile'
              onChange={handleUploadFile}
            />
          </Form>
        </Col>
        {newTableClone.length > 0 && (
          <Row>
            <Col>
              <Button variant='outline-secondary' onClick={()=>setEdit(!edit)}>
                {!edit ? 'EDIT' : 'EDIT OFF' }
              </Button>
            </Col>
            <Col>
              <Button variant='outline-secondary' onClick={handleSaveFile}>
                SAVE
              </Button>
            </Col>

            <Col>
              <Form>
                <Form.Control
                  type='text'
                  placeholder='find'
                  value={findCell}
                  onChange={handleFindCell}
                />
              </Form>
            </Col>

            <Col>
              <Button variant='outline-secondary' onClick={handleReplace}>
                REPLACE
              </Button>
            </Col>

            <Col>
              <Form>
                <Form.Control
                  type='text'
                  placeholder='replace'
                  value={replaceCell}
                  onChange={handleReplaceCell}
                />
              </Form>
            </Col>
          </Row>
        )}
      </Row>
      <Row>
        <Table striped bordered hover>
          {newTableClone[0] && (
            <tbody>
              {edit && <tr>
                <td></td>
                {newTableClone[0].map((row, r) => (
                  <td key={r}>x</td>
                ))}
              </tr>}
              {newTableClone.map((row, r) => (
                <tr key={r}>
                  {edit && <td>x</td>}
                  {row.map((cell, c) => (
                    <td style={{backgroundColor: cell === findCell && 'hotpink'}} key={c}>
                      {edit ? (
                        <input
                          type='text'
                          value={cell}
                          onChange={({ target }) =>
                            handleInputColName(target.value, r, c)
                          }
                        />
                      ) : (
                        cell
                      )}
                    </td>
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
