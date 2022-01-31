import {Component} from 'react';
import {Alert, Intent} from '@blueprintjs/core';

export interface IAlertProps {
  isOpen: boolean;
  message: string;
  title: string;
  handleClose: () => void;
  alertType?: string;
}

export class EditorAlert extends Component<IAlertProps, {}> {
  errorAlert = () => {
    const errors = this.props.message.split('\n');
    const listItems = errors.map((error, id) => <li key={id}>{error}</li>);
    return (
      <Alert
        isOpen={this.props.isOpen}
        onClose={this.props.handleClose}
        onCancel={this.props.handleClose}
        icon="warning-sign"
        intent={Intent.DANGER}
        canEscapeKeyCancel={true}
        canOutsideClickCancel={true}
      >
        <p>
          <b>{this.props.title}</b>
        </p>
        <ul style={{listStyleType: 'none'}}>{listItems}</ul>
      </Alert>
    );
  };

  firefoxWarning = () => {
    return (
      <Alert
        isOpen={this.props.isOpen}
        onClose={this.props.handleClose}
        icon="desktop"
        intent={Intent.WARNING}
      >
        <p>
          <b>{this.props.title}</b>
        </p>
        <p>
          The Firefox browser has been detected. Please change the browser you
          are running Machine in to get maximum usage efficiency.
        </p>
      </Alert>
    );
  };

  render() {
    if (this.props.alertType && this.props.alertType === 'firefoxWarning')
      return this.firefoxWarning();
    return this.errorAlert();
  }
}
