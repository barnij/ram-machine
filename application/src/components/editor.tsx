import React, {Component} from 'react';
import {
  Point,
  CellBase,
  createEmptyMatrix,
  Spreadsheet,
  Matrix,
  Mode,
} from '@barnij/react-spreadsheet';
import {Icon} from '@blueprintjs/core';
type RowIndicatorProps = {
  row: number;
  label?: React.ReactNode | null;
};
import './editor.css';

interface IEditorState {
  data: Matrix<CellBase<string>>;
  selectedPoint: Point | null;
  editMode: boolean;
}

interface IEditorProps {
  curRow: number;
  handleChange: (text: string) => void;
}

export function parseMatrix(data: Matrix<CellBase<string>>) {
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

const START_NUMBER_OF_ROWS = 2;

export class Editor extends Component<IEditorProps, IEditorState> {
  state: IEditorState = {
    data: createEmptyMatrix<CellBase<string>>(START_NUMBER_OF_ROWS, 4),
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
    const text = parseMatrix(this.state.data);
    this.props.handleChange(text);
  };

  rowIndicator = ({row}: RowIndicatorProps) => {
    let value = null;
    if (this.props.curRow !== -1 && row === this.props.curRow)
      value = <Icon icon="chevron-right" />;
    return (
      <th className="Spreadsheet__header row_corner_indicator">{value}</th>
    );
  };

  render() {
    return (
      <div style={{width: '100%'}} className="editor_class" id="editor">
        <Spreadsheet
          data={this.state.data}
          columnLabels={['Label', 'Instruction', 'Argument', 'Comment']}
          RowIndicator={this.rowIndicator}
          CornerIndicator={() => (
            <th className="Spreadsheet__header row_corner_indicator"></th>
          )}
          onChange={data =>
            this.setState({data: data}, () => {
              this.loadText();
            })
          }
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
