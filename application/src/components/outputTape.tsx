import React, {Component} from 'react';
import {InputGroup} from '@blueprintjs/core';

function OutputItem(props: {
  value: bigint | null;
  special: boolean;
  index: number;
}) {
  let out = '';
  // eslint-disable-next-line eqeqeq
  if (props.value != null) {
    out = props.value.toString();
  }

  const style: {
    margin: string;
    display: string;
    border?: string;
    borderRadius?: string;
  } = {
    margin: '10px',
    display: 'inline-block',
  };
  if (props.special) {
    style.border = 'inset green';
    style.borderRadius = '5px';
  }

  return (
    <div id={'output' + props.index} style={style}>
      <InputGroup
        style={{
          textAlign: 'center',
          color: 'white',
          backgroundColor: 'var(--gray1BP)',
        }}
        disabled={true}
        fill={false}
        value={out}
      />
    </div>
  );
}

type outputProps = {
  currentOutput: number;
  outs: bigint[];
};

interface IOutputTapeState {
  currectOutput: number;
}

export class OutputTape extends Component<outputProps, IOutputTapeState> {
  state: Readonly<IOutputTapeState> = {
    currectOutput: -1,
  };

  componentDidUpdate = () => {
    if (this.props.currentOutput !== this.state.currectOutput) {
      const container = document.getElementById('outputTape')!;
      const inputElement = document.getElementById(
        'output' + this.props.currentOutput
      )!;
      container.scrollTo({
        top: 0,
        left: inputElement.offsetLeft - container.offsetLeft,
        behavior: 'auto',
      });

      this.setState({currectOutput: this.props.currentOutput});
    }
  };

  render() {
    const outs = this.props.outs;
    const outsList = outs.map((out: bigint, index: number) => (
      <OutputItem key={index} index={index} value={out} special={false} />
    ));
    outsList.push(
      <OutputItem
        key={outsList.length}
        index={outsList.length}
        value={null}
        special={true}
      />
    );

    return (
      <div
        id="outputTape"
        style={{
          overflow: 'scroll hidden',
          whiteSpace: 'nowrap',
          width: '98%',
        }}
        className="moz-scroller"
        onWheel={e => {
          const container = document.getElementById('outputTape')!;
          const containerScrollPosition = container.scrollLeft;
          container.scrollTo({
            top: 0,
            left: containerScrollPosition + e.deltaY,
            behavior: 'auto',
          });
        }}
      >
        {outsList}
      </div>
    );
  }
}
