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

  const handleShowProduction = productID => {
    const cloneProducts = [...products]
    cloneProducts[productID].show = !cloneProducts[productID].show
    setProducts(cloneProducts)
  }

  const handleDeleteMeter = (productID, meterID) => {
    const cloneProducts = [...products]
    cloneProducts[productID].meters = cloneProducts[productID].meters.filter((meter, i) => i !== meterID)
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
                  <div onClick={() => handleShowProduction(p)}>
                    {product.title}
                    <br /> - {product.story}
                  </div>
                  {product.show && (
                    <div>
                      VERTAILUSSA:{' '}
                      {product.districts.map(
                        dist =>
                          dist +
                          ': ' +
                          allPoints(product, dist).toFixed(2) +
                          '  '
                      )}
                      <br />
                     <h6>MITTARIT:</h6> 
                      {product.meters.map((meter, m) => (
                        <ul key={m}>
                          <li >
                            <span onClick={() => handleShowMeter(p, m)}>{meter.title} </span>
                          {meter.show && (
                            <Col md={6}> 
                              <span><EditMeterForm /></span><span onClick={()=> handleDeleteMeter(p, m)}>DELETE</span>
                              <Table striped bordered hover>
                                <thead>
                                  <tr>
                                    <td>ALUE</td>
                                    <td>ALUEEN KA / JÄRVENPÄÄN KA</td>
                                    <td>PISTEET</td>
                                  </tr>
                                </thead>
                                <tbody>
                                  {product.districts.map((dist, d) => (
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
                      <MeterForm productID={p} products={products} setProducts={setProducts} tables={tables} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <ProductForm />
          </Col>
        </Row>
      )}
    </Container>
  )
}

export default Products
