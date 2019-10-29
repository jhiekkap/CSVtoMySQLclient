import React, { useState, useEffect } from 'react'
import axios from 'axios'
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
import ProductionForm from './ProductionForm'
import EditMeterForm from './EditMeterForm'
const Productions = ({
  table,
  tables,
  fetchTables,
  fetchTable,
  /* meters,
  setMeters, */
  productions,
  setProductions,
  uploadedTables,
}) => {
  useEffect(() => {
    const tablesOfProductions = [
      ...new Set(
        [].concat(
          productions.map(production => [
            ...new Set(production.meters.map(meter => meter.table)),
          ])
        )
      ),
    ]
    console.log('TABLETIT', tablesOfProductions)
    tablesOfProductions.forEach(table => {
      if (table[0]) fetchTable(table[0])
    })
  }, [])

  const myAverageValue = (district, meter) => {
    const table = uploadedTables.find(table => table.name === meter.table)
      .content
    const valueCol = table[0].indexOf(meter.col)
    const distCol = table[0].indexOf('Kaupunginosa')

    const myValues = table
      .filter(row => row[distCol] === district)
      .map((row, r) => row[valueCol])
    const allDistricts = [
      ...new Set(table.map((row, r) => r > 0 && row[distCol])),
    ].filter(dist => typeof dist === 'string')
    const allDistrictsGrouped = allDistricts.map(dist =>
      table.filter(row => row[distCol] === dist)
    )

    const mySum = myValues
      .map(value => (meter.number ? value : meter.points.indexOf(value)))
      .reduce((a, b) => a + b)
    const myAVG = mySum / myValues.length
    const max = Math.max(
      ...myValues.map(value =>
        meter.number ? value : meter.points.indexOf(value)
      )
    )
    return { myAVG, valueCol, allDistrictsGrouped, max }
  }

  const meterPoints = (district, meter) => {
    const { myAVG, valueCol, allDistrictsGrouped } = myAverageValue(
      district,
      meter
    )
    const allAVGs = allDistrictsGrouped.map(
      dist =>
        dist
          .map(row =>
            meter.number ? row[valueCol] : meter.points.indexOf(row[valueCol])
          )
          .reduce((a, b) => a + b) / dist.length
    )
    const allAVG = allAVGs.reduce((a, b) => a + b) / allAVGs.length
    const points = (myAVG / allAVG) * meter.importance

    return { allAVG, points }
  }

  const allPoints = (production, district) => {
    if (production.meters > 0) {
      const pointsList = production.meters.map(
        meter => meterPoints(district, meter).points
      )
      return pointsList.reduce((a, b) => a + b)
    } else {
      return 0
    }
  }

  const handleShowMeter = (productionID, meterID) => {
    const cloneProductions = [...productions]
    cloneProductions[productionID].meters[meterID].show = !cloneProductions[
      productionID
    ].meters[meterID].show
    setProductions(cloneProductions)
  }

  const handleShowProductionion = productionID => {
    const cloneProductions = [...productions]
    cloneProductions[productionID].show = !cloneProductions[productionID].show
    setProductions(cloneProductions)
  }

  const handleDeleteMeter = (productionID, meterID) => {
    const cloneProductions = [...productions]
    cloneProductions[productionID].meters = cloneProductions[
      productionID
    ].meters.filter((meter, i) => i !== meterID)
    setProductions(cloneProductions)
    axios
      .put('https://api.myjson.com/bins/7vqws', cloneProductions)
      .then(res => console.log(res))
  }

  return (
    <Container>
      {uploadedTables.length > 0 && (
        <Row>
          <Col>
            <h4>HANKKEET</h4>
            <ul>
              {productions.map((production, p) => (
                <li key={p}>
                  <div onClick={() => handleShowProductionion(p)}>
                    {production.title}
                    <br /> - {production.story}
                  </div>
                  {production.show && (
                    <div>
                      VERTAILUSSA:{' '}
                      {production.districts.map(
                        dist =>
                          dist +
                          ': ' +
                          allPoints(production, dist).toFixed(2) +
                          '  '
                      )}
                      <br />
                      <h6>MITTARIT:</h6>
                      {production.meters &&
                        production.meters.map((meter, m) => (
                          <ul key={m}>
                            <li>
                              <span onClick={() => handleShowMeter(p, m)}>
                                {meter.title}{' '}
                              </span>
                              {meter.show && (
                                <Col md={6}>
                                  <span>
                                    <EditMeterForm />
                                  </span>
                                  <span onClick={() => handleDeleteMeter(p, m)}>
                                    DELETE
                                  </span>
                                  <Table striped bordered hover>
                                    <thead>
                                      <tr>
                                        <td>ALUE</td>
                                        <td>ALUEEN KA / JÄRVENPÄÄN KA</td>
                                        <td>PISTEET</td>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {production.districts.map((dist, d) => (
                                        <tr key={d}>
                                          <td>{dist}</td>
                                          <td>
                                            {myAverageValue(
                                              dist,
                                              meter
                                            ).myAVG.toFixed(2)}
                                            {meter.number && meter.unit} /{' '}
                                            {meterPoints(
                                              dist,
                                              meter
                                            ).allAVG.toFixed(2)}
                                            {meter.number && meter.unit}
                                          </td>
                                          <td>
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
                              )}
                            </li>
                          </ul>
                        ))}
                      <MeterForm
                        productionID={p}
                        productions={productions}
                        setProductions={setProductions}
                        tables={tables}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <ProductionForm
              productions={productions}
              setProductions={setProductions}
            />
          </Col>
        </Row>
      )}
    </Container>
  )
}

export default Productions
