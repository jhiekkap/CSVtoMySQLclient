import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import { Button, Container, Col, Row, Table, Dropdown, DropdownButton } from 'react-bootstrap'

const endpoint = 'http://localhost:3001/'

const App = () => {

  const [tables, setTables] = useState([])
  const [table, setTable] = useState({})
  const [showTable, setShowTable] = useState('')

  const fetchTables = () => {
    console.log('fetching .....')
    axios
      .get(endpoint + 'all')
      .then(body => {
        console.log('TABLES', body.data)
        setTables(body.data)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const fetchTable = (table) => {
    console.log('fetching .....')
    axios
      .get(endpoint + 'all/' + table)
      .then(body => {
        console.log('TABLE:', table, body.data)
        const {headers, rows} = body.data 
        setTable({headers, rows})
      })
      .catch(error => {
        console.log(error)
      })
  }
  useEffect(() => {
    fetchTables()
    //fetchTable('JPAA')
  }, [])


  return (
    <Container>
      <Row>
        <Col>
          <DropdownButton id="dropdown-basic-button" title="CHOOSE TABLE">
            {tables.map((table, i) => <Dropdown.Item key={i} onClick={() => { setShowTable(table); fetchTable(table) }}>{table}</Dropdown.Item>)}
          </DropdownButton>
        </Col>

        {showTable && <Col>
          <h3>{showTable}</h3>
        </Col>}
      </Row>

      {table.headers && table.rows && <Table striped bordered hover>
        <tbody>
          <tr>
            {table.headers.map((header, i) => <td key={i}>{header}</td>)}
          </tr>
          {table.rows.map((row, r) => <tr key={r}>{row.map((col, c) => <td key={c}>{col}</td>)}</tr>)}
        </tbody>
      </Table>}
    </Container>
  );
}

export default App;
