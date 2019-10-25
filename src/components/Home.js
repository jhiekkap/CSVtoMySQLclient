import React from 'react'
import {
  Button,
  Container,
  Col,
  Row, 
  Table,
  Dropdown,
  DropdownButton,
} from 'react-bootstrap'


const Home = ({  tables, fetchTables, fetchTable }) => {


    return (
        <form>
            <label>
                <input type="text" placeholder="Search..">
            </label>
        </form>
    )
}

export default Home