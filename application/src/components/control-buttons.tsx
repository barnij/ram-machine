import React, {Component} from 'react';
import {Button, ButtonGroup} from '@blueprintjs/core';
import './control-buttons.css';

interface IStopButtonProps {
  started: boolean;
  onClick: () => void;
}
function StopButton(props: IStopButtonProps) {
  if (props.started) {
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
  return (
    <Button
      title="Run till breakpoint"
      icon="circle-arrow-right"
      intent="success"
      onClick={props.onClickRunTillBreakpoint}
      disabled={props.running}
    />
  );
}

interface IStepButtonProps {
  started: boolean;
  running: boolean;
  onClickStep: () => void;
}
function StepButton(props: IStepButtonProps) {
  return (
    <Button
      title="Step forward"
      icon="step-forward"
      onClick={props.onClickStep}
      disabled={!props.started || props.running}
    />
  );
}

interface IUploadFileButtonProps {
  started: boolean;
  onClickUpload: () => void;
}
function UploadFileButton(props: IUploadFileButtonProps) {
  return (
    <Button
      title="Upload file"
      icon="upload"
      onClick={props.onClickUpload}
      disabled={props.started}
    />
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

interface IResetButtonProps {
  started: boolean;
  onClickReset: () => void;
}
function ResetButton(props: IResetButtonProps) {
  return (
    <Button
      title="Reset editor"
      icon="reset"
      onClick={props.onClickReset}
      disabled={props.started}
    />
  );
}

interface IControlButtonsProps {
  started: boolean;
  running: boolean;
  completed: boolean;
  onClickRun: () => void;
  onClickRunTillBreakpoint: () => void;
  onClickPause: () => void;
  onClickStop: () => void;
  onClickStep: () => void;
  onClickDownload: () => void;
  onClickUpload: () => void;
  onClickReset: () => void;
}

export class ControlButtons extends Component<IControlButtonsProps, {}> {
  render() {
    return (
      <div id="controlButtons">
        <ButtonGroup>
          <RunPauseButton
            running={this.props.running}
            onClickRun={this.props.onClickRun}
            onClickPause={this.props.onClickPause}
          />
          <StopButton
            started={this.props.started}
            onClick={this.props.onClickStop}
          />
          <RunTillBreakpointButton
            running={this.props.running}
            onClickRunTillBreakpoint={this.props.onClickRunTillBreakpoint}
          />
          <StepButton
            started={this.props.started}
            running={this.props.running}
            onClickStep={this.props.onClickStep}
          />
          <DownloadFileButton onClickDownload={this.props.onClickDownload} />
          <UploadFileButton
            started={this.props.started}
            onClickUpload={this.props.onClickUpload}
          />
          <ResetButton
            started={this.props.started}
            onClickReset={this.props.onClickReset}
          />
        </ButtonGroup>
      </div>
    );
  }
}
