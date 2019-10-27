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
    const tablesOfStudies = [
      ...new Set(
        [].concat(
          studies.map(study => [
            ...new Set(study.meters.map(meter => meter.table)),
          ])
        )
      ),
    ]
    console.log(tablesOfStudies.length, 'TAULUA TUTKIMUKSISSA')
    tablesOfStudies.forEach(table => fetchTable(table[0]))
  }, [])

  const countPoints = (study, district) => {
    const pointsList = study.meters.map(meter => {
      const importancePercent = (1 / 5) * meter.importance
      console.log(uploadedTables.length, 'TAULUA LADATTU TUTKIMUKSEEN')
      const table = uploadedTables.find(table => table.name === meter.table)
        .content
      if (meter.int) {
        console.log(table[0])
        const valueCol = table[0].indexOf(meter.col)
        const distCol = table[0].indexOf('Kaupunginosa')
        console.log('VALUECOL', valueCol, meter.col)
        console.log('DISTCOL', distCol, district.name)
        const myValues = table
          .filter(row => row[distCol] === district.name)
          .map((row, r) => r > 0 && row[valueCol])
        const mySum = myValues.reduce((total, num) => {
          return total + num
        })
        const myAVG = mySum / myValues.length
        const allDistricts = [
          ...new Set(table.map((row, r) => r > 0 && row[distCol])),
        ].filter(dist => typeof dist === 'string')
        console.log('MYAVG AND ALL DISTRICTS', myAVG, allDistricts)
        const allDistrictsGrouped = allDistricts.map(dist =>
          table.filter(row => row[distCol] === dist)
        )
        console.log('ALLDISTRICTSGROOUPED', allDistrictsGrouped)
        const allAVGs = allDistrictsGrouped.map(dist => {
          const distAVG =
            dist
              .map(row => row[valueCol])
              .reduce((total, num) => {
                return total + num
              }) / dist.length
          //console.log('AVGs', distAVG)
          return distAVG
        })
        console.log('ALLAVGs', allAVGs)
        const allAVG = allAVGs.reduce((total, num) => {
          return total + num
        }) / allAVGs.length
         
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
      {uploadedTables.length > 0 && (
        <Row>
          <Col>
            <h4>TUTKIMUKSET</h4>
            <ul>
              {studies.map((study, i) => (
                <li key={i}>
                  {study.name} <br /> - {study.story}
                  <p>
                    VERTAILUSSA:{' '}
                    {study.districts.map(
                      dist => dist.name + ': ' + countPoints(study, dist).toFixed(2) + '  '
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
        </Row>
      )}

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
