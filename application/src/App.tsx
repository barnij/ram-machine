import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Col, Container, Row} from 'react-bootstrap';
import {Ddd} from './components/example-ddd';

function App() {
  return (
    <div className="App">
      <Container fluid>
        <Row style={{height: '100vh'}}>
          <Col sm={3}>
            <Row style={{height: '8%'}}>
              <Col style={{backgroundColor: 'lightgreen'}}>
                Controls buttons
              </Col>
            </Row>
            <Row style={{height: '15%'}}>
              <Col style={{backgroundColor: 'lightblue'}}>
                Preview of processor
              </Col>
            </Row>
            <Row style={{height: '83%'}}>
              <Col style={{backgroundColor: 'green'}}>
                <div>Registers</div>
              </Col>
            </Row>
          </Col>
          <Col sm={9}>
            <Row style={{height: '10%'}}>
              <Col>Input tape</Col>
            </Row>
            <Row style={{height: '80%'}}>
              <Col style={{backgroundColor: 'orange'}}>
                Intructions
                <Ddd />
              </Col>
            </Row>
            <Row style={{height: '10%'}}>
              <Col style={{backgroundColor: 'yellow'}}>Output tape</Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
