import React, {Component, ReactElement} from 'react';
import {Button, ButtonGroup} from '@blueprintjs/core';

import '@blueprintjs/core/lib/css/blueprint.css';

interface IStopButtonProps {
  running: boolean;
  onClick: () => void;
}
function StopButton(props: IStopButtonProps) {
  if (props.running) {
    return <Button icon="stop" onClick={props.onClick} intent="danger" />;
  } else {
    return <Button icon="stop" intent="danger" disabled={true} />;
  }
}
function PlayPauseButton(props: {
  running: boolean;
  complete: boolean;
  onClickPlay: VoidFunction;
  onClickPause: VoidFunction;
}) {
  let playPauseButton: ReactElement;
  if (props.running) {
    playPauseButton = <Button icon="pause" onClick={props.onClickPause} />;
  } else {
    playPauseButton = (
      <Button icon="play" intent="success" onClick={props.onClickPlay} />
    );
  }
  return playPauseButton;
}
function StepButton(props: {onClickStep: VoidFunction}) {
  return <Button icon="step-forward" onClick={props.onClickStep} />;
}
function DebugButton(props: {onClickDebug: VoidFunction}) {
  return <Button onClick={props.onClickDebug} />;
}
interface IControlButtonsProps {
  running: boolean;
  completed: boolean;
  // onClickPlay: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  // onClickPause: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onClickStop: () => void;
  // onClickStep: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  // onClickDebug: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export class ControlButtons extends Component<IControlButtonsProps, {}> {
  render() {
    return (
      <div>
        <ButtonGroup>
          {/* <PlayPauseButton
            running={this.state.running}
            complete={this.state.complete}
            onClickPlay={() => this.onClickPlay()}
            onClickPause={() => this.onClickPause()}
          /> */}
          <StopButton
            running={this.props.running}
            onClick={this.props.onClickStop}
          />
          {/* <StepButton onClickStep={() => this.onClickStep()} /> */}
          {/* <DebugButton onClickDebug={() => this.onClickDebug} /> */}
        </ButtonGroup>
      </div>
    );
  }
}
