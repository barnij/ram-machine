import React, {Component} from 'react';
import {Engine, Interpreter, Ok, Parser, State} from 'ram-engine';

const engine = new Engine(new Parser(), new Interpreter());
const program = `
 write =5
 write =7
`;

type RamState = {
  state: State;
};

export class Ddd extends Component<{}, RamState> {
  state: RamState = {
    state: engine.makeStateFromString(program, []),
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

  render() {
    let button;
    if (!this.state.state.completed) {
      button = <button onClick={this.onClick}>Next</button>;
    } else {
      button = (
        <div>
          <button disabled>Koniec</button>
          <button onClick={this.onClickRestart}>Restart</button>
        </div>
      );
    }

    return (
      <div className="ddd-class">
        <p style={{marginBottom: 0}}>Program:</p>
        <pre>{program}</pre>
        <p>Output: [{this.state.state.environment.output.values.join(' ')}]</p>
        {button}
      </div>
    );
  }
}
