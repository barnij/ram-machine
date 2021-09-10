import {TextField} from '@material-ui/core';
import {Autocomplete} from '@material-ui/lab';
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

const DataViewer = (dataViewerProps: Types.DataViewerProps<CellBase>) => {
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

type Cell = Types.CellBase<string>;

function selectInputValue(el: HTMLInputElement): void {
  el.selectionStart = 0;
  el.selectionEnd = el.value.length;
}

const commands = ['add', 'sub', 'mult'];

const DataEditor: React.FC<Types.DataEditorProps<Cell>> = ({
  column,
  onChange,
  cell = {
    value: '',
  },
}) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({...cell, value: e.target.value});
    },
    [onChange, cell]
  );

  React.useEffect(() => {
    if (inputRef.current) {
      selectInputValue(inputRef.current);
    }
  }, [inputRef]);

  const value = cell?.value || '';

  if (column === 0) {
    return (
      <div className="Spreadsheet__data-editor">
        <input list="commands" autoFocus type="text" onChange={handleChange} />
        <datalist id="commands">
          <option value="add" />
          <option value="sub" />
        </datalist>
      </div>
    );
  }

  if (column === 1) {
    return (
      <div className="Spreadsheet__data-editor">
        <Autocomplete
          options={commands}
          getOptionLabel={option => option}
          autoHighlight
          onChange={(event, value) =>
            onChange({...cell, value: value ? value : ''})
          }
          renderInput={params => (
            <TextField
              {...params}
              autoFocus
              variant="standard"
              margin="none"
              fullWidth
            />
          )}
        />
      </div>
    );
  }
  return (
    <div className="Spreadsheet__data-editor">
      <input
        ref={inputRef}
        type="text"
        onChange={handleChange}
        value={value}
        autoFocus
      />
    </div>
  );
};

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
            console.log(selected);
          }}
          DataViewer={DataViewer}
          DataEditor={DataEditor}
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
