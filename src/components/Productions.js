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
  Card,
  ListGroup,
} from 'react-bootstrap'
import MeterForm from './MeterForm'
import ProductionForm from './ProductionForm'
import EditMeterForm from './EditMeterForm'
const JSONendpoint = 'https://api.myjson.com/bins/7vqws'
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
    const fetchJSON = async () => {
      const body = await axios.get(JSONendpoint)
      const jsonProductions = body.data
      setProductions(jsonProductions)
      console.log('JIISONIA', jsonProductions)
      const tablesOfProductions = [
        ...new Set(
          [].concat(
            jsonProductions.map(production => [
              ...new Set(production.meters.map(meter => meter.table)),
            ])
          )
        ),
      ]
        .map(table => table[0])
        .filter(table => table)

      console.log('TABLETIT1', tablesOfProductions)
      tablesOfProductions.forEach(table => fetchTable(table))
    }
    fetchJSON()
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

  const handleShowProduction = productionID => {
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
      <Row>
        <Col>
          <ProductionForm
            productions={productions}
            setProductions={setProductions}
          />
        </Col>
      </Row>
      <Row>
        {productions.map((production, p) => (
          <Card key={p} style={{ width: '36rem', marginTop: '1rem' }}>
            {/*  <Card.Img variant='top' src='holder.js/100px180' /> */}
            <Card.Body>
              <div>
                <Card.Title className='productions'>
                  {production.title}
                </Card.Title>
                <Card.Text className='productions'>
                  {production.story}
                  <br />
                  VERTAILUSSA: <br />
                </Card.Text>
              </div>
              <span className='productions'>
                {production.districts.map(
                  dist =>
                    dist + ': ' + allPoints(production, dist).toFixed(2) + '  '
                )}
              </span>
              <br />
              <h6 className='productions'>MITTARIT:</h6>
              {production.meters &&
                production.meters.map((meter, m) => (
                  <ListGroup className='productions' key={m} variant='flush'>
                    <ListGroup.Item className='productions'>
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
                                    {myAverageValue(dist, meter).myAVG.toFixed(
                                      2
                                    )}
                                    {meter.number && meter.unit} /{' '}
                                    {meterPoints(dist, meter).allAVG.toFixed(2)}
                                    {meter.number && meter.unit}
                                  </td>
                                  <td>
                                    {meterPoints(dist, meter).points.toFixed(2)}{' '}
                                    / 1
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </Col>
                      )}
                    </ListGroup.Item>
                  </ListGroup>
                ))}
              {/* <Button variant='primary'>Go somewhere</Button> */}
              <MeterForm
                className='productions'
                productionID={p}
                productions={productions}
                setProductions={setProductions}
                tables={tables}
              />
            </Card.Body>
          </Card>
        ))}
      </Row>
    </Container>
  )
}

export default Productions
