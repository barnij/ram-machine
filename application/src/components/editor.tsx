import React, {Component} from 'react';
import {Spreadsheet} from 'react-spreadsheet';

/* DataGrid
import {DataGrid, GridColDef, GridRowsProp} from '@material-ui/data-grid';
const rows: GridRowsProp = [
  {id: 1, col1: 'Hello', col2: 'World', col3: ''},
  {id: 2, col1: 'ABC', col2: '', col3: ''},
];

const columns: GridColDef[] = [
  {
    field: 'col1',
    headerName: 'Column 1',
    flex: 1,
    minWidth: 100,
    editable: true,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
  },
  {
    field: 'col2',
    headerName: 'Column 2',
    width: 200,
    editable: true,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
  },
  {
    field: 'col3',
    headerName: 'Column 3',
    flex: 0.5,
    minWidth: 50,
    editable: true,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
  },
];
*/

const data = [
  [{value: 'Flavors'}],
  [{value: 'Vanilla'}, {value: 'Chocolate'}],
  [{value: 'Strawberry'}, {value: 'Cookies'}],
  [{value: 'How much do you like ice cream?'}, {value: 100}],
];
export class Editor extends Component<{}, {}> {
  render() {
    return (
      <div style={{height: 300, width: '100%'}} className="editor_class">
        {/* <DataGrid rows={rows} columns={columns} /> */}
        <Spreadsheet
          data={data}
          columnLabels={['Column 1', 'Column 2']}
          RowIndicator={() => <th className="Spreadsheet__header"></th>}
        />
      </div>
    );
  }
}
