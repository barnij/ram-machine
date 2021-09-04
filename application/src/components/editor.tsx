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
  selectedPoint: Point | null;
  editMode: boolean;
}

interface IEditorProps {
  onClick(program: string): void;
}
export class Editor extends Component<IEditorProps, IEditorState> {
  state: IEditorState = {
    data: createEmptyMatrix<CellBase<string>>(2, 4),
    selectedPoint: null,
    editMode: false,
  };

  addRow = () => {
    this.setState(prev => {
      if (!prev.selectedPoint) {
        return null;
      }
      const dataFirst = prev.data.slice(0, prev.selectedPoint.row + 1);
      const newData = createEmptyMatrix<CellBase<string>>(1, 4);
      const dataSecond = prev.data.slice(prev.selectedPoint.row + 1);
      return {
        data: dataFirst.concat(newData, dataSecond),
      };
    });
  };

  deleteRow = () => {
    this.setState(prev => {
      if (
        !prev.selectedPoint ||
        prev.selectedPoint.row === this.state.data.length - 1
      ) {
        return null;
      }
      const dataFirst = prev.data.slice(0, prev.selectedPoint.row);
      const dataSecond = prev.data.slice(prev.selectedPoint.row + 1);
      return {
        data: dataFirst.concat(dataSecond),
      };
    });
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
            if (
              event.key === 'Enter' &&
              !event.shiftKey &&
              !this.state.editMode
            ) {
              this.addRow();
            }
            if (event.key === 'Escape') {
              this.setState(() => ({
                selectedPoint: null,
              }));
            }
            if (event.key === 'Delete' && event.shiftKey) {
              this.deleteRow();
            }
          }}
          onActivate={(selected: Point) => {
            this.setState(() => ({selectedPoint: selected}));
          }}
          DataViewer={DataViewer1}
          onModeChange={(mode: Types.Mode) => {
            if (mode === 'edit') {
              this.setState(() => ({editMode: true}));
            } else {
              this.setState(() => ({editMode: false}));
            }
          }}
        />
        <button onClick={this.loadText}>Load program to machine</button>
      </div>
    );
  }
}
