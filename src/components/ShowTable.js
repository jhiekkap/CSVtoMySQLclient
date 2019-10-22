import React from 'react'  
import { Button, Container, Col, Row, Table, Dropdown, DropdownButton } from 'react-bootstrap'
import axios from 'axios'
const endpoint = 'http://localhost:3001/'

const ShowTable = ({ table, setTable, tables, showTable, setShowTable }) => { 

   const fetchTable = (table) => {
    console.log('fetching .....')
    axios
      .get(endpoint + 'all/' + table)
      .then(body => {
        console.log('TABLE:', table, body.data)
        const {columns, rows} = body.data 
        setTable({columns, rows})
      })
      .catch(error => { 
        console.log(error)
      })
  }

  return (
    <Container>
      <Row>
        <Col>
          <DropdownButton variant="outline-secondary" id="dropdown-basic-button" title= "CHOOSE TABLE">
            {tables.map((table, i) => <Dropdown.Item key={i} onClick={() => { setShowTable(table); fetchTable(table) }}>{table}</Dropdown.Item>)}
          </DropdownButton>
        </Col>

        {showTable && <Col>
          <h3>{showTable}</h3>
        </Col>}
      </Row> 
      {table.columns && table.rows && <Table striped bordered hover>
        <tbody> 
          <tr>
            {table.columns.map((col, i) => <td key={i}>{col}</td>)}
          </tr>
          {table.rows.map((row, r) => <tr key={r}>{row.map((cell, c) => <td key={c}>{cell}</td>)}</tr>)}
        </tbody>
      </Table>}
    </Container>
  );
}

export default ShowTable;
