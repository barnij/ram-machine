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
import {EditorAlert} from './components/alert';
import {Slider} from '@blueprintjs/core';

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
  errorOpen: boolean;
  errorMessage: string;
  errorLine: number;
  errorType: string;
  sliderLabelRenderer: () => string;
}

class App extends Component<{}, IState> {
  state: IState = {
    state: engine.makeStateFromString('', []),
    inputs: [''],
    isRunning: false,
    started: false,
    breakpoints: new Set(),
    programSpeed: defaultSpeed,
    errorOpen: false,
    errorMessage: '',
    errorLine: 0,
    errorType: '',
    sliderLabelRenderer: () => '',
  };

  loadText = (text: string) => {
    try {
      const newState: State = engine.makeStateFromString(
        text,
        this.state.inputs.map<bigint>(x => {
          // eslint-disable-next-line node/no-unsupported-features/es-builtins
          return BigInt(x);
        })
      );

      this.setState({
        state: newState,
      });
    } catch (err) {
      let msg = 'ram machine encountered unknown problem';
      if (err instanceof Error) msg = err.message;

      this.setState({
        started: false,
        isRunning: false,
        errorMessage: msg,
        errorOpen: true,
        errorType: 'Parser Error',
        errorLine: 0, // TODO in parser
      });
    }
  };

  loadProgram = () => {
    try {
      const newState: State = engine.makeStateFromString(
        program,
        this.state.inputs.map<bigint>(x => {
          // eslint-disable-next-line node/no-unsupported-features/es-builtins
          return BigInt(x);
        })
      );

      this.setState({
        state: newState,
      });
    } catch (err) {
      let msg = 'ram machine encountered unknown problem';
      if (err instanceof Error) msg = err.message;

      this.setState({
        started: false,
        isRunning: false,
        errorMessage: msg,
        errorOpen: true,
        errorType: 'Parser Error',
        errorLine: 0, // TODO in parser
      });
    }
  };

  sleep = (milliseconds: number) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };

  runProgram = () => {
    if (this.state.state.completed || !this.state.isRunning) return;

    this.onClickStep();
    this.sleep(maxSpeed - this.state.programSpeed).then(this.runProgram);
  };

  runProgramTillBP = () => {
    if (
      this.state.state.completed ||
      !this.state.isRunning ||
      this.state.breakpoints.has(
        this.state.state.nextInstruction.getLineNumber()
      )
    )
      return;

    this.onClickStep();
    this.sleep(maxSpeed - this.state.programSpeed).then(this.runProgram);
  };

  maybeFinish = () => {
    if (this.state.state.completed)
      this.setState({
        started: false,
        isRunning: false,
      });
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
    this.setState({
      started: false,
      isRunning: false,
    });
  };
  onClickStep = () => {
    try {
      const instructionResult: Ok = engine.stepInstruction(this.state.state);
      this.setState(
        {
          state: instructionResult.state,
        },
        this.maybeFinish
      );
    } catch (err) {
      let msg = 'ram machine encountered unknown problem';
      if (err instanceof Error) msg = err.message;

      this.setState({
        started: false,
        isRunning: false,
        errorMessage: msg,
        errorOpen: true,
        errorType: 'Run Time Error',
        errorLine: this.state.state.nextInstruction.getLineNumber(),
      });
    }
  };
  onClickRun = () => {
    // if (this.state.started === false) this.loadProgram();

    this.setState(
      {
        started: true,
        isRunning: true,
      },
      this.runProgram
    );
  };
  onClickRunTillBreakpoint = () => {
    if (!this.state.started) this.loadProgram();

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
              <Row style={{height: '12%'}}>
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
                  Evaluation speed
                  <Slider
                    min={1}
                    max={maxSpeed}
                    stepSize={1}
                    labelValues={[]}
                    onChange={(value: number) => {
                      this.setState({
                        programSpeed: value,
                        sliderLabelRenderer: () =>
                          this.state.programSpeed.toString(),
                      });
                    }}
                    onRelease={() => {
                      this.setState({sliderLabelRenderer: () => ''});
                    }}
                    labelRenderer={this.state.sliderLabelRenderer}
                    value={this.state.programSpeed}
                    vertical={false}
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
                  <Editor
                    onClick={this.loadText}
                    curRow={this.state.state.nextInstruction.getLineNumber()}
                  />
                  <EditorAlert
                    isOpen={this.state.errorOpen}
                    message={this.state.errorMessage}
                    line={this.state.errorLine}
                    errorType={this.state.errorType}
                    handleClose={() => {
                      this.setState({errorOpen: false});
                    }}
                  ></EditorAlert>
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
