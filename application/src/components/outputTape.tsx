import React, {Component} from 'react';
import {InputGroup} from '@blueprintjs/core';

function OutputItem(props: {value: bigint | null; special: boolean}) {
  let out = '';
  // eslint-disable-next-line eqeqeq
  if (props.value != null) {
    out = props.value.toString();
  }

  let style;
  if (props.special)
    style = {margin: '10px', display: 'inline-block', borderStyle: 'dotted'};
  else style = {margin: '10px', display: 'inline-block'};

  return (
    <div style={style}>
      <InputGroup
        style={{textAlign: 'center'}}
        disabled={true}
        fill={false}
        placeholder={out}
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
        style={{
          overflow: 'scroll hidden',
          whiteSpace: 'nowrap',
          width: '98%',
        }}
      >
        {outsList}
      </div>
    );
  }
}
