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
            <Row style={{height: '10%'}}>
              <Col style={{backgroundColor: 'lightblue'}}>aaa</Col>
            </Row>
            <Row style={{height: '90%'}}>
              <Col style={{backgroundColor: 'green'}}>
                <div>bbb</div>
              </Col>
            </Row>
          </Col>
          <Col sm={9}>
            <Row style={{height: '10%'}}>
              <Col>ccc</Col>
            </Row>
            <Row style={{height: '80%'}}>
              <Col style={{backgroundColor: 'orange'}}>
                <Ddd />
              </Col>
            </Row>
            <Row style={{height: '10%'}}>
              <Col style={{backgroundColor: 'yellow'}}>
                <div>eee</div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
