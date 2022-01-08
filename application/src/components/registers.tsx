import React from 'react';
import {Table} from 'react-bootstrap';
import {Element} from 'react-scroll';
import './registers.css';

const Row = (props: {reg: bigint; value: bigint | undefined}) => {
  let value = '?';
  if (typeof props.value !== 'undefined') value = props.value.toString();

  return (
    <tr key={props.reg.toString()}>
      <td>
        <Element name={'reg' + props.reg}>{props.reg.toString()}</Element>
      </td>
      <td id={'register' + props.reg}>{value}</td>
    </tr>
  );
};

const EmptyRow = () => (
  <tr>
    <td style={{textAlign: 'left'}} colSpan={2}>
      ...
    </td>
  </tr>
);

interface IRegisterProps {
  registers: Map<bigint, bigint>;
}

export function Registers(props: IRegisterProps) {
  const rows: JSX.Element[] = [];
  const sortedRegisters = [...props.registers.keys()].sort((a, b) =>
    Number(a - b)
  );
  const registers = new Set<bigint>([...Array(3).keys()].map(BigInt));
  for (const reg of sortedRegisters) registers.add(reg);

  let prev = -1n;
  for (const reg of registers) {
    if (reg - prev > 1n) rows.push(<EmptyRow key={rows.length} />);
    rows.push(
      <Row key={rows.length} reg={reg} value={props.registers.get(reg)} />
    );
    prev = reg;
  }

  return (
    <div
      id="registers"
      style={{overflowY: 'scroll', height: '500px'}}
      className="moz-scroller"
    >
      <Table bordered size="sm" variant="dark">
        <colgroup>
          <col span={1} style={{width: '50%'}}></col>
          <col span={1} style={{width: '50%'}}></col>
        </colgroup>
        <thead>
          <tr>
            <th>#</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </div>
  );
}
