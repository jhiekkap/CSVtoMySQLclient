import React, { useState } from 'react'
import { Button, Row, Form } from 'react-bootstrap'

const EditForm = ({
  currentTable,
  setCurrentTable,
  cloneTables, 
  edit,
  setEdit,
  findCell,
  setFindCell,
  undoIndex,
  setUndoIndex,
  upDateCurrentTable,
}) => {
  const [replaceCell, setReplaceCell] = useState('')

  const handleReplaceCell = e => {
    setReplaceCell(e.target.value)
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
    <Row>
      <Form inline={true} onSubmit={handleReplace} className='replace'>
        <Button variant='light' onClick={() => setEdit(!edit)}>
          EDIT
        </Button>
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
        <Button variant='light' onClick={handleUndo}>
          Undo
        </Button>
        <Button variant='light' onClick={handleRedo}>
          Redo
        </Button>
      </Form>
    </Row>
  )
}

export default EditForm
