import React, {Component} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Col, Container, Row} from 'react-bootstrap';
import {Ddd} from './components/example-ddd';
import {Engine, Interpreter, Ok, Parser, State} from 'ram-engine';
import {OutputTape} from './components/outputTape';
import {InputTape} from './components/inputTape';
import {Processor} from './components/processor';

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

interface IState {
  state: State;
  inputs: string[];
  isRunning: boolean;
}

class App extends Component<{}, IState> {
  state: IState = {
    state: engine.makeStateFromString(program, []),
    inputs: [''],
    isRunning: false,
  };

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

  inputAdd = () => {
    this.state.inputs.push('');

    this.forceUpdate();
  };

  inputRemove = (id: number) => {
    return (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      event.preventDefault();
      for (let i = id; i < this.state.inputs.length - 1; i++) {
        this.state.inputs[i] = this.state.inputs[i + 1];
      }
      this.state.inputs.length--;

      this.forceUpdate();
    };
  };

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const target = event.target;
    const value = target.value;
    const id: number = +target.name;
    this.state.inputs[id] = value;

    this.forceUpdate();
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
                  <Row
                    style={{height: '20%', backgroundColor: '#66b3ff'}}
                    className="d-flex align-items-center justify-content-center"
                  >
                    Processor
                  </Row>
                  <Row style={{height: '80%'}}>
                    <Processor
                      instruction={this.state.state.nextInstruction.prettyPrint()}
                    />
                  </Row>
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
                <Col>
                  Input tape{' '}
                  <InputTape
                    inputs={this.state.inputs}
                    disabled={this.state.isRunning}
                    inputAdd={this.inputAdd}
                    inputRemove={this.inputRemove}
                    onChange={this.handleInputChange}
                  />
                </Col>
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
                  <Editor />
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
