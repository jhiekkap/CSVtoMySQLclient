import React from 'react'
import { Table, Row } from 'react-bootstrap' 

const ShowTable = ({
  edit,
  currentTable,
  upDateCurrentTable,
  findCell, 
  toggleColumnsOrder,
  setToggleColumnsOrder,
}) => {
  const handleSortColumn = Col => {
    console.log('SORT COLUMN', Col, toggleColumnsOrder)
    const currentTableContents = currentTable.filter((row, r) => r > 0)
    const sortedCurrentTableContents = sortColumns(currentTableContents, Col)
    const newCurrentTable = currentTable.map((row, r) =>
      r === 0 ? row : sortedCurrentTableContents[r - 1]
    )
    upDateCurrentTable(newCurrentTable)
    setToggleColumnsOrder(
      toggleColumnsOrder.map((col, c) => (c === Col ? !col : col))
    )
  }

  const sortColumns = (currentTableContents, col) => {
    const columnSort = (a, b) => {
      console.log(toggleColumnsOrder[col] ? 'nouseva' : 'laskeva')
      if (toggleColumnsOrder[col]) {
        return a[col] < b[col] ? -1 : a[col] > b[col] ? 1 : 0  //NOUSEVA
      } else {
        return a[col] > b[col] ? -1 : a[col] < b[col] ? 1 : 0  //LASKEVA
      }
    }
    return currentTableContents.sort(columnSort)
  }

  const handleHideColumn = Col => {
    console.log('HIDE COLUMN', Col)
    if (
      currentTable[0].length < 2 ||
      (currentTable[0][Col] === 'ID' &&
        !window.confirm('Are you sure you want to hide ID?'))
    ) {
      return
    }
    console.log('HIDING COL!!!!!')
    const newCurrentTable = currentTable.map(row =>
      row.filter((col, c) => c !== Col)
    )
    upDateCurrentTable(newCurrentTable)
  }

  const handleHideRow = Row => {
    console.log('HIDE ROW', Row)
    if (
      currentTable.length < 2 ||
      (Row === 0 && !window.confirm('Are you sure you want to hide headers?'))
    ) {
      return
    }
    const newCurrentTable = currentTable.filter((row, r) => r !== Row)
    upDateCurrentTable(newCurrentTable)
  }

  const handleInputCell = (value, Row, Col) => {    ///KÄSITTELE SOLUMUUTOKSET
    console.log(value, Row, Col)
    const newCurrentTable = currentTable.map((row, r) =>
      r === Row ? row.map((cell, c) => (c === Col ? value : cell)) : row
    )
    upDateCurrentTable(newCurrentTable)
  }

  return (
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
  )
}

export default ShowTable
