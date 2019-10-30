import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import { Button, Container, Row } from 'react-bootstrap'
import Home from './components/Home'
import Tables from './components/Tables'
import Productions from './components/Productions'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
//import {productionTemplates} from './utils/prodTemplate'
const endpoint = 'http://localhost:3001/'
 

const App = () => {
  const [tables, setTables] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [cloneTables, setCloneTables] = useState([])
  const [currentTable, setCurrentTable] = useState([])
  const [toggleColumnsOrder, setToggleColumnsOrder] = useState([])
  const [table, setTable] = useState({})
  const [productions, setProductions] = useState([])
  const [uploadedTables, setUploadedTables] = useState([])
  //const [meters, setMeters] = useState(metres)

  const fetchTables = async () => {
    console.log('fetching .....')
    try { 
      const body = await axios.get(endpoint + 'all')
      console.log('TABLES', body.data)
      setTables(body.data)
      return body.data
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchTables()
  }, [])

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
        setToggleColumnsOrder(columns.map(col => true))
        setUploadedTables(
          uploadedTables.concat({ name: table, content: wholeTable })
        )
      })
      .catch(error => {
        console.log(error)
      })
  }

  return (
    <Container>
      <Router>
        <div>
          <Row>
            <Link to='/'>
              <Button className='linkbuttons' variant='light' tables={tables}>
                KOTI
              </Button>
            </Link>
            <Link to='/tables'>
              <Button className='linkbuttons' variant='light'>
                TAULUT
              </Button>
            </Link>
            <Link to='/projects'>
              <Button className='linkbuttons' variant='light'>
                HANKKEET
              </Button>
            </Link>
            <Link to='/login'>
              <Button
                className='linkbuttons'
                variant='light'
                onClick={() => setIsLoggedIn(!isLoggedIn)}
              >
                {isLoggedIn ? 'KIRJAUDU ULOS' : 'KIRJAUDU SISÄÄN'}
              </Button>
            </Link>
          </Row>
          <Route
            exact
            path='/'
            render={() => (
              <Home
                tables={tables}
                fetchTables={fetchTables}
                fetchTable={fetchTable}
              />
            )}
          />
          <Route
            path='/tables'
            render={() => (
              <Tables
                tables={tables}
                fetchTables={fetchTables}
                fetchTable={fetchTable}
                currentTable={currentTable}
                setCurrentTable={setCurrentTable}
                cloneTables={cloneTables}
                setCloneTables={setCloneTables}
                toggleColumnsOrder={toggleColumnsOrder}
                setToggleColumnsOrder={setToggleColumnsOrder}
              />
            )}
          />
          <Route
            path='/projects'
            render={() => (
              <Productions
                table={table}
                tables={tables}
                fetchTables={fetchTables}
                fetchTable={fetchTable}
                currentTable={currentTable}
                setCurrentTable={setCurrentTable}
                /* meters={meters}
                setMeters={setMeters} */
                productions={productions}
                setProductions={setProductions}
                uploadedTables={uploadedTables}
              />
            )}
          />
        </div>
      </Router>
    </Container>
  )
}

export default App
