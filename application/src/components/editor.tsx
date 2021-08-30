import React, {Component} from 'react';
import {CellBase, createEmptyMatrix, Spreadsheet} from 'react-spreadsheet';
import type Matrix from 'react-spreadsheet/dist/matrix';
import './editor.css';

const rowCornerInd = () => (
  <th className="Spreadsheet__header row_corner_indicator"></th>
);

interface IEditorState {
  data: Matrix.Matrix<CellBase>;
}

export class Editor extends Component<{}, IEditorState> {
  state: IEditorState = {
    data: createEmptyMatrix(2, 4),
  };
  pressedEnter = () => {
    this.setState(prev => ({
      data: prev.data.concat(createEmptyMatrix(1, 4)),
    }));
  };
  logText = () => {
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
            if (event.key === 'Enter') {
              this.pressedEnter();
              console.log('a');
            }
          }}
        />
        <button onClick={this.logText}>Log text from Grid</button>
      </div>
    );
  }
}
