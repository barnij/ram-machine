import React from 'react';
import {Table} from 'react-bootstrap';

const Row = (props: {reg: bigint; value: bigint}) => (
  <tr>
    <td>{props.reg.toString()}</td>
    <td>{props.value.toString()}</td>
  </tr>
);

interface IRegisterProps {
  registers: Map<bigint, bigint>;
}

export function Registers(props: IRegisterProps) {
  const rows: JSX.Element[] = [];
  const sortedRegisters = [...props.registers.entries()].sort((a, b) =>
    Number((a[0] - b[0]).toString())
  );
  for (const [reg, val] of sortedRegisters) {
    //console.log({key, val});
    rows.push(<Row reg={reg} value={val} />);
  }

  return (
    <Table bordered size="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}
