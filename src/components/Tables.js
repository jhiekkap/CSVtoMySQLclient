import React, { useState } from 'react'
import readXlsxFile from 'read-excel-file'
import {
  Button,
  Container,
  Col,
  Row,
  Form,
  DropdownButton,
  Dropdown,
} from 'react-bootstrap'
import axios from 'axios'
import ShowTable from './ShowTable'
const endpoint = 'http://localhost:3001/'

const Tables = ({
  tables,
  fetchTables,
  fetchTable,
  currentTable,
  setCurrentTable,
  cloneTables,
  setCloneTables,
  toggleColumnsOrder,
  setToggleColumnsOrder,
}) => {
  //const [table, setTable] = useState({}) RESET????????????????

  const [tableName, setTableName] = useState('')
  const [edit, setEdit] = useState(false)
  const [findCell, setFindCell] = useState('')
  const [replaceCell, setReplaceCell] = useState('')
  //const [findMatch, setFindMatch] = useState('')
  const [undoIndex, setUndoIndex] = useState(0)

  const [showTable, setShowTable] = useState('')

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

  const cleanName = name => {
    /* const scandies = ['/ä/g','/Ä/g','/ö/g','/Ö/g','/å/g','/Å/g']
    const nonScandies = ['a','A','o','O','å','Å']
    nonScandies.forEach((char,i) => name.replace(scandies[i], char)) */
    ['a', 'A', 'o', 'O', 'å', 'Å'].forEach((char, i) =>
      name.replace(['/ä/g', '/Ä/g', '/ö/g', '/Ö/g', '/å/g', '/Å/g'][i], char)
    )
    name = name.replace(/€\//g, 'ePer')
    name = name.replace(/[^a-zA-Z0-9 ]/g, '')
    return name.replace(/ /gi, '_')
  }

  const handleUploadFile = () => {
    setShowTable('')
    const file = document.getElementById('uploadedFile').files[0]
    const type = file.type
    const name = cleanName(file.name.split('.')[0])
    if (type === 'text/csv') {
      console.log(type, name, file)
      setTableName(name)
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
        const columns = cleanerCSV[0]
        setToggleColumnsOrder(columns.map(col => false))
        //cleanerCSV[1].forEach(cell => console.log(!isNaN(cell)))
      }

      reader.readAsText(file)
    } else {
      console.log('LOADING EXCEL...')
      readXlsxFile(file).then(rows => {
        console.log(rows)
        setCurrentTable(rows)
        setCloneTables([rows])
        setTableName(name)
        console.log('DONE!')
      })
    }
  }

  const handleSaveFile = async () => {
    console.log('TRYING TO SAVE')
    if (!tables.includes(tableName)) {
      if (
        window.confirm(
          `Do you really want to save this table ${cleanName(
            tableName
          )} to database?`
        )
      ) {
        const columns = currentTable[0].map((col, i) => ({
          name: cleanName(col),
          type: isNaN(currentTable[0][i]) ? 'varchar(256)' : 'int',
        }))
        const table = currentTable.slice(1)
        console.log('TABLE CONTENTS', table)

        try {
          const createResponse = await axios.post(endpoint + 'create', {
            tableName: cleanName(tableName),
            columns,
            table,
          })
          console.log(createResponse)
          /* table.forEach(async row => {   //////EI TOIMI REMOTEMYSQLlässä
            const insertResponse = await axios.post(endpoint + 'insert', {
              tableName,
              columns, 
              row
            })
            console.log(insertResponse)
          })  */

          setTimeout(() => {
            fetchTables()
          }, 2000)
          /*  if (response.status === 422) {
             alert('invalid input')
           } */
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
                setTableName(table)
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
            // placeholder='tableName'
            value={tableName}
            onChange={({ target }) => setTableName(target.value)}
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
        <ShowTable
          currentTable={currentTable}
          edit={edit}
          upDateCurrentTable={upDateCurrentTable}
          toggleColumnsOrder={toggleColumnsOrder}
          setToggleColumnsOrder={setToggleColumnsOrder}
          findCell={findCell}
          handleInputCell={handleInputCell}
        />
      </Row>
    </Container>
  )
}

export default Tables
