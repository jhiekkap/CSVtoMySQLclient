import React, { useState } from 'react'
import {
  Button,
  Container,
  Col,
  Row,
  Table,
  Form,
  DropdownButton,
  Dropdown,
} from 'react-bootstrap'
import axios from 'axios'
const endpoint = 'http://localhost:3001/'

const UploadCSV = ({ tables, showTable, setShowTable, table, setTable }) => {
  const [newTable, setNewTable] = useState([])
  const [newTableClone, setNewTableClone] = useState([])
  const [cloneTables, setCloneTables] = useState([])
  const [currentTable, setCurrentTable] = useState([])
  const [newTableName, setNewTableName] = useState('excelpaatteita')
  const [edit, setEdit] = useState(false)
  const [findCell, setFindCell] = useState('')
  const [replaceCell, setReplaceCell] = useState('')

  const fetchTable = table => {
    console.log('fetching .....')
    axios
      .get(endpoint + 'all/' + table)
      .then(body => {
        console.log('TABLE:', table, body.data)
        const { columns, rows } = body.data
        const wholeTable = [columns].concat(rows)
        setTable(wholeTable)
        setCurrentTable(wholeTable)
        setCloneTables(wholeTable)
      })
      .catch(error => {
        console.log(error)
      })
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
      let CSVrows = []
      uploadedRows.forEach(row => CSVrows.push(row.trim().split(delimiter)))

      let cleanerCSV = CSVrows.filter(row => row.length > 1)

      while (true) {
        let lastCol = cleanerCSV[0][cleanerCSV[0].length - 1]
        if (lastCol === '' || lastCol.length < 2) {
          cleanerCSV = cleanerCSV.map(row => {
            let rowToPop = row
            rowToPop.pop()
            return rowToPop
          })
        } else {
          break
        }
      }
      console.log(cleanerCSV)
      setNewTable(cleanerCSV)
      setNewTableClone(cleanerCSV)
      //setTable({ columns, rows })
      //setCloneTables(cloneTables.concat({ columns, rows }))
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
      newTableClone.map(
        (row, r) =>
          r === Row ? row.map((cell, c) => (c === Col ? value : cell)) : row ////TÄMÄ RIKKI
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
    setNewTableClone(
      newTableClone.map((row, r) =>
        row.map((col, c) => (col === findCell ? replaceCell : col))
      )
    )
  }

  return (
    <Container>
      <Row>
        <DropdownButton
          variant='outline-secondary'
          id='dropdown-basic-button'
          title='CHOOSE TABLE'
        >
          {tables.map((table, i) => (
            <Dropdown.Item
              key={i}
              onClick={() => {
                setShowTable(table)
                fetchTable(table)
              }}
            >
              {table}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <Form>
          <Form.Control
            type='file'
            id='uploadedFile'
            onChange={handleUploadFile}
          />
        </Form>
        {currentTable && (
          <div>
            <Button variant='outline-secondary' onClick={() => setEdit(!edit)}>
              EDIT
            </Button>

            <Button variant='outline-secondary' onClick={handleSaveFile}>
              SAVE
            </Button>
          </div>
        )}
      </Row>

      {currentTable && (
        <Row>
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
            <Button variant="light" onClick={handleReplace}>
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

      <Row>
        <Table striped bordered hover>
          {currentTable && (
            <tbody>
              {edit && (
                <tr>
                  <td></td>
                  {currentTable[0].map((row, r) => (
                    <td key={r}>x</td>
                  ))}
                </tr>
              )}
              {currentTable.map((row, r) => (
                <tr key={r}>
                  {edit && <td>x</td>}
                  {row.map((cell, c) => (
                    <td
                      style={{
                        backgroundColor: cell === findCell && 'hotpink',
                      }}
                      key={c}
                    >
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
