import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import { Button, Container, Row } from 'react-bootstrap'
import Home from './components/Home'
import Tables from './components/Tables'
import Products from './components/Products'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
const endpoint = 'http://localhost:3001/'

const studs = [
  {
    title: 'Minne rakennettaisiin pilvenpiirtäjä?',
    story: 'Järvenpäälle uusi sydän',
    districts: ['Keskusta', 'Kyrölä'],
    show:true,
    meters: [
      {
        title: 'Myytyjen asuntojen keskimääräinen neliöhinta vuoden sisällä',
        table: 'ToteutuneetAsuntoKaupat',
        col: 'VelatonNelihinta',
        unit: '€',
        importance: 1,
        number: true,
        points: [],
        show: false,
      },
      {
        title: 'Myytyjen asuntojen kunto vuoden sisällä',
        table: 'ToteutuneetAsuntoKaupat',
        col: 'Kunto',
        unit: '',
        importance: 1,
        number: false,
        points: ['huono', 'tyyd.', 'hyvä'], 
        show: false,
      },
      {
        title: 'Myytyjen asuntojen rakennusvuosi',
        table: 'ToteutuneetAsuntoKaupat',
        col: 'Rakennusvuosi',
        unit: '',
        importance: 1,
        number: true,
        points: [],
        show: false,
      },
    ],
  },
]

const App = () => {
  const [tables, setTables] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [cloneTables, setCloneTables] = useState([])
  const [currentTable, setCurrentTable] = useState([])
  const [toggleColumnsOrder, setToggleColumnsOrder] = useState([])
  const [table, setTable] = useState({})
  const [products, setProducts] = useState(studs)
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
              <Products
                table={table}
                tables={tables}
                fetchTables={fetchTables}
                fetchTable={fetchTable}
                currentTable={currentTable}
                setCurrentTable={setCurrentTable}
                /* meters={meters}
                setMeters={setMeters} */
                products={products}
                setProducts={setProducts}
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
