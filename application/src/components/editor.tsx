import React, {Component} from 'react';
import {Cell, Column, Table2} from '@blueprintjs/table';

const cellRenderer = () => {
  return <Cell></Cell>;
};

const docWidth = (document.getElementById('editor')?.clientWidth || 1000) - 30; // row header is 30px

const colWidths = [0.2, 0.2, 0.2, 0.4];

export class Editor extends Component<{}, {}> {
  render() {
    return (
      <div className="editor-class" id="editor">
        <Table2 numRows={10} columnWidths={colWidths.map(c => c * docWidth)}>
          <Column name="Label" cellRenderer={cellRenderer} />
          <Column name="Instruction" cellRenderer={cellRenderer} />
          <Column name="Argument" cellRenderer={cellRenderer} />
          <Column name="Comment" cellRenderer={cellRenderer} />
        </Table2>
      </div>
    );
  }
}
