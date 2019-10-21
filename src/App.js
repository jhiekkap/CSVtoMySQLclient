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
import UploadCSV from './components/UploadCSV'
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
  const padding = { padding: 10 }
  return (
    <Container>
       
      <Router>
        <div>
          <Row> 
            <Link style={padding} to='/'>
              <Button variant="outline-secondary">home</Button>
            </Link>
            <Link style={padding} to='/showTables'>
              <Button variant="outline-secondary">Show Tables</Button>
            </Link> 
            <Link style={padding} to='/uploadCSV'>
              <Button variant="outline-secondary">Upload CSV</Button>
            </Link> 
            <Link style={padding} to='/login'>
              <Button variant="outline-secondary" onClick={()=>setIsLoggedIn(!isLoggedIn)}>{isLoggedIn ? 'Logout' : 'Login'}</Button>
            </Link> 
          </Row>
          <Route exact path='/' render={() => <Home />} />
          <Route
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
          />
          <Route path='/uploadCSV/' render={()=><UploadCSV />}/>
        </div>
      </Router>
    </Container>
  )
}

export default App
