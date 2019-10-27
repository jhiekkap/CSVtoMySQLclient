import React, { useState, useEffect } from 'react'
import {
  Container,
  Row,
  Col,
  Dropdown,
  DropdownButton,
  Table,
} from 'react-bootstrap'
import MeterForm from './MeterForm'
const Studies = ({
  table,
  tables,
  fetchTables,
  fetchTable,
  currentTable,
  setCurrentTable,

  /* meters,
  setMeters, */
  studies,
  setStudies,
  uploadedTables,
}) => {
  const [showMeterForm, setShowMeterForm] = useState(false)

  useEffect(() => {
    const tablesOfStudies = [...new Set([].concat(studies.map(study => [...new Set(study.meters.map(meter => meter.table))])))]
    console.log(tablesOfStudies,'TAULUT TUTKIMUKSISSA')
    tablesOfStudies.forEach(table => console.log('TAULU:', table))
  }, [])

  const countPoints = (study, district) => {
    const pointsList = study.meters.map(meter => {
      const importancePercent = (1 / 5) * meter.importance
      const table = uploadedTables.find(table => table.name === meter.table)
      if (meter.int) {
        const valueCol = table[0].indexOf(meter.col)
        const distCol = table[0].indexOf(district.name)
        const values = table
          .map((row, r) => r > 0 && row(valueCol))
          .filter(row => row[distCol] === district.name)
        const mySum = values.reduce((total, num) => {
          return total + num
        })
        const myAVG = mySum / valueCol.length

        //const allValues = table.map((row,r) => row > 0 && row(valueCol))
        const allDistricts = new Set(
          table.map((row, r) => row > 0 && row[distCol])
        )
        const allAVG = allDistricts.map(
          dist =>
            table
              .filter(row => row[distCol] === dist)
              .reduce((total, num) => {
                return total + num
              }) / allDistricts.length
        )
        return (myAVG / allAVG) * importancePercent
      } else {
        return 0.5
      }
    })
    return pointsList.reduce((total, num) => {
      return total + num
    })
  }

  return (
    <Container>
      {uploadedTables.length > 0 && <Row>
        <Col>
          <h4>TUTKIMUKSET</h4>
          <ul>
            {studies.map((study, i) => (
              <li key={i}>
                {study.name} <br /> - {study.story}
                <p>
                  VERTAILUSSA:{' '}
                  {study.districts.map(
                    dist => dist.name + ': ' + countPoints(study, dist) + '  '
                  )}
                </p>
                <p>MITTARIT:</p>
                <Table>
                  <tbody>
                    {study.meters.map((meter, m) => (
                      <tr key={m}>
                        <td>{meter.name}</td>
                      </tr>
                    ))}
                    {!showMeterForm && (
                      <tr>
                        <td onClick={() => setShowMeterForm(true)}>
                          LISÄÄ MITTARI
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                {showMeterForm && (
                  <MeterForm setShowMeterForm={setShowMeterForm} />
                )}
              </li>
            ))}
            <li>LISÄÄ TUTKIMUS</li>
          </ul>
        </Col>
      </Row>}

      {/* <Row>
        <DropdownButton
          variant='light'
          id='dropdown-basic-button'
          title='VALITSE TAULU'
        >
          {tables.map((table, i) => (
            <Dropdown.Item
              key={i}
              onClick={() => {
                fetchTable(table)
              }}
            >
              {table}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </Row> */}
    </Container>
  )
}

export default Studies
