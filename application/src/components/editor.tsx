import React, {Component} from 'react';
import {CellBase, Spreadsheet} from 'react-spreadsheet';
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
    data: [
      [{value: ''}, {value: ''}, {value: ''}, {value: ''}],
      [{value: ''}, {value: ''}, {value: ''}, {value: ''}],
    ],
  };
  pressedEnter = () => {
    this.setState(prev => ({
      data: prev.data.concat([
        [{value: ''}, {value: ''}, {value: ''}, {value: ''}],
      ]),
    }));
  };
  render() {
    return (
      <div style={{width: '100%'}} className="editor_class">
        <Spreadsheet
          data={this.state.data}
          columnLabels={['Label', 'Instruction', 'Argument', 'Comment']}
          RowIndicator={rowCornerInd}
          CornerIndicator={rowCornerInd}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              this.pressedEnter();
            }
          }}
        />
      </div>
    );
  }
}
