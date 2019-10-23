import React, { useState } from 'react'
import readXlsxFile from 'read-excel-file'
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

const Tables = ({
  tables,
  showTable,
  setShowTable,
  table,
  setTable,
  fetchTables,
}) => {
  const [cloneTables, setCloneTables] = useState([])
  const [currentTable, setCurrentTable] = useState([])
  const [newTableName, setNewTableName] = useState('')
  const [edit, setEdit] = useState(false)
  const [findCell, setFindCell] = useState('')
  const [replaceCell, setReplaceCell] = useState('')
  //const [findMatch, setFindMatch] = useState('')
  const [undoIndex, setUndoIndex] = useState(0)

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
    if (cloneTables.length - 1 === undoIndex) {
      setCloneTables(cloneTables.concat([newCurrentTable]))
    } else {
      setCloneTables(
        cloneTables
          .filter((table, t) => t <= undoIndex)
          .concat([newCurrentTable])
      )
    }
    setUndoIndex(undoIndex + 1)
    console.log('HISTORY', cloneTables.length, 'TABLES')
  }

  const handleUploadFile = () => {
    const file = document.getElementById('uploadedFile')
    const fileType = file.files[0].type
    if (fileType === 'text/csv') {
      const type = file.files[0].type
      const name = file.files[0].name.split('.')[0]
      console.log(type)
      console.log(name)
      console.log(file.files[0])
      setNewTableName(name)
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
        //cleanerCSV[1].forEach(cell => console.log(!isNaN(cell)))
      }

      reader.readAsText(file.files[0])
    } else {
      console.log('LOADING EXCEL...')
      readXlsxFile(file.files[0]).then(rows => {
        // `rows` is an array of rows
        // each row being an array of cells.
        //excelRows.push(rows.map(row => row.split(',')))
        console.log(rows)
        setCurrentTable(rows)
        setCloneTables([rows])
        console.log('DONE!')
      })
    }
  }

  const handleSaveFile = async () => {
    console.log('TRYING TO SAVE')
    if (!tables.includes(newTableName)) {
      if (
        window.confirm('Do you really want to save this table to database?')
      ) {
        const columns = currentTable[0].map((col, i) => ({
          name: col,
          type: isNaN(currentTable[0][i]) ? 'varchar(256)' : 'int',
        }))
        const table = currentTable.slice(1)
        console.log('TABLE CONTENTS', table)

        try {
          const response = await axios.post(endpoint + 'create', {
            newTableName,
            columns,
            table,
          })
          console.log(response)
          setTimeout(() => {
            fetchTables()
          }, 2000)
          if (response.status === 422) {
            alert('invalid input')
          }
        } catch (error) {
          console.log(error)
        }
      }
    } else {
      alert('Updating existing databases not yet possible.')
    }
  }

  const handleInputCell = (value, Row, Col) => {
    console.log(value, Row, Col)
    const newCurrentTable = currentTable.map((row, r) =>
      r === Row ? row.map((cell, c) => (c === Col ? value : cell)) : row
    )
    upDateCurrentTable(newCurrentTable)
  }

  const handleFindCell = e => {
    const findString = e.target.value
    /* const filtered = []
      .concat(...currentTable)
      .find(string => string.toLowerCase().match(findString.toLowerCase()))
    console.log('FILTERED', filtered) */
    setFindCell(findString)
    //setFindMatch(filtered)
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
    const currentTableContents = currentTable.filter((row, r) => r > 0)
    const sortedCurrentTableContents = sortColumns(currentTableContents, Col)
    const newCurrentTable = currentTable.map((row, r) =>
      r === 0 ? row : sortedCurrentTableContents[r - 1]
    )
    upDateCurrentTable(newCurrentTable)
  }

  const sortColumns = (currentTableContents, col) => {
    const columnSort = (a, b) => {
      return a[col] < b[col] ? -1 : a[col] > b[col] ? 1 : 0
    }
    return currentTableContents.sort(columnSort)
  }

  const handleHideColumn = Col => {
    if (currentTable[0].length > 1) {
      const newCurrentTable = currentTable.map(row =>
        row.filter((col, c) => c !== Col)
      )
      console.log('HIDE COLUMN', Col)
      upDateCurrentTable(newCurrentTable)
    }
  }

  const handleHideRow = Row => {
    if (currentTable.length > 1) {
      const newCurrentTable = currentTable.filter((row, r) => r !== Row)
      console.log('HIDE ROW', Row)
      upDateCurrentTable(newCurrentTable)
    }
  }

  const handleUndo = e => {
    e.preventDefault()
    if (cloneTables.length > 0 && undoIndex > 0) {
      console.log('UNDO', e.target.value)
      setCurrentTable(cloneTables[undoIndex - 1])
      setUndoIndex(undoIndex - 1)
      console.log('UNDOINDEX', undoIndex - 1)
    }
  }

  const handleRedo = e => {
    e.preventDefault()
    if (undoIndex < cloneTables.length - 1) {
      console.log('REDO')
      setCurrentTable(cloneTables[undoIndex + 1])
      setUndoIndex(undoIndex + 1)
      console.log('UNDOINDEX', undoIndex + 1)
    }
  }

  return (
    <Container>
      <Row>
        <DropdownButton
          variant='light'
          id='dropdown-basic-button'
          title={!showTable ? 'CHOOSE TABLE' : showTable}
        >
          {tables.map((table, i) => (
            <Dropdown.Item
              key={i}
              onClick={() => {
                setShowTable(table)
                setNewTableName(table)
                fetchTable(table)
              }}
            >
              {table}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <Form inline={true}>
          <Form.Control
            className='fileinput'
            type='file'
            id='uploadedFile'
            onChange={handleUploadFile}
          />
        </Form>
        <Form inline={true}>
          <Form.Control
            type='text'
            placeholder='newTableName'
            value={newTableName}
            onChange={({ target }) => setNewTableName(target.value)}
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

      {currentTable.length > 0 && (
        <Row>
          <Col md={6}>
            <Form inline={true} onSubmit={handleReplace} className='replace'>
              <Form.Control
                type='text'
                placeholder='find'
                value={findCell}
                onChange={handleFindCell}
              />
              <Form.Control type='submit' value='REPLACE' />
              <Form.Control
                type='text'
                placeholder='replace'
                value={replaceCell}
                onChange={handleReplaceCell}
              />
            </Form>
          </Col>
          <Col>
            <Button variant='outline-secondary' onClick={handleUndo}>
              Undo
            </Button>
            <Button variant='outline-secondary' onClick={handleRedo}>
              Redo
            </Button>
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
                          value={cell === null ? '' : cell}
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
