import React, {Component} from 'react';
import {Column, EditableCell, Table} from '@blueprintjs/table';

const cellRenderer = () => {
  return <EditableCell></EditableCell>;
};

const docWidth = (document.getElementById('editor')?.clientWidth || 1000) - 30; // row header is 30px

const colWidths = [0.2, 0.2, 0.2, 0.4];

export class Editor extends Component<{}, {}> {
  render() {
    return (
      <div className="editor-class" id="editor">
        <Table
          columnWidths={colWidths.map(c => c * docWidth)}
          enableFocusedCell={true}
          numRows={10}
        >
          <Column name="Label" cellRenderer={cellRenderer} />
          <Column name="Instruction" cellRenderer={cellRenderer} />
          <Column name="Argument" cellRenderer={cellRenderer} />
          <Column name="Comment" cellRenderer={cellRenderer} />
        </Table>
      </div>
    );
  }
}
