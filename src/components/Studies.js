import React, { useState, useEffect } from 'react'
import {
  Container,
  Row,
  Col,
  Dropdown,
  DropdownButton,
  Table,
  Button,
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

  const myAverageValue = (district, meter) => {
    let allPoints
    let allPointsSum
    if (!meter.int) {
      allPoints = Object.entries(meter.points)
      allPointsSum = allPoints
        .map(([key, value]) => value)
        .reduce((a, b) => a + b)
      console.log('ALL POINTS', allPoints, allPointsSum)
    }

    console.log(uploadedTables.length, 'TAULUA LADATTU TUTKIMUKSEEN')
    const table = uploadedTables.find(table => table.name === meter.table)
      .content
    const valueCol = table[0].indexOf(meter.col)
    const distCol = table[0].indexOf('Kaupunginosa')

    const myValues = table
      .filter(row => row[distCol] === district.name)
      .map((row, r) => row[valueCol])
    console.log('MY VALUES', district.name, myValues)
    const allDistricts = [
      ...new Set(table.map((row, r) => r > 0 && row[distCol])),
    ].filter(dist => typeof dist === 'string')
    console.log('ALL DISTRICTS', allDistricts)
    const allDistrictsGrouped = allDistricts.map(dist =>
      table.filter(row => row[distCol] === dist)
    )
    console.log('ALLDISTRICTSGROUPED', allDistrictsGrouped)

    const mySum = myValues
      .map(value => (meter.int ? value : meter.points[value]))
      .reduce((a, b) => a + b)
    const myAVG = mySum / myValues.length
    console.log(
      'MY SUM AND AVG AND VALUES',
      district.name,
      mySum,
      myAVG,
      myValues
    )
    const max = Math.max(
      ...myValues.map(value => (meter.int ? value : meter.points[value]))
    )
    console.log('MAX', max)
    return { myAVG, valueCol, allDistrictsGrouped, max }
  }

  const meterPoints = (district, meter) => {
    const { myAVG, valueCol, allDistrictsGrouped } = myAverageValue(
      district,
      meter
    )

    const allAVGs = allDistrictsGrouped.map(dist => {
      const distAVG =
        dist
          .map(row => (meter.int ? row[valueCol] : meter.points[row[valueCol]]))
          .reduce((a, b) => a + b) / dist.length
      return distAVG
    })
    console.log('ALLAVGs', allAVGs)
    const allAVG = allAVGs.reduce((a, b) => a + b) / allAVGs.length
    const importancePercent = (1 / 5) * meter.importance
    const points = (myAVG / allAVG) * importancePercent

    return { allAVG, points }
  }

  const allPoints = (study, district) => {
    const pointsList = study.meters.map(
      meter => meterPoints(district, meter).points
    )
    return pointsList.reduce((a, b) => a + b)
  }

  const handleShowMeter = (studyID, meterID) => {
    const cloneStudies = [...studies]
    console.log(
      'SHOW',
      studyID,
      meterID,
      cloneStudies,
      cloneStudies[studyID].meters[meterID].show
    )
    cloneStudies[studyID].meters[meterID].show = !cloneStudies[studyID].meters[
      meterID
    ].show
    setStudies(cloneStudies)
  }

  return (
    <Container>
      {uploadedTables.length > 0 && (
        <Row>
          <Col>
            <h4>TUTKIMUKSET</h4>
            <ul>
              {studies.map((study, s) => (
                <li key={s}>
                  {study.name} <br /> - {study.story}
                  <p>
                    VERTAILUSSA:{' '}
                    {study.districts.map(
                      dist =>
                        dist.name +
                        ': ' +
                        allPoints(study, dist).toFixed(2) +
                        '  '
                    )}
                  </p>
                  <p>MITTARIT:</p>
                  <Table>
                    <tbody>
                      {study.meters.map((meter, m) => (
                        <div>
                          <tr key={m}>
                            <td onClick={() => handleShowMeter(s, m)}>
                              {meter.name}
                            </td>
                          </tr>
                          {meter.show && (
                            <div>
                              <Button variant='light'>EDIT</Button>
                              <span> PAINOTUS {meter.importance} / 5</span>
                              <Row>
                                <Col md={6}>
                                  <Table striped bordered hover>
                                    <thead>
                                      <tr>
                                        <td>ALUE</td>
                                        <td>ARVO</td>
                                        <td>PISTEET</td>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {study.districts.map(dist => (
                                        <tr>
                                          <td>{dist.name}</td>
                                          <td>
                                            keskiarvo{' '}
                                            {myAverageValue(
                                              dist,
                                              meter
                                            ).myAVG.toFixed(2)}{' '}
                                            {meter.int && meter.unit} /{' '}
                                            {meterPoints(
                                              dist,
                                              meter
                                            ).allAVG.toFixed(2)}
                                          </td>
                                          <td>
                                            pisteet{' '}
                                            {meterPoints(
                                              dist,
                                              meter
                                            ).points.toFixed(2)}{' '}
                                            / 1
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </Table>
                                </Col>
                              </Row>
                            </div>
                          )}
                        </div>
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
