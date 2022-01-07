import React, {Component} from 'react';
import {InputGroup} from '@blueprintjs/core';

function OutputItem(props: {value: bigint | null; special: boolean}) {
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
    <div style={style}>
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
  outs: bigint[];
};
export class OutputTape extends Component<outputProps, {}> {
  render() {
    const outs = this.props.outs;
    const outsList = outs.map((out: bigint, index: number) => (
      <OutputItem key={index} value={out} special={false} />
    ));
    outsList.push(
      <OutputItem key={outsList.length} value={null} special={true} />
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
          const container = document.getElementById('inputTape')!;
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
