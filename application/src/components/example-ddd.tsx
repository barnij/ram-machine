import React, {Component} from 'react';
import {State} from 'ram-engine';

type dddProps = {
  onClick: () => void;
  onClickRestart: () => void;
  state: State;
  program: string;
};
export class Ddd extends Component<dddProps, {}> {
  render() {
    let button;
    if (!this.props.state.completed) {
      button = <button onClick={this.props.onClick}>Next</button>;
    } else {
      button = (
        <div>
          <button disabled>Koniec</button>
          <button onClick={this.props.onClickRestart}>Restart</button>
        </div>
      );
    }

    return (
      <div className="ddd-class">
        <p>Output: [{this.props.state.environment.output.values.join(' ')}]</p>
        {button}
      </div>
    );
  }
}
