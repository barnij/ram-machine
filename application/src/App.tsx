import React, {Component} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Col, Container, Row} from 'react-bootstrap';
import {
  Engine,
  Interpreter,
  Ok,
  Break,
  Parser,
  State,
  ParserError,
  ParserGeneralError,
  InterpreterError,
  RegisterError,
  InputError,
} from 'ram-engine';
import {OutputTape} from './components/outputTape';
import {InputTape} from './components/inputTape';
import {Processor} from './components/processor';
import {Editor, parseMatrix} from './components/editor';
import {ControlButtons} from './components/control-buttons';
import {EditorAlert} from './components/alert';
import {Slider} from '@blueprintjs/core';
import {Matrix, CellBase} from '@barnij/react-spreadsheet';

const engine = new Engine(new Parser(), new Interpreter());

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
  errorType: string;
  editorData: Matrix.Matrix<CellBase<string>>;
  sliderLabelRenderer: () => string;
}

const START_NUMBER_OF_ROWS = 2;

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
    errorType: '',
    editorData: Matrix.createEmpty<CellBase<string>>(START_NUMBER_OF_ROWS, 4),
    sliderLabelRenderer: () => '',
  };

  updateBpAfterAddRow = (row: number) => {
    this.setState(({breakpoints}) => {
      const ns = new Set<number>();
      breakpoints.forEach(val => {
        if (val <= row) ns.add(val);
        else ns.add(val + 1);
      });
      return {breakpoints: ns};
    });
  };

  updateBpAfterDeleteRow = (row: number) => {
    this.setState(({breakpoints}) => {
      const ns = new Set<number>();
      breakpoints.forEach(val => {
        if (val <= row) ns.add(val);
        else if (val > 0) ns.add(val - 1);
      });
      return {breakpoints: ns};
    });
  };

  addRowInEditor = (row: number) => {
    this.setState(
      prev => {
        const dataFirst = prev.editorData.slice(0, row + 1);
        const newData = Matrix.createEmpty<CellBase<string>>(1, 4);
        const dataSecond = prev.editorData.slice(row + 1);

        return {
          editorData: dataFirst.concat(newData, dataSecond),
        };
      },
      () => this.updateBpAfterAddRow(row)
    );
  };

  deleteRowInEditor = (row: number) => {
    this.setState(
      prev => {
        const dataFirst = prev.editorData.slice(0, row);
        const dataSecond = prev.editorData.slice(row + 1);
        return {
          editorData: dataFirst.concat(dataSecond),
        };
      },
      () => this.updateBpAfterDeleteRow(row - 1)
    );
  };

  updateEditor = (data: Matrix.Matrix<CellBase<string>>) => {
    this.setState({
      editorData: data,
    });
  };

  toggleBreakpoint = (rowNumber: number) => {
    this.setState(
      ({breakpoints}) => {
        if (!breakpoints.has(rowNumber))
          return {breakpoints: new Set(breakpoints).add(rowNumber)};

        const newBreakpoints = new Set(breakpoints);
        newBreakpoints.delete(rowNumber);
        return {
          breakpoints: newBreakpoints,
        };
      },
      () => {
        engine.updateBreakpoints(this.state.state, this.state.breakpoints);
      }
    );
  };

  initState = () => {
    try {
      const newState: State = engine.makeStateFromString(
        parseMatrix(this.state.editorData),
        this.state.inputs.map<bigint>(x => {
          return BigInt(x);
        })
      );

      engine.updateBreakpoints(newState, this.state.breakpoints);

      this.setState({
        state: newState,
      });

      return true;
    } catch (err) {
      let msg = 'ram machine encountered unknown problem';
      if (err instanceof ParserGeneralError) {
        msg = '';
        err.errors.forEach((error: ParserError, line: number) => {
          msg += 'line ' + (line + 1) + ': ';
          msg += error.message + '\n';
        });
      } else if (err instanceof ParserError)
        msg = 'line ' + (err.line + 1) + ': ' + err.message;
      else if (err instanceof Error) msg = err.message;

      this.setState({
        started: false,
        isRunning: false,
        errorMessage: msg,
        errorOpen: true,
        errorType: 'Parser Error',
      });

      return false;
    }
  };

  sleep = (milliseconds: number) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };

  runProgram = () => {
    if (this.state.programSpeed === maxSpeed) {
      engine.complete(this.state.state);
      this.forceUpdate(this.maybeFinish);
    } else {
      if (this.state.state.completed || !this.state.isRunning) return;

      this.onClickStep();
      this.sleep(maxSpeed - this.state.programSpeed).then(this.runProgram);
    }
  };

  runProgramTillBP = () => {
    if (this.state.state.completed || !this.state.isRunning) return;

    if (this.state.programSpeed === maxSpeed) {
      engine.completeTillBreak(this.state.state);
      this.setState({isRunning: false});
      this.forceUpdate(this.maybeFinish);
      return;
    }

    this.onClickStep();
    this.sleep(maxSpeed - this.state.programSpeed).then(this.runProgramTillBP);
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
      const instructionResult: Ok | Break = engine.stepInstruction(
        this.state.state
      );
      if (instructionResult instanceof Break)
        this.setState({isRunning: false}, this.maybeFinish);
      else this.forceUpdate(this.maybeFinish);
    } catch (err) {
      let msg = 'ram machine encountered unknown problem';
      if (err instanceof InterpreterError) {
        msg = 'line ' + (err.line + 1) + ': ';
        if (err instanceof RegisterError) {
          msg += err.message + '\n';
          msg += '    register nr ' + err.regId;
        } else if (err instanceof InputError) {
          msg += err.message + '\n';
          msg += '    input nr ' + err.inputId;
        } else {
          msg += err.message;
        }
      }

      this.setState({
        started: false,
        isRunning: false,
        errorMessage: msg,
        errorOpen: true,
        errorType: 'Runtime Error',
      });
    }
  };
  onClickRun = () => {
    if (!this.state.started) if (!this.initState()) return;

    this.setState(
      {
        started: true,
        isRunning: true,
      },
      () => {
        if (this.state.state.nextInstruction.prettyPrint().name === '')
          this.runProgram();
        else
          this.sleep(maxSpeed - this.state.programSpeed).then(this.runProgram);
      }
    );
  };
  onClickRunTillBreakpoint = () => {
    if (!this.state.started) if (!this.initState()) return;

    this.setState(
      {
        started: true,
        isRunning: true,
      },
      () => {
        if (this.state.state.nextInstruction.prettyPrint().name === '')
          this.runProgramTillBP();
        else
          this.sleep(maxSpeed - this.state.programSpeed).then(
            this.runProgramTillBP
          );
      }
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
                    disabled={this.state.started}
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
                    data={this.state.editorData}
                    started={this.state.started}
                    handleAddRow={this.addRowInEditor}
                    handleDeleteRow={this.deleteRowInEditor}
                    handleUpdateEditor={this.updateEditor}
                    toggleBreakpoint={this.toggleBreakpoint}
                    breakpoints={this.state.breakpoints}
                    curRow={this.state.state.nextInstruction.getLineNumber()}
                  />
                  <EditorAlert
                    isOpen={this.state.errorOpen}
                    message={this.state.errorMessage}
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
