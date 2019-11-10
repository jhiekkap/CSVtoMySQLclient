import React, { useState } from 'react'
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import input from '@material-ui/core/input';
import {
  Button,
  Container,
  Col,
  Row, 
  Table,
  Dropdown,
  DropdownButton,
  Collapse
  
} from 'react-bootstrap'
import { TextField } from '@material-ui/core';
import { object } from 'prop-types';
const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  input: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  menu: {
    width: 200,
  },
}));

 
const Home = ({  tables, fetchTables, fetchTable, currentTable }) => {
    const [state, setState] = useState({
        Keskusta: true,
        Loutti: true,
        Pajala: true,
        Pöytäalho: true,
        Jamppa: true,
        Isokytö: true,
        Nummenkylä: true,
        Hinta: true,
        Hinta2: true
    });
const handleChange = name => event => {
        setState({ ...state, [name]: event.target.checked });
      };

    return (
        <div>
        <div>
            <form>
                <label>
                <DropdownButton
          variant='light'
          id='dropdown-basic-button'
          title='CHOOSE TABLE'
        >
          {tables.map((table, i) => (
            <Dropdown.Item
              key={i}
              onClick={() => {fetchTable(table)}}>
              {table}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        </label>
        </form>
    </div>
    <td>Syötä hinta</td>
    <div class="row">
    <TextField id="Hinta" type="Hinta" inputProps={'Hinta'} ></TextField><p>000 - </p>
    <TextField id="Hinta2" type="Hinta2" inputProps={'Hinta2'}></TextField><p>000</p>
    </div>
    
    <div>
    <row>
      <td>Keskusta</td><Checkbox 
        checked={state.Keskusta}
        onChange={handleChange('Keskusta')}
        value="Keskusta"
        inputProps={{
          'aria-label': 'Keskusta checkbox',
        }}
      />
      <td>Loutti</td><Checkbox
        checked={state.Loutti}
        onChange={handleChange('Loutti')}
        value="Loutti"
        inputProps={{
          'aria-label': 'Loutti checkbox',
        }}
      />
      <td>Pajala</td><Checkbox
        checked={state.Pajala}
        onChange={handleChange( 'Pajala')}
        value=  "Pajala"
        inputProps={{
          'aria-label': 'Pajala checkbox',
        }}
      />
      <td>Pöytäaho</td><Checkbox
        checked={state.Pöytäalho}
        onChange={handleChange('Pöytäalho')}
        value="Pöytäalho"
        inputProps={{
          'aria-label': 'Pöytäalho checkbox',
        }}
      />
      <td>Jamppa</td><Checkbox
        checked={state.Jamppa}
        onChange={handleChange('Jamppa')}
        value="Jamppa"
        inputProps={{
          'aria-label': 'Jamppa checkbox',
        }}
      />
      <td>Isokytö</td><Checkbox
        checked={state.Isokytö}
        onChange={handleChange('Isokytö')}
        value="Isokytö"
        inputProps={{
          'aria-label': 'Isokytö checkbox',
        }}
      />
      
      <td>Nummenkylä</td><Checkbox
        checked={state.Nummenkylä}
        onChange={handleChange('Nummenkylä')}
        value="Nummenkylä"
        inputProps={{
          'aria-label': 'Nummenkylä checkbox',
        }}
      />
      
    </row>

  </div>
  
  <Table>
    <tbody>
    {currentTable.length > 0 && 
      currentTable.filter((row, r) =>{
        const hinta = row [6]
        //for (let [Hinta, Hinta2] of object.entries(state)) {
          //console.log(`${Hinta}: ${Hinta2}`);
          //if (hinta < Hinta && hinta > Hinta2 ) {
            //return true
        //}
        //}
        //console.log(state.Keskusta)
        const alue = row[1]
        //console.log(alue)
        //console.log(state)
        for (let [key, value] of Object.entries(state)) {
          console.log(`${key}: ${value}`);
          if(key === alue && value){
            return true
            
          }
        }
        
       return false
        }).map((row, r) => <tr key={r}>{row.map((col,c)=> <td key={c}> {col}</td>)}
    </tr>)}
    </tbody>
  </Table>
 
  </div>
        
    )
}

export default Home