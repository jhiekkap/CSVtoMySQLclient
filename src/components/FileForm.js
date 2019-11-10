import React, { useState } from 'react'
import { Button, Row, Form, DropdownButton, Dropdown } from 'react-bootstrap'

const FileForm = ({
  handleSaveFile,
  handleUploadFile,
  tables,
  fetchTable,
  currentTable,
  setCurrentTable,
  setCloneTables,
  setShowTable,
  showTable,
  tableName,
  setTableName,
  setToggleColumnsOrder,
  upload, 
  setUpload,
}) => { 
 
  return (
    <Row>
      {tables && <DropdownButton
        variant='light'
        id='dropdown-basic-button'
        title={!showTable ? 'VALITSE TAULU' : showTable}
      >
        {tables.map((table, i) => (
          <Dropdown.Item 
            key={i}
            onClick={() => {
              setUpload(false)
              setShowTable(table)
              setTableName(table)
              fetchTable(table).then(wholeTable => {
                setCurrentTable(wholeTable)
                setCloneTables([wholeTable])
                setToggleColumnsOrder(wholeTable[0].map(col => true))
              })
            }}
          >
            {table}
          </Dropdown.Item>
        ))}
      </DropdownButton>}
      {upload ? <Form inline={true}>
        <Form.Control
          className='fileinput'
          type='file'
          id='uploadedFile'
          onChange={handleUploadFile}
        />
      </Form> :
      <Button variant='light' onClick={() => setUpload(true)}>
          UPLOAD
        </Button>}
      {tableName && <Form inline={true}>
        <Form.Control
          type='text'
          // placeholder='tableName'
          value={tableName}
          onChange={({ target }) => setTableName(target.value)}
        />
      </Form>}
      {currentTable.length > 0 && (
        <Button variant='light' onClick={handleSaveFile}>
          SAVE
        </Button>
      )}
    </Row>
  )
}

export default FileForm
