import React from 'react'
import { Button, Row, Form, DropdownButton, Dropdown } from 'react-bootstrap'

const FileForm = ({
  handleSaveFile,
  handleUploadFile,
  tables,
  fetchTable,
  currentTable,
  setShowTable,
  showTable,
  tableName,
  setTableName,
}) => {
  return (
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
        <Button variant='light' onClick={handleSaveFile}>
          SAVE TO DATABASE
        </Button>
      )}
    </Row>
  )
}

export default FileForm
