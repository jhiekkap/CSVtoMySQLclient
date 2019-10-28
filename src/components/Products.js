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
import ProductForm from './ProductForm'
import EditMeterForm from './EditMeterForm'
const Products = ({
  table,
  tables,
  fetchTables,
  fetchTable,
  /* meters,
  setMeters, */
  products,
  setProducts,
  uploadedTables,
}) => {
  useEffect(() => {
    const tablesOfProducts = [
      ...new Set(
        [].concat(
          products.map(product => [
            ...new Set(product.meters.map(meter => meter.table)),
          ])
        )
      ),
    ]
    tablesOfProducts.forEach(table => fetchTable(table[0]))
  }, [])

  const myAverageValue = (district, meter) => { 
    /* let allPointsSum
    if (!meter.number) { 
      allPointsSum = meter.points
        .map(([key, value]) => value)
        .reduce((a, b) => a + b)
    } */

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
      ...myValues.map(value => (meter.number ? value : meter.points.indexOf(value)))
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
          .map(row => (meter.number ? row[valueCol] : meter.points.indexOf(row[valueCol])))
          .reduce((a, b) => a + b) / dist.length
    )
    const allAVG = allAVGs.reduce((a, b) => a + b) / allAVGs.length 
    const points = (myAVG / allAVG) * meter.importance

    return { allAVG, points }
  }

  const allPoints = (product, district) => {
    const pointsList = product.meters.map(
      meter => meterPoints(district, meter).points
    )
    return pointsList.reduce((a, b) => a + b)
  }

  const handleShowMeter = (productID, meterID) => {
    const cloneProducts = [...products]
    cloneProducts[productID].meters[meterID].show = !cloneProducts[productID]
      .meters[meterID].show
    setProducts(cloneProducts)
  }

  return (
    <Container>
      {uploadedTables.length > 0 && (
        <Row>
          <Col>
            <h4>HANKKEET</h4>
            <ul>
              {products.map((product, p) => (
                <li key={p}>
                  {product.title} <br /> - {product.story}
                  <p>
                    VERTAILUSSA:{' '}
                    {product.districts.map(
                      dist =>
                        dist +
                        ': ' +
                        allPoints(product, dist).toFixed(2) +
                        '  '
                    )}
                  </p>
                  <p>MITTARIT:</p>
                  <Table>
                    <tbody>
                      {product.meters.map((meter, m) => (
                        <>
                          <tr key={m} >
                            <td onClick={() => handleShowMeter(p, m)}>
                              {meter.title}
                            </td>
                          </tr>
                          {meter.show && (
                            <> 
                              <EditMeterForm />
                              <span> PAINOTUS {meter.importance} / 5</span>
                              <Row>
                                <Col md={6}>
                                  <Table striped bordered hover>
                                    <thead>
                                      <tr>
                                        <td>ALUE</td>
                                        <td>ARVO / JÄRVENPÄÄN KA</td>
                                        <td>PISTEET</td>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {product.districts.map(dist => (
                                        <tr>
                                          <td>{dist}</td>
                                          <td>
                                            keskiarvo{' '}
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
                            </>
                          )}
                        </>
                      ))}

                      <tr>
                        <td>
                          <MeterForm products={products} tables={tables} />
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </li>
              ))}
            </ul>
            <ProductForm />
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

export default Products
