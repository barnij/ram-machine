import {Component} from 'react';
import {Alert, Intent} from '@blueprintjs/core';

export interface IAlertProps {
  isOpen: boolean;
  message: string;
  errorType: string;
  handleClose: () => void;
}

export class EditorAlert extends Component<IAlertProps, {}> {
  render() {
    const errors = this.props.message.split('\n');
    const listItems = errors.map((error, id) => <li key={id}>{error}</li>);
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
        <ul style={{listStyleType: 'none'}}>{listItems}</ul>
      </Alert>
    );
  }
}
