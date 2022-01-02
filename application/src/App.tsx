import React, {Component} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Col, Container, Row} from 'react-bootstrap';
import {Engine, Interpreter, Ok, Break, Parser, State} from 'ram-engine';
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
  errorLine: number;
  errorType: string;
  fileDownloadUrl: string | undefined;
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
    errorLine: 0,
    errorType: '',
    editorData: Matrix.createEmpty<CellBase<string>>(START_NUMBER_OF_ROWS, 4),
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
    if (!this.state.started) this.initState();

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
    if (!this.state.started) this.initState();

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
  onClickReset = () => {
    this.setState({
      editorData: Matrix.createEmpty<CellBase<string>>(START_NUMBER_OF_ROWS, 4),
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
  openFile(evt: React.ChangeEvent<HTMLInputElement>) {
    if (
      evt.target === null ||
      evt.target.files === null ||
      evt.target.files.length === 0
    )
      return;

    const fileObj = evt.target.files[0];
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
