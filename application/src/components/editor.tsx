import React, {Component} from 'react';
import {
  Point,
  CellBase,
  createEmptyMatrix,
  Spreadsheet,
  Matrix,
} from 'react-spreadsheet';
import type Types from 'react-spreadsheet/dist/types';
import './editor.css';

const rowCornerInd = () => (
  <th className="Spreadsheet__header row_corner_indicator"></th>
);

const DataViewer1 = (dataViewerProps: Types.DataViewerProps<CellBase>) => {
  return (
    <span className="Spreadsheet__data-viewer">
      {dataViewerProps.cell?.value}
    </span>
  );
};
interface IEditorState {
  data: Matrix<CellBase<string>>;
  selectedLastRow: boolean;
}

interface IEditorProps {
  onClick(program: string): void;
}
export class Editor extends Component<IEditorProps, IEditorState> {
  state: IEditorState = {
    data: createEmptyMatrix(2, 4),
    selectedLastRow: false,
  };

  pressedEnter = () => {
    this.setState(prev => ({
      data: prev.data.concat(createEmptyMatrix(1, 4)),
    }));
  };
  loadText = () => {
    let text = '';
    for (const row of this.state.data) {
      const label = row[0]?.value;
      const instruction = row[1]?.value;
      const argument = row[2]?.value;
      const comment = row[3]?.value;

      if (label) {
        text += label + ': ';
      }

      if (instruction) {
        text += instruction + ' ';
      }

      if (argument) {
        text += argument + ' ';
      }

      if (comment) {
        text += ' #' + comment;
      }

      if (label || instruction || argument || comment) {
        text += '\n';
      }
    }
    console.log(text);
    this.props.onClick(text);
  };
  render() {
    return (
      <div style={{width: '100%'}} className="editor_class">
        <Spreadsheet
          data={this.state.data}
          columnLabels={['Label', 'Instruction', 'Argument', 'Comment']}
          RowIndicator={rowCornerInd}
          CornerIndicator={rowCornerInd}
          onChange={data => this.setState(() => ({data: data}))}
          onKeyDown={event => {
            if (event.key === 'Enter' && this.state.selectedLastRow) {
              this.pressedEnter();
            }
          }}
          onSelect={(selected: Point[]) => {
            if (selected[0].row === this.state.data.length - 1) {
              this.setState(() => ({selectedLastRow: true}));
            } else {
              this.setState(() => ({selectedLastRow: false}));
            }
          }}
          DataViewer={DataViewer1}
        />
        <button onClick={this.loadText}>Load program to machine</button>
      </div>
    );
  }
}
