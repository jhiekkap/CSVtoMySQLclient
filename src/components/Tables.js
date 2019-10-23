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

const Tables = ({ tables, showTable, setShowTable, table, setTable }) => {
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
        setCloneTables([wholeTable])
      })
      .catch(error => {
        console.log(error)
      })
  }

  const upDateCurrentTable = newCurrentTable => {
    setCurrentTable(newCurrentTable)
    setCloneTables(cloneTables.concat([newCurrentTable]))
    console.log('HISTORY', cloneTables.length, 'TABLES')
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
      setCurrentTable(cleanerCSV)
      setCloneTables([cleanerCSV])
      cleanerCSV[1].forEach(cell => console.log(!isNaN(cell)))
    }

    reader.readAsText(file.files[0])
    // }
  }

  const handleSaveFile = async () => {
    console.log('TRYING TO SAVE')
    if (newTableName) {
      const columns = currentTable[0].map((col, i) => ({
        name: col,
        type: isNaN(currentTable[0][i]) ? 'varchar(256)' : 'int',
      }))
      const table = currentTable.slice(1)
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

  const handleInputCell = (value, Row, Col) => {
    console.log(value, Row, Col)
    const newCurrentTable = currentTable.map((row, r) =>
      r === Row ? row.map((cell, c) => (c === Col ? value : cell)) : row
    )
    upDateCurrentTable(newCurrentTable)
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

  const handleReplace = e => {
    e.preventDefault()
    const newCurrentTable = currentTable.map((row, r) =>
      row.map((col, c) => (col === findCell ? replaceCell : col))
    )
    upDateCurrentTable(newCurrentTable)
  }

  const handleSortColumn = Col => {
    console.log('SORT COLUMN', Col)
    /* const columnArray = currentTable.filter((row, r) => r > 0).map(row => row[Col])
    columnArray.sort()
    console.log('SORTED COLUMN', columnArray) */

    const currentTableContents = currentTable.filter((row, r) => r > 0)
    //console.log('KLOONISISÄLLÖT:', currentTableContents)
    const sortedCurrentTableContents = sortColumns(currentTableContents, Col)
    //console.log('KLOONISISÄLLÖT JÄRJESTYKSESSÄ:', sortedCurrentTableContents)
    const newCurrentTable = currentTable.map((row, r) =>
      r === 0 ? row : sortedCurrentTableContents[r - 1]
    )
    //const newCurrentTable = currentTable.map((row, r) => r > 0 ? row.map((col, c) => c === Col ? columnArray[r - 1] : col) : row)
    upDateCurrentTable(newCurrentTable)
  }

  const sortColumns = (currentTableContents, c) => {
    const columnSort = (a, b) => {
      return a[c] < b[c] ? -1 : a[c] > b[c] ? 1 : 0
    }
    return currentTableContents.sort(columnSort)
  }

  const handleHideColumn = Col => {
    const newCurrentTable = currentTable.map(row =>
      row.filter((col, c) => c !== Col)
    )
    console.log('HIDE COLUMN', Col)
    upDateCurrentTable(newCurrentTable)
  }

  const handleHideRow = Row => {
    const newCurrentTable = currentTable.filter((row, r) => r !== Row)
    
    console.log('HIDE ROW', Row)
    upDateCurrentTable(newCurrentTable)
  }

  return (
    <Container>
      <Row>
        <DropdownButton
          variant='light'
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
            className='fileinput'
            type='file'
            id='uploadedFile'
            onChange={handleUploadFile}
          />
        </Form>
        {currentTable.length > 0 && (
          <div>
            <Button variant='light' onClick={() => setEdit(!edit)}>
              EDIT
            </Button>

            <Button variant='light' onClick={handleSaveFile}>
              SAVE TO DATABASE
            </Button>
          </div>
        )}
      </Row>

      {currentTable && (
        <Row>
          <Form inline={true} onSubmit={handleReplace} className='replace'>
            <Col md={2}>
              <Form.Control
                type='text'
                placeholder='find'
                value={findCell}
                onChange={handleFindCell}
              />
            </Col>
            <Col md={2}>
              <Form.Control type='submit' value='REPLACE' />
            </Col>
            <Col md={2}>
              <Form.Control
                type='text'
                placeholder='replace'
                value={replaceCell}
                onChange={handleReplaceCell}
              />
            </Col>
          </Form>
        </Row>
      )}

      <Row>
        <Table striped bordered hover>
          {currentTable && (
            <tbody>
              {edit && (
                <tr>
                  <td></td>
                  {currentTable[0].map((col, c) => (
                    <td key={c} onClick={() => handleHideColumn(c)}>
                      x
                    </td>
                  ))}
                </tr>
              )}
              {currentTable.map((row, r) => (
                <tr key={r}>
                  {edit && <td onClick={() => handleHideRow(r)}>x</td>}
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
                            handleInputCell(target.value, r, c)
                          }
                        />
                      ) : r === 0 ? (
                        <u onClick={() => handleSortColumn(c)}>{cell}</u>
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

export default Tables
