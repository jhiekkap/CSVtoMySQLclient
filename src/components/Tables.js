import React, { useState } from 'react'
import readXlsxFile from 'read-excel-file'
import {  Container, Row } from 'react-bootstrap'
import axios from 'axios'
import ShowTable from './ShowTable'
import FileForm from './FileForm'
import EditForm from './EditForm'
import cleanName from './../utils/helpers'
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

  const handleUploadFile = e => {
    console.log('UPLOAD FILE', e.target)
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
          `Do you really want to save this table ${tableName} to database?`
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
            tableName,
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
            fetchTable(tableName)
          }, 2000)
        } catch (error) {
          console.log(error)
        }
      }
    } else {
      alert('Updating existing databases not yet possible.')
    }
  }
  
  return (
    <Container>
      <FileForm
        handleSaveFile={handleSaveFile}
        handleUploadFile={handleUploadFile}
        tables={tables}
        fetchTable={fetchTable}
        currentTable={currentTable}
        setShowTable={setShowTable}
        showTable={showTable}
        tableName={tableName}
        setTableName={setTableName}
      />
      {currentTable.length > 0 && (
        <EditForm
          edit={edit}
          setEdit={setEdit}
          findCell={findCell}
          setFindCell={setFindCell}
          undoIndex={undoIndex}
          setUndoIndex={setUndoIndex}
          upDateCurrentTable={upDateCurrentTable}
          currentTable={currentTable}
          setCurrentTable={setCurrentTable}
          cloneTables={cloneTables}
        />
      )}
      <Row>
        <ShowTable
          currentTable={currentTable}
          edit={edit}
          upDateCurrentTable={upDateCurrentTable}
          toggleColumnsOrder={toggleColumnsOrder}
          setToggleColumnsOrder={setToggleColumnsOrder}
          findCell={findCell} 
        />
      </Row>
    </Container>
  )
}

export default Tables
