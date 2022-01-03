import React, {Component} from 'react';
import {
  Point,
  CellBase,
  Spreadsheet,
  Matrix,
  Mode,
} from '@barnij/react-spreadsheet';
import {Icon, Intent} from '@blueprintjs/core';
import './editor.css';

type RowIndicatorProps = {
  row: number;
  label?: React.ReactNode | null;
};
interface IEditorState {
  selectedPoint: Point | null;
  editMode: boolean;
}

interface IEditorProps {
  data: Matrix.Matrix<CellBase<string>>;
  curRow: number;
  started: boolean;
  breakpoints: Set<number>;
  handleAddRow: (rowNumber: number) => void;
  handleDeleteRow: (rowNumber: number) => void;
  handleUpdateEditor: (data: Matrix.Matrix<CellBase<string>>) => void;
  toggleBreakpoint: (rowNumber: number) => void;
}

export function parseMatrix(data: Matrix.Matrix<CellBase<string>>) {
  let text = '';

  for (const row of data) {
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

    text += '\n';
  }

  return text;
}

export class Editor extends Component<IEditorProps, IEditorState> {
  state: IEditorState = {
    selectedPoint: null,
    editMode: false,
  };

  addRow = () => {
    if (!this.state.selectedPoint) return;
    this.props.handleAddRow(this.state.selectedPoint.row);
  };

  deleteRow = () => {
    if (
      !this.state.selectedPoint ||
      this.state.selectedPoint.row === this.props.data.length - 1
    )
      return;

    this.props.handleDeleteRow(this.state.selectedPoint.row);
  };

  rowIndicator = ({row}: RowIndicatorProps) => {
    let value = null;
    if (this.props.started && row === this.props.curRow)
      value = <Icon icon="chevron-right" />;
    if (this.props.breakpoints.has(row))
      value = value ? (
        <Icon icon="selection" intent={Intent.DANGER} />
      ) : (
        <Icon icon="remove" intent={Intent.DANGER} />
      );
    return (
      <th
        className="Spreadsheet__header row_corner_indicator"
        onClick={() => this.props.toggleBreakpoint(row)}
      >
        {value}
        <span style={{float: 'right'}}>{row + 1}.</span>
      </th>
    );
  };

  render() {
    return (
      <div style={{width: '100%'}} className="editor_class" id="editor">
        <Spreadsheet
          data={this.props.data}
          readOnly={this.props.started}
          columnLabels={['Label', 'Instruction', 'Argument', 'Comment']}
          RowIndicator={this.rowIndicator}
          CornerIndicator={() => (
            <th className="Spreadsheet__header row_corner_indicator"></th>
          )}
          onChange={data => this.props.handleUpdateEditor(data)}
          onKeyDown={event => {
            if (
              event.key === 'Enter' &&
              !event.shiftKey &&
              !this.state.editMode &&
              !this.props.started
            ) {
              this.addRow();
            }
            if (event.key === 'Escape') {
              this.setState(() => ({
                selectedPoint: null,
              }));
            }
            if (
              event.key === 'Delete' &&
              event.shiftKey &&
              !this.props.started
            ) {
              this.deleteRow();
            }
            if (event.key === 'Backspace' && this.props.started) {
              event.preventDefault();
            }
          }}
          onActivate={(selected: Point) => {
            this.setState(() => ({selectedPoint: selected}));
          }}
          onModeChange={(mode: Mode) => {
            if (mode === 'edit') {
              this.setState(() => ({editMode: true}));
            } else {
              this.setState(() => ({editMode: false}));
            }
          }}
        />
      </div>
    );
  }
}
