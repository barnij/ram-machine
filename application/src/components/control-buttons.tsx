import React, {Component} from 'react';
import {Button, ButtonGroup} from '@blueprintjs/core';

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

interface IRunPauseButtonProps {
  running: boolean;
  onClickRun: () => void;
  onClickPause: () => void;
}
function RunPauseButton(props: IRunPauseButtonProps) {
  if (props.running) {
    return (
      <Button
        title="Pause execution"
        icon="pause"
        onClick={props.onClickPause}
      />
    );
  } else {
    return (
      <Button
        title="Run code"
        icon="play"
        intent="success"
        onClick={props.onClickRun}
      />
    );
  }
}

interface IRunTillBreakpointButton {
  running: boolean;
  onClickRunTillBreakpoint: () => void;
}
function RunTillBreakpointButton(props: IRunTillBreakpointButton) {
  if (props.running) {
    return (
      <Button
        title="Run till breakpoint"
        icon="circle-arrow-right"
        intent="success"
        onClick={props.onClickRunTillBreakpoint}
        disabled={true}
      />
    );
  } else {
    return (
      <Button
        title="Run till breakpoint"
        icon="circle-arrow-right"
        intent="success"
        onClick={props.onClickRunTillBreakpoint}
      />
    );
  }
}

interface IStepButtonProps {
  running: boolean;
  onClickStep: () => void;
}
function StepButton(props: IStepButtonProps) {
  if (props.running) {
    return (
      <Button
        title="Step forward"
        icon="step-forward"
        onClick={props.onClickStep}
        disabled={true}
      />
    );
  } else {
    return (
      <Button
        title="Step forward"
        icon="step-forward"
        onClick={props.onClickStep}
      />
    );
  }
}

interface IUploadFileButtonProps {
  onClickUpload: () => void;
}
function UploadFileButton(props: IUploadFileButtonProps) {
  return (
    <Button title="Upload file" icon="upload" onClick={props.onClickUpload} />
  );
}
interface IDownloadFileButtonProps {
  onClickDownload: () => void;
}
function DownloadFileButton(props: IDownloadFileButtonProps) {
  return (
    <Button
      title="Download file"
      icon="download"
      onClick={props.onClickDownload}
    />
  );
}
interface IControlButtonsProps {
  running: boolean;
  completed: boolean;
  onClickRun: () => void;
  onClickRunTillBreakpoint: () => void;
  onClickPause: () => void;
  onClickStop: () => void;
  onClickStep: () => void;
  onClickDownload: () => void;
  onClickUpload: () => void;
  // onClickDebug: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export class ControlButtons extends Component<IControlButtonsProps, {}> {
  render() {
    return (
      <div>
        <ButtonGroup>
          <RunPauseButton
            running={this.props.running}
            onClickRun={this.props.onClickRun}
            onClickPause={this.props.onClickPause}
          />
          <StopButton
            running={this.props.running}
            onClick={this.props.onClickStop}
          />
          <RunTillBreakpointButton
            running={this.props.running}
            onClickRunTillBreakpoint={this.props.onClickRunTillBreakpoint}
          />
          <StepButton
            running={this.props.running}
            onClickStep={this.props.onClickStep}
          />
          <DownloadFileButton onClickDownload={this.props.onClickDownload} />
          <UploadFileButton onClickUpload={this.props.onClickUpload} />
          {/* <DebugButton onClickDebug={() => this.onClickDebug} /> */}
        </ButtonGroup>
      </div>
    );
  }
}
