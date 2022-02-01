import React, {Component} from 'react';
import {
  Point,
  CellBase,
  Spreadsheet,
  Matrix,
  Mode,
} from '@barnij/react-spreadsheet';
import {Button, Icon, Intent} from '@blueprintjs/core';
import './editor.css';
import {animateScroll} from 'react-scroll';

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
  redRows: Map<number, number>;
  handleAddRow: (rowNumber: number) => void;
  handleDeleteRow: (rowNumber: number) => void;
  handleUpdateEditor: (data: Matrix.Matrix<CellBase<string>>) => void;
  resetRedRows: () => void;
  toggleBreakpoint: (rowNumber: number) => void;
}

export function parseMatrix(data: Matrix.Matrix<CellBase<string>>) {
  let text = '';

  let iterations = data.length;
  let maxLabelLength = 0;
  let maxArgumentLength = 0;
  for (const row of data) {
    const labelLength = row[0]?.value?.length ?? 0;
    maxLabelLength = Math.max(labelLength, maxLabelLength);
    const argumentLength = row[2]?.value?.length ?? 0;
    maxArgumentLength = Math.max(argumentLength, maxArgumentLength);
  }

  for (const row of data) {
    const label = row[0]?.value;
    const instruction = row[1]?.value;
    const argument = row[2]?.value;
    const comment = row[3]?.value;

    if (label) {
      text += label;
      text += ': ';
      text += ' '.repeat(maxLabelLength - label.length);
    } else {
      text += ' '.repeat(maxLabelLength + 2);
    }

    if (instruction) {
      text += instruction;
      text += ' '.repeat(6 - instruction.length);
    } else {
      text += ' '.repeat(6);
    }

    if (argument) {
      text += argument;
      text += ' '.repeat(maxArgumentLength - argument.length + 1);
    } else {
      text += ' '.repeat(maxArgumentLength + 1);
    }

    if (comment) {
      text += '#' + comment;
    }

    if (--iterations) text += '\n';
  }

  return text;
}

type RowComponent = React.ComponentType<React.PropsWithChildren<{row: number}>>;

export class Editor extends Component<IEditorProps, IEditorState> {
  state: IEditorState = {
    selectedPoint: null,
    editMode: false,
  };

  addRow = () => {
    if (!this.state.selectedPoint) return;
    this.props.handleAddRow(this.state.selectedPoint.row);
  };

  addRowButton = () => {
    this.props.handleAddRow(this.props.data.length);
    animateScroll.scrollMore(100, {
      containerId: 'editor',
      delay: 0,
      duration: 0,
    });
  };

  deleteRowButton = () => {
    if (this.props.data.length < 1) return;
    this.props.handleDeleteRow(this.props.data.length - 1);
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

  row: RowComponent = props => {
    const red = this.props.redRows.get(props.row);
    if (red)
      return (
        <tr {...props} style={{backgroundColor: 'rgba(255,0,0,' + red + ')'}} />
      );
    else return <tr {...props} />;
  };

  render() {
    return (
      <div
        style={{width: '100%'}}
        className="editor_class moz-scroller"
        id="editor"
      >
        <Spreadsheet
          Row={this.row}
          darkMode
          data={this.props.data}
          readOnly={this.props.started}
          columnLabels={['Label', 'Instruction', 'Argument', 'Comment']}
          RowIndicator={this.rowIndicator}
          CornerIndicator={() => (
            <th className="Spreadsheet__header row_corner_indicator"></th>
          )}
          onChange={data => this.props.handleUpdateEditor(data)}
          onKeyDown={event => {
            if (this.props.started) {
              event.preventDefault();
              return;
            }
            if (
              event.key === 'Enter' &&
              !event.shiftKey &&
              !this.state.editMode
            ) {
              this.props.resetRedRows();
              this.addRow();
            }
            if (event.key === 'Escape') {
              this.setState(() => ({
                selectedPoint: null,
              }));
            }
            if (event.key === 'Delete' && event.shiftKey) {
              this.props.resetRedRows();
              this.deleteRow();
              event.preventDefault();
            }
          }}
          onActivate={(selected: Point) => {
            this.setState(() => ({selectedPoint: selected}));
          }}
          onBlur={() => this.setState({selectedPoint: null})}
          onModeChange={(mode: Mode) => {
            if (mode === 'edit') {
              this.setState(() => ({editMode: true}));
              this.props.resetRedRows();
            } else {
              this.setState(() => ({editMode: false}));
            }
          }}
        />
        <div style={{paddingLeft: 1}}>
          <Button icon="add" onClick={() => this.addRowButton()}></Button>
          <Button
            icon="delete"
            disabled={this.props.data.length < 1}
            style={{marginLeft: 10}}
            onClick={() => this.deleteRowButton()}
          ></Button>
        </div>
      </div>
    );
  }
}
