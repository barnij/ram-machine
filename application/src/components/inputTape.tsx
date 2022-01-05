import React, {Component} from 'react';
import {InputGroup, Button} from '@blueprintjs/core';

function InputItem(props: {
  value: string;
  id: number;
  disabled: boolean;
  special: boolean;
  inputRemove: (
    id: number
  ) => (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const input = props.value;
  const removeButton = (
    <Button
      rightIcon="minus"
      intent="warning"
      text=""
      disabled={props.disabled}
      onClick={props.inputRemove(props.id)}
    />
  );

  let style;
  if (props.special)
    style = {margin: '10px', display: 'inline-block', borderStyle: 'dotted'};
  else style = {margin: '10px', display: 'inline-block'};

  return (
    <div style={style}>
      <InputGroup
        style={{textAlign: 'center'}}
        name={props.id.toString()}
        disabled={props.disabled}
        fill={false}
        value={input}
        rightElement={removeButton}
        onChange={props.onChange}
      />
    </div>
  );
}

type inputProps = {
  inputs: string[];
  disabled: boolean;
  currentInput: number;
  inputAdd: () => void;
  inputRemove: (
    id: number
  ) => (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
export class InputTape extends Component<inputProps, {}> {
  render() {
    const inputs = this.props.inputs;
    const inputsList = inputs.map((input: string, index: number) => (
      <InputItem
        key={index}
        value={input}
        id={index}
        disabled={this.props.disabled}
        special={this.props.currentInput === index}
        inputRemove={this.props.inputRemove}
        onChange={this.props.onChange}
      />
    ));
    return (
      <div
        style={{
          overflow: 'scroll hidden',
          whiteSpace: 'nowrap',
          width: '98%',
        }}
      >
        {inputsList}
        <div style={{margin: '10px', display: 'inline-block'}}>
          <Button
            rightIcon="plus"
            intent="success"
            text=""
            disabled={this.props.disabled}
            onClick={this.props.inputAdd}
          />
        </div>
      </div>
    );
  }
}
