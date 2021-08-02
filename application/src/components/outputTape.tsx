import React, {Component} from 'react';
import {InputGroup} from '@blueprintjs/core';

function OutputItem(props: {value: bigint | null}) {
  let out = '';
  // eslint-disable-next-line eqeqeq
  if (props.value != null) {
    out = props.value.toString();
  }
  return (
    <div style={{margin: '10px', display: 'inline-block'}}>
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
      <OutputItem key={index} value={out} />
    ));
    outsList.push(<OutputItem key={outsList.length} value={null} />);
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
