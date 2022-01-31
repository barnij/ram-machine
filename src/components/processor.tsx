import React, {Component} from 'react';
import {InputGroup} from '@blueprintjs/core';
import {Col, Container, Row} from 'react-bootstrap';
import './processor.css';

type processorProps = {
  instruction: {
    name: string;
    argument: string;
  };
};
export class Processor extends Component<processorProps, {}> {
  render() {
    return (
      <div style={{margin: 'auto'}} id="processor">
        <Container fluid={true}>
          <Row>
            <Col>instruction:</Col>
            <Col>
              <InputGroup
                style={{textAlign: 'center', color: 'white'}}
                disabled={true}
                fill={true}
                value={this.props.instruction.name}
              />
            </Col>
          </Row>
          <Row style={{marginTop: '1%'}}>
            <Col>argument:</Col>
            <Col>
              <InputGroup
                style={{textAlign: 'center', color: 'white'}}
                disabled={true}
                fill={true}
                value={this.props.instruction.argument}
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
