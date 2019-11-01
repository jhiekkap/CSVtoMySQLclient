import React, { useState } from 'react'
import './App.css'
import { Button, Container, Row } from 'react-bootstrap'
import Home from './components/Home'
import Tables from './components/Tables'
import Projects from './components/Projects'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true)

  return (
    <Container>
      <Router>
        <div> 
          <Row>
            <Link to='/'>
              <Button className='linkbuttons' variant='light'>
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
          <Route exact path='/' render={() => <Home />} />
          <Route path='/tables' render={() => <Tables />} />
          <Route path='/projects' render={() => <Projects />} />
        </div>
      </Router>
    </Container>
  )
}

export default App
