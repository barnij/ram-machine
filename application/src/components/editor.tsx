import React, {Component} from 'react';
import {DataGrid, GridColDef, GridRowsProp} from '@material-ui/data-grid';

const rows: GridRowsProp = [
  {id: 1, col1: 'Hello', col2: 'World'},
  {id: 2, col1: 'ABC', col2: ''},
];

const columns: GridColDef[] = [
  {field: 'col1', headerName: 'Column 1', width: 150},
  {field: 'col2', headerName: 'Column 2', width: 200},
];

export class Editor extends Component<{}, {}> {
  render() {
    return (
      <div style={{height: 300, width: '100%'}} className="editor_class">
        <DataGrid rows={rows} columns={columns} />
      </div>
    );
  }
}
