import React from 'react';
import {Table} from 'react-bootstrap';

const Row = () => (
  <tr>
    <td>x</td>
    <td>y</td>
  </tr>
);

interface IRegisterProps {
  number: number;
}

export function Registers(props: IRegisterProps) {
  const rows = [];
  for (let i = 0; i < props.number; i++) rows.push(<Row />);

  return (
    <Table>
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
