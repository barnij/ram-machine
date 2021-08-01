import React, {Component} from 'react';
import {Column, EditableCell, Table} from '@blueprintjs/table';

const docWidth = () =>
  (document.getElementById('editor')?.clientWidth || 1000) - 30; // row header is 30px

const colWidths = [0.2, 0.2, 0.2, 0.4];

type IEditor = {
  widths: number[];
};
export class Editor extends Component<{}, IEditor> {
  state: IEditor = {
    widths: colWidths.map(c => c * 100),
  };

  cellRenderer = () => {
    return <EditableCell></EditableCell>;
  };

  componentDidMount() {
    this.setState(() => ({
      widths: colWidths.map(c => docWidth() * c),
    }));
  }

  render() {
    return (
      <div className="editor-class" id="editor">
        <Table columnWidths={this.state.widths} enableFocusedCell numRows={10}>
          <Column name="Label" cellRenderer={this.cellRenderer} />
          <Column name="Instruction" cellRenderer={this.cellRenderer} />
          <Column name="Argument" cellRenderer={this.cellRenderer} />
          <Column name="Comment" cellRenderer={this.cellRenderer} />
        </Table>
      </div>
    );
  }
}
