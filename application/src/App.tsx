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
  Combine,
  Skip,
} from 'ram-engine';
import {OutputTape} from './components/outputTape';
import {InputTape} from './components/inputTape';
import {Processor} from './components/processor';
import {Editor, parseMatrix} from './components/editor';
import {ControlButtons} from './components/control-buttons';
import {EditorAlert} from './components/alert';
import {Registers} from './components/registers';
import {Checkbox, Slider} from '@blueprintjs/core';
import {Matrix, CellBase} from '@barnij/react-spreadsheet';
import {animateScroll, scroller} from 'react-scroll';

const engine = new Engine(new Parser(), new Interpreter());

const defaultSpeed = 1;
const maxSpeed = 3000;

function isNextInstSkip(state: State): boolean {
  console.log(state.nextInstruction);
  return (
    state.nextInstruction instanceof Skip ||
    (state.nextInstruction instanceof Combine &&
      state.nextInstruction.instruction instanceof Skip)
  );
}

interface IState {
  state: State;
  inputs: string[];
  isRunning: boolean;
  started: boolean;
  paused: boolean;
  skipAnimations: boolean;
  breakpoints: Set<number>;
  programSpeed: number;
  currentInput: number;
  currentOutput: number;
  errorOpen: boolean;
  errorMessage: string;
  errorType: string;
  fileDownloadUrl: string | undefined;
  redRows: Map<number, number>;
  prevInstruction: number;
  editorData: Matrix.Matrix<CellBase<string>>;
  editorRange: [number, number];
  sliderLabelRenderer: () => string;
}

const START_NUMBER_OF_ROWS = 2;

class App extends Component<{}, IState> {
  state: IState = {
    state: engine.makeStateFromString('', []),
    inputs: [''],
    isRunning: false,
    started: false,
    paused: false,
    skipAnimations: false,
    breakpoints: new Set(),
    programSpeed: defaultSpeed,
    currentInput: 0,
    currentOutput: 0,
    errorOpen: false,
    errorMessage: '',
    errorType: '',
    redRows: new Map(),
    prevInstruction: -1,
    editorData: Matrix.createEmpty<CellBase<string>>(START_NUMBER_OF_ROWS, 4),
    editorRange: [0, 0],
    fileDownloadUrl: undefined,
    sliderLabelRenderer: () => '',
  };

  dofileDownload: HTMLAnchorElement | null = null;
  dofileUpload: HTMLInputElement | null = null;

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
      ({editorData}) => {
        const newData = editorData.slice(0);
        newData.splice(row + 1, 0, []);

        return {
          editorData: newData,
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

  scrollInEditor = (row: number) => {
    this.setState(
      ({editorRange}) => {
        if (row < editorRange[0]) {
          return {editorRange: [row, editorRange[1] - editorRange[0] + row]};
        } else if (row > editorRange[1]) {
          return {
            editorRange: [row - editorRange[1] + editorRange[0] + 2, row + 2],
          };
        }
        return null;
      },
      () => {
        animateScroll.scrollTo(this.state.editorRange[0] * 34, {
          containerId: 'editor',
          delay: 0,
          duration: 10,
        });
      }
    );
  };

  scrollInRegisters = (nr: bigint | undefined) => {
    if (typeof nr !== 'undefined') {
      scroller.scrollTo('reg' + nr, {containerId: 'registers'});
      this.highlightRegister(nr);
    }
  };

  highlightRegister = (reg: bigint) => {
    const register = document.getElementById('register' + reg)!;
    register.classList.add('highlight');
    setTimeout(() => {
      register.classList.remove('highlight');
    }, 600);
  };

  paintRow = (row: number) => {
    this.setState(({redRows, prevInstruction}) => {
      if (prevInstruction !== -1) {
        const r = new Map(redRows);
        const curRed = r.get(prevInstruction);
        const newRed = 0.05 + (curRed ?? 0);
        r.set(prevInstruction, newRed);
        return {redRows: r, prevInstruction: row};
      }
      return {redRows, prevInstruction: row};
    });
  };

  paintRowWithState = (state: State) => {
    if (isNextInstSkip(state)) return this.paintRow(-1);
    return this.paintRow(state.nextInstruction.getLineNumber());
  };

  resetRedRows = () => {
    if (this.state.redRows.size > 0) this.setState({redRows: new Map()});
  };

  initState = () => {
    try {
      const newState: State = engine.makeStateFromString(
        parseMatrix(this.state.editorData),
        this.state.inputs.map<bigint | null>(x => {
          if (x.match(/^\s*$/)) return null;
          return BigInt(x);
        })
      );

      engine.updateBreakpoints(newState, this.state.breakpoints);

      this.setState({
        state: newState,
        redRows: new Map(),
        prevInstruction: isNextInstSkip(newState)
          ? -1
          : newState.nextInstruction.getLineNumber(),
        currentInput: 0,
        currentOutput: 0,
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
        paused: true,
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
    try {
      if (this.state.skipAnimations) {
        engine.complete(this.state.state);
        this.setState(
          {
            started: this.state.started && !this.state.state.completed,
            paused: this.state.paused && !this.state.state.completed,
            isRunning: this.state.isRunning && !this.state.state.completed,
          },
          this.maybeFinish
        );
      } else {
        if (this.state.state.completed || this.state.paused) return;

        this.onClickStep(true);

        this.sleep(maxSpeed - this.state.programSpeed).then(this.runProgram);
      }
    } catch (err) {
      let msg = 'ram machine encountered unknown problem';
      if (err instanceof InterpreterError) {
        msg = 'line ' + (err.line + 1) + ': ';
        if (err instanceof InputError)
          msg += err.message + ' ' + err.inputId + '\n';
        else if (err instanceof RegisterError)
          msg += err.message + ' ' + err.regId + '\n';
        else msg += err.message;
      }

      this.setState({
        started: false,
        isRunning: false,
        paused: true,
        errorMessage: msg,
        errorOpen: true,
        errorType: 'Runtime Error',
      });
    }
  };

  runProgramTillBP = () => {
    if (
      this.state.state.completed ||
      !this.state.isRunning ||
      this.state.paused
    )
      return;
    try {
      if (this.state.skipAnimations) {
        engine.completeTillBreak(this.state.state);
        this.setState(
          {
            started: this.state.started && !this.state.state.completed,
            paused: this.state.paused && !this.state.state.completed,
            isRunning: false,
          },
          this.maybeFinish
        );
      } else {
        this.onClickStep();
        this.sleep(maxSpeed - this.state.programSpeed).then(
          this.runProgramTillBP
        );
      }
    } catch (err) {
      let msg = 'ram machine encountered unknown problem';
      if (err instanceof InterpreterError) {
        msg = 'line ' + (err.line + 1) + ': ';
        if (err instanceof InputError)
          msg += err.message + ' ' + err.inputId + '\n';
        else if (err instanceof RegisterError)
          msg += err.message + ' ' + err.regId + '\n';
        else msg += err.message;
      }

      this.setState({
        started: false,
        isRunning: false,
        paused: true,
        errorMessage: msg,
        errorOpen: true,
        errorType: 'Runtime Error',
      });
    }
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
      paused: true,
    });
  };

  onClickStep = (noBreak = false) => {
    try {
      let instructionResult: Ok | Break;
      do {
        instructionResult = engine.stepInstruction(this.state.state);
      } while (noBreak && isNextInstSkip(this.state.state));

      const nextInput = this.state.state.environment.input.nextInput();
      const nextOutput = this.state.state.environment.output.nextOutput();
      if (instructionResult instanceof Break)
        this.setState(
          prev => {
            return {
              started: prev.started && !this.state.state.completed,
              paused: prev.paused && !this.state.state.completed,
              isRunning: false,
              currentInput: nextInput,
              currentOutput: nextOutput,
            };
          },
          () => {
            this.maybeFinish;
            this.scrollInEditor(
              this.state.state.nextInstruction.getLineNumber()
            );
            this.scrollInRegisters(instructionResult.modifiedRegister);
            this.paintRowWithState(this.state.state);
          }
        );
      else
        this.setState(
          prev => {
            return {
              started: prev.started && !this.state.state.completed,
              paused: prev.paused && !this.state.state.completed,
              isRunning: prev.isRunning && !this.state.state.completed,
              currentInput: nextInput,
              currentOutput: nextOutput,
            };
          },
          () => {
            this.maybeFinish;
            this.scrollInEditor(
              this.state.state.nextInstruction.getLineNumber()
            );
            this.scrollInRegisters(instructionResult.modifiedRegister);
            this.paintRowWithState(this.state.state);
          }
        );
    } catch (err) {
      let msg = 'ram machine encountered unknown problem';
      if (err instanceof InterpreterError) {
        msg = 'line ' + (err.line + 1) + ': ';
        if (err instanceof InputError)
          msg += err.message + ' ' + err.inputId + '\n';
        else if (err instanceof RegisterError)
          msg += err.message + ' ' + err.regId + '\n';
        else msg += err.message;
      }

      this.setState({
        started: false,
        isRunning: false,
        paused: true,
        errorMessage: msg,
        errorOpen: true,
        errorType: 'Runtime Error',
      });
    }
  };

  onClickRun = () => {
    if (!this.state.started && !this.initState()) return;

    this.setState(
      {
        started: true,
        isRunning: true,
        paused: false,
      },
      () => {
        if (isNextInstSkip(this.state.state) || this.state.skipAnimations)
          this.runProgram();
        else {
          this.sleep(maxSpeed - this.state.programSpeed).then(this.runProgram);
        }
      }
    );
  };

  onClickRunTillBreakpoint = () => {
    if (!this.state.started && !this.initState()) return;

    this.setState(
      {
        started: true,
        isRunning: true,
        paused: false,
      },
      () => {
        if (isNextInstSkip(this.state.state) || this.state.skipAnimations)
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
      paused: true,
    }));
  };

  onClickReset = () => {
    if (confirm('Are you sure to reset editor? Your code will be deleted.'))
      this.setState({
        editorData: Matrix.createEmpty<CellBase<string>>(
          START_NUMBER_OF_ROWS,
          4
        ),
      });
  };

  onClickDownload = () => {
    const output = parseMatrix(this.state.editorData);
    const blob = new Blob([output]);
    const fileDownloadUrl = URL.createObjectURL(blob);
    this.setState({fileDownloadUrl: fileDownloadUrl}, () => {
      if (this.dofileDownload !== null) this.dofileDownload.click();
      URL.revokeObjectURL(fileDownloadUrl); // free up storage--no longer needed.
      this.setState({fileDownloadUrl: ''});
    });
  };

  onClickUpload = () => {
    if (this.dofileUpload !== null) this.dofileUpload.click();
  };

  openFile(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();

    if (
      event.target === null ||
      event.target.files === null ||
      event.target.files.length === 0
    )
      return;

    const fileObj = event.target.files[0];
    const reader = new FileReader();

    let fileloaded = () => {
      const fileContents = reader.result;
      if (fileContents === null || fileContents instanceof ArrayBuffer) return;
      this.loadFile(fileContents);
    };

    fileloaded = fileloaded.bind(this);
    reader.onload = fileloaded;
    reader.readAsText(fileObj);

    if (this.dofileUpload !== null) this.dofileUpload.value = '';
  }

  loadFile = (text: string) => {
    const lines = text.split(/\r\n|\n\r|\n|\r/);
    const newData = Matrix.createEmpty<CellBase<string>>(
      Math.max(lines.length, START_NUMBER_OF_ROWS),
      4
    );
    for (let i = 0; i < lines.length; i++) {
      const line = {label: '', instruction: '', argument: '', comment: ''};
      const commentlessString = lines[i].split('#')[0];
      line.comment = lines[i].substring(commentlessString.length + 1);

      const labelEndIndex = commentlessString.indexOf(':');
      let instructionString = commentlessString.trim();

      if (labelEndIndex > 0) {
        const labelString = commentlessString.slice(0, labelEndIndex);
        line.label = labelString;
        instructionString = commentlessString.slice(labelEndIndex + 1).trim();
      }

      const EMPTY_LINE = /^\s*$/;
      const WHITESPACE = /\s+/;
      if (!instructionString.match(EMPTY_LINE)) {
        const [instruction, ...argument] = instructionString.split(WHITESPACE);
        line.instruction = instruction;
        if (argument.length > 0) line.argument = argument[0];
      }

      Matrix.mutableSet({row: i, column: 0}, {value: line.label}, newData);
      Matrix.mutableSet(
        {row: i, column: 1},
        {value: line.instruction},
        newData
      );
      Matrix.mutableSet({row: i, column: 2}, {value: line.argument}, newData);
      Matrix.mutableSet({row: i, column: 3}, {value: line.comment}, newData);
    }

    this.updateEditor(newData);
  };

  handleSkipAnimations = () => {
    if (
      !this.state.skipAnimations &&
      !confirm(
        'In this mode programs with infinite loops may crush ram machine. Are You sure to turn it on?'
      )
    )
      return;
    this.setState({
      skipAnimations: !this.state.skipAnimations,
    });
  };

  saveCode = (ev: Event) => {
    ev.preventDefault();
    localStorage.setItem('savedCode', parseMatrix(this.state.editorData));
  };

  restoreCode = () => {
    const savedCode = localStorage.getItem('savedCode');
    if (savedCode) this.loadFile(savedCode);
  };

  componentDidMount = () => {
    const heightOfWrapper = document.getElementById(
      'spreadsheet_wrapper'
    )?.clientHeight;

    const paddingBottomOfWrapper = 2 * 5; //5px

    const h =
      (heightOfWrapper ?? paddingBottomOfWrapper) - paddingBottomOfWrapper;

    const edi = document.getElementById('editor')!;
    if (edi !== null && edi?.style) edi.style.height = h + 'px';

    const heightOfEditorRow = 34;
    const nrOfRows = Math.floor(h / heightOfEditorRow);

    this.setState({editorRange: [0, nrOfRows - 1]});

    this.restoreCode();
    window.addEventListener('beforeunload', this.saveCode);
  };

  componentWillUnmount = () => {
    window.removeEventListener('beforeunload', this.saveCode);
  };

  render() {
    return (
      <div className="App bp3-dark">
        <Container fluid>
          <Row style={{height: '100vh'}}>
            <Col sm={3} id="controlColumn">
              <Row id="title">RAM MACHINE</Row>
              <Row style={{height: '13%'}} id="controlRow">
                <Col>
                  <Row id="controlButtonsRow">
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
                      onClickReset={this.onClickReset}
                    />
                    <a
                      style={{display: 'none'}}
                      download={'ramcode.ram'}
                      href={this.state.fileDownloadUrl}
                      ref={e => (this.dofileDownload = e)}
                    >
                      download it
                    </a>
                    <input
                      type="file"
                      style={{display: 'none'}}
                      multiple={false}
                      accept=".ram,.RAMCode"
                      onChange={evt => this.openFile(evt)}
                      ref={e => (this.dofileUpload = e)}
                    />
                  </Row>
                  <Row className="ps-2 pe-1 pt-2 d-flex align-items-center justify-content-center">
                    <Col>
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
                              Math.round(
                                (this.state.programSpeed / maxSpeed) * 100
                              ) + '%',
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
                    <Col>
                      <Checkbox
                        onChange={this.handleSkipAnimations}
                        label="skip animations"
                        checked={this.state.skipAnimations}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row style={{height: '15%'}}>
                <Col>
                  <Row
                    style={{height: '20%'}}
                    className="d-flex align-items-center justify-content-center"
                    id="processorName"
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
              <Row style={{height: '72%'}}>
                <Col>
                  <Registers
                    registers={this.state.state.environment.registers}
                  />
                </Col>
              </Row>
            </Col>
            <Col sm={9} id="codeColumn">
              <Row style={{height: '8%'}}>
                <Col>
                  <InputTape
                    inputs={this.state.inputs}
                    disabled={this.state.started}
                    inputAdd={this.inputAdd}
                    inputRemove={this.inputRemove}
                    onChange={this.handleInputChange}
                    currentInput={this.state.currentInput}
                  />
                </Col>
              </Row>
              <Row style={{height: '84%'}}>
                <Col
                  id="spreadsheet_wrapper"
                  style={{
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
                    redRows={this.state.redRows}
                    breakpoints={this.state.breakpoints}
                    resetRedRows={this.resetRedRows}
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
              <Row style={{height: '8%'}}>
                <Col>
                  <OutputTape
                    currentOutput={this.state.currentOutput}
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
