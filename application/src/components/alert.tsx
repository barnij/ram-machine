import {Component} from 'react';
import {Alert, Intent} from '@blueprintjs/core';

export interface IAlertProps {
  isOpen: boolean;
  message: string;
  line: number;
  errorType: string;
  handleClose: () => void;
}

export class EditorAlert extends Component<IAlertProps, {}> {
  render() {
    return (
      <Alert
        isOpen={this.props.isOpen}
        onClose={this.props.handleClose}
        onCancel={this.props.handleClose}
        icon="error"
        intent={Intent.DANGER}
        canEscapeKeyCancel={true}
        canOutsideClickCancel={true}
      >
        <p>
          <b>{this.props.errorType}</b>
        </p>
        <p>
          <b>line {this.props.line}:</b> {this.props.message}
        </p>
      </Alert>
    );
  }
}
