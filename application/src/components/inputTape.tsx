import React, {Component} from 'react';
import {InputGroup, Button} from '@blueprintjs/core';
import Scroll from 'react-scroll';

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

  const style: {
    margin: string;
    display: string;
    border?: string;
    borderRadius?: string;
  } = {
    margin: '10px',
    display: 'inline-block',
  };
  if (props.special && props.disabled) {
    style.border = 'inset green';
    style.borderRadius = '5px';
  }

  return (
    <div style={style}>
      <InputGroup
        style={{
          textAlign: 'center',
          backgroundColor: 'var(--gray1BP)',
          color: 'white',
        }}
        name={props.id.toString()}
        disabled={props.disabled}
        fill={false}
        value={input}
        rightElement={props.disabled ? undefined : removeButton}
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
        id="inputTape"
        style={{
          overflow: 'scroll hidden',
          whiteSpace: 'nowrap',
          width: '98%',
        }}
        className="moz-scroller"
        onWheel={e => {
          const container = document.getElementById('inputTape')!;
          const containerScrollPosition = container.scrollLeft;
          container.scrollTo({
            top: 0,
            left: containerScrollPosition + e.deltaY,
            behavior: 'auto',
          });
        }}
      >
        {inputsList}
        {!this.props.disabled && (
          <div style={{margin: '10px', display: 'inline-block'}}>
            <Button
              rightIcon="plus"
              intent="success"
              text=""
              disabled={this.props.disabled}
              onClick={() => {
                this.props.inputAdd();
                Scroll.animateScroll.scrollMore(500, {
                  containerId: 'inputTape',
                  horizontal: true,
                  delay: 0,
                  duration: 0,
                });
              }}
            />
          </div>
        )}
      </div>
    );
  }
}
