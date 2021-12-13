import React, {Component} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Col, Container, Row} from 'react-bootstrap';
import {Engine, Interpreter, Ok, Parser, State} from 'ram-engine';
import {OutputTape} from './components/outputTape';
import {InputTape} from './components/inputTape';
import {Processor} from './components/processor';
import {Editor} from './components/editor';
import {ControlButtons} from './components/control-buttons';

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

const defaultSpeed = 1;
const maxSpeed = 1000;

interface IState {
  state: State;
  inputs: string[];
  isRunning: boolean;
  started: boolean;
  breakpoints: Set<number>;
  programSpeed: number;
}

class App extends Component<{}, IState> {
  state: IState = {
    state: engine.makeStateFromString(program, []),
    inputs: [''],
    isRunning: false,
    started: false,
    breakpoints: new Set(),
    programSpeed: defaultSpeed,
  };

  loadText = (text: string) => {
    this.setState(() => ({
      state: engine.makeStateFromString(
        text,
        this.state.inputs.map<bigint>(x => {
          // eslint-disable-next-line node/no-unsupported-features/es-builtins
          return BigInt(x);
        })
      ),
    }));
  };

  loadProgram = () => {
    this.setState(() => ({
      state: engine.makeStateFromString(
        program,
        this.state.inputs.map<bigint>(x => {
          // eslint-disable-next-line node/no-unsupported-features/es-builtins
          return BigInt(x);
        })
      ),
    }));
  };

  sleep = (milliseconds: number) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };

  runProgram = () => {
    if (this.state.state.completed === true || this.state.isRunning === false)
      return;

    this.onClickStep();
    this.sleep(maxSpeed / this.state.programSpeed).then(this.runProgram); // prayage for tail recursion
  };

  runProgramTillBP = () => {
    if (
      this.state.state.completed === true ||
      this.state.isRunning === false ||
      this.state.breakpoints.has(
        this.state.state.nextInstruction.getLineNumber()
      ) === true
    )
      return;

    this.onClickStep();
    this.sleep(maxSpeed / this.state.programSpeed).then(this.runProgram); // prayage for tail recursion
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

  // control-buttons section
  onClickStop = () => {
    this.setState(
      {
        started: false,
        isRunning: false,
      },
      this.loadProgram
    );
  };
  onClickStep = () => {
    //TEMPORARY
    try {
      const instructionResult: Ok = engine.stepInstruction(this.state.state);
      this.setState(() => ({
        state: instructionResult.state,
      }));
    } catch (err) {
      // manage runtime errors
    }
  };
  onClickRun = () => {
    this.setState(
      {
        started: true,
        isRunning: true,
      },
      this.runProgram
    );
  };
  onClickRunTillBreakpoint = () => {
    this.setState(
      {
        started: true,
        isRunning: true,
      },
      this.runProgramTillBP
    );
  };
  onClickPause = () => {
    this.setState(() => ({
      isRunning: false,
    }));
  };
  onClickDownload = () => {
    //TODO
  };
  onClickUpload = () => {
    //TODO
  };

  componentDidMount = () => {
    const heightOfWrapper = document.getElementById(
      'spreadsheet_wrapper'
    )?.clientHeight;

    const paddingBottomOfWrapper = 2 * 5; //5px

    const h = (
      (heightOfWrapper ?? paddingBottomOfWrapper) - paddingBottomOfWrapper
    ).toString();

    const edi = document.getElementById('editor')!;
    if (edi !== null && edi?.style) edi.style.height = h + 'px';
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
                  <ControlButtons
                    started={this.state.started}
                    running={this.state.isRunning}
                    completed={this.state.state.completed}
                    onClickStop={this.onClickStop}
                    onClickRun={this.onClickRun}
                    onClickPause={this.onClickPause}
                    onClickStep={this.onClickStep}
                    onClickDownload={this.onClickDownload}
                    onClickUpload={this.onClickUpload}
                    onClickRunTillBreakpoint={this.onClickRunTillBreakpoint}
                  />
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
                <Col
                  id="spreadsheet_wrapper"
                  style={{
                    backgroundColor: 'orange',
                    paddingTop: '5px',
                  }}
                >
                  <Editor onClick={this.loadText} />
                </Col>
              </Row>
              <Row style={{height: '10%'}}>
                <Col style={{backgroundColor: 'yellow'}}>
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
