import React, { useState } from 'react'
import {
  Container,
  Row,
  Col,
  Dropdown,
  DropdownButton,
  Table,
  Button,
} from 'react-bootstrap'
const MeterForm = ({ setShowMeterForm }) => {

    return (
        <Container>
            <Row>
                <Col>
            <Button onClick={()=>setShowMeterForm(false)}>back</Button>
                </Col>
            </Row>
        </Container>
    )
}

export default MeterForm