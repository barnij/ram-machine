import React, {Component} from 'react';

function OutputItem(props: {value: bigint}) {
  return <li>{props.value.toString()}</li>;
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
    return <ul>{outsList}</ul>;
  }
}
