import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import {
  Button,
  Container, 
  Row, 
} from 'react-bootstrap' 
import Home from './components/Home'
import Tables from './components/Tables'
import {
  BrowserRouter as Router,
  Route,
  Link, 
} from 'react-router-dom'
const endpoint = 'http://localhost:3001/'

const App = () => {
  const [tables, setTables] = useState([]) 
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
            <Link to='/tables'>
              <Button className='linkbuttons' variant="light">Tables</Button>
            </Link> 
            <Link to='/login'>
              <Button  className='linkbuttons' variant="light" onClick={() => setIsLoggedIn(!isLoggedIn)}>{isLoggedIn ? 'Logout' : 'Login'}</Button>
            </Link>
          </Row>
          <Route exact path='/' render={() => <Home />} /> 
          <Route path='/tables' render={() => <Tables 
            tables={tables} 
            fetchTables={fetchTables}
          />} />
        </div>
      </Router>
    </Container>
  )
}

export default App
