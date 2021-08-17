import React, {Component} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Col, Container, Row} from 'react-bootstrap';
import {Ddd} from './components/example-ddd';
import {Engine, Interpreter, Ok, Parser, State} from 'ram-engine';
import {OutputTape} from './components/outputTape';

const engine = new Engine(new Parser(), new Interpreter());
const program = `
 write =5
 write =7
 write =5
 write =7
 write =5
 write =7
 write =5
 write =7
 write =5
 write =7
 write =5
 write =7
`;

class App extends Component<{}, {state: State}> {
  constructor(props: {}) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.onClickRestart = this.onClickRestart.bind(this);

    this.state = {state: engine.makeStateFromString(program, [])};
  }

  onClick = () => {
    try {
      const instructionResult: Ok = engine.stepInstruction(this.state.state);
      this.setState(() => ({
        state: instructionResult.state,
      }));
    } catch (err) {
      // manage runtime errors
    }
  };

  onClickRestart = () => {
    this.setState(() => ({
      state: engine.makeStateFromString(program, []),
    }));
  };

  render() {
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
              <Row style={{height: '77%'}}>
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
                  <Ddd
                    onClick={this.onClick}
                    onClickRestart={this.onClickRestart}
                    state={this.state.state}
                    program={program}
                  />
                </Col>
              </Row>
              <Row style={{height: '10%'}}>
                <Col
                  className="d-flex align-items-center justify-content-center"
                  style={{backgroundColor: 'yellow'}}
                >
                  Output tape
                  <OutputTape
                    outs={this.state.state.environment.output.values}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
