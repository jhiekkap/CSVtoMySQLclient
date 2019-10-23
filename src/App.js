import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import {
  Button,
  Container,
  Col,
  Row,
  Table,
  Dropdown,
  DropdownButton,
  Nav,
} from 'react-bootstrap'
import ShowTable from './components/ShowTable'
import Home from './components/Home'
import Tables from './components/Tables'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect, 
  withRouter,
} from 'react-router-dom'
const endpoint = 'http://localhost:3001/'

const App = () => {
  const [tables, setTables] = useState([])
  const [table, setTable] = useState({})
  const [showTable, setShowTable] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(true)


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

  useEffect(() => {
    fetchTables()
  }, [])

  return (
    <Container>

      <Router>
        <div>
          <Row>
            <Link to='/'>
              <Button className='linkbuttons' variant="light" tables={tables}>Home</Button>
            </Link>
            {/* <Link to='/showTables'>
              <Button className='linkbuttons' variant="light">Show Tables</Button>
            </Link> */}
            <Link to='/tables'>
              <Button className='linkbuttons' variant="light">Tables</Button>
            </Link> 
            <Link to='/login'>
              <Button  className='linkbuttons' variant="light" onClick={() => setIsLoggedIn(!isLoggedIn)}>{isLoggedIn ? 'Logout' : 'Login'}</Button>
            </Link>
          </Row>
          <Route exact path='/' render={() => <Home />} />
          {/* <Route
            path='/showTables'
            render={() => (
              <ShowTable
                table={table}
                setTable={setTable}
                tables={tables}
                showTable={showTable}
                setShowTable={setShowTable}
              />
            )}
          /> */}
          <Route path='/tables' render={() => <Tables
            table={table}
            setTable={setTable}
            tables={tables}
            showTable={showTable}
            setShowTable={setShowTable}
          />} />
        </div>
      </Router>
    </Container>
  )
}

export default App
