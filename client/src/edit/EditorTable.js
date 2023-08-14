import React from "react";
import clsx from 'clsx';
import { Box, Typography, ListItem, Chip } from '@mui/material';
import {
  DataGrid,
  GridToolbarFilterButton,
  GridToolbarContainer,
  GridToolbarExport,
} from '@mui/x-data-grid';
import EditorAutocomplete from './EditorAutocomplete'
import { useParams } from "react-router-dom";
import axios from 'axios';
import backendRoutes from '../backendRoutes';
import TextSelection from "./TextSelection";

const ADD_CODE_COL_WIDTH = 180
function EditToolbar() {

  return (
    <div>
      <GridToolbarContainer>
        <GridToolbarFilterButton />
        <GridToolbarExport />
      </GridToolbarContainer>
    </div>

  );
}

export default function EditorTable(props) {

  const rows = props.rowsContent
  const options = props.options

  const { owner, project, userName } = useParams()

  const editorUpdateCode = async (newValue, id, uncertainty) => {
    //newValue: {id:0,code:code_string} if chosen from options
    // else: plain string / null
    let code = null;
    let selectedFromAuthor = null;

    if (typeof newValue === 'string') {
      code = newValue;
    } else if (typeof newValue === 'object' && newValue !== null) {
      code = newValue.code || null;
      selectedFromAuthor = newValue.selectedFromAuthor || null;
    }

    axios({
      method: 'post',
      url: backendRoutes.EDIT_URL,
      data: {
        owner: owner,
        userName: userName,
        project: project,
        row_id: id,
        code: code,
        selectedFromAuthor: selectedFromAuthor,
        uncertainty: uncertainty,
        time: new Date().toLocaleString('en-GB')
      }
    })
      .then(res => {
        if (res.status == 200) {
          console.log("Successfully update code")
          props.refresh()
        }
      })
      .catch(err => {
        console.log(err)
      });
  }

  const updateUncertainty = (newValue, rowId) => {

    axios({
      method: 'post',
      url: backendRoutes.EDIT_URL + "uncertainty/",
      data: {
        owner: owner,
        userName: userName,
        project: project,
        row_id: rowId,
        uncertainty: newValue
      }
    })
      .then(res => {
        if (res.status == 200) {
          console.log("Successfully update certainty")
        }
      })
      .catch(console.log);
  }

  const columns = [
    {
      field: 'id',
      flex: 0.1,
      headerName: 'ID',
      editable: false,
    },
    {
      field: 'interview_data',
      flex: 1,
      headerName: 'Raw Data',
      description: "Simply select the raw data and right-click on the keyword and select 'Add as support'",
      editable: false,
      headerAlign: 'center',
      renderCell: (params) => {
        return <TextSelection
          interview_data={params.row.interview_data}
          addKeyword={(keyword) => props.updateKeyword(params.row.id, keyword)}
        />
      },
    },
    {
      field: 'code',
      width: ADD_CODE_COL_WIDTH,
      type: 'actions',
      headerName: 'Add Code',
      cellClassName: 'ComboBox',
      disableExport: false,
      getActions: (r) => {
        return [<EditorAutocomplete
          id={r.id}
          options={options}
          rows={rows}
          value={rows[r.id].code}
          inputValue={rows[r.id].code}
          onChange={(newValue) => {
            editorUpdateCode(newValue, r.id, r.row.uncertainty)
          }}
          width={ADD_CODE_COL_WIDTH}
          owner={owner}
          project_name={project}
          userName={userName}
          updateOptions={props.updateOptions}
          currentCodesList={props.currentCodesList}
        />];
      }
    },

    {
      field: 'keywords',
      flex: 0.7,
      headerName: 'Definition',
      description: "To support your codes, identify relevant keywords or phrases from the raw data column, and add them as supporting evidence. ",
      renderCell: (params) => {
        let keywords = params.row.keywords[0]
        if (keywords && Array.isArray(keywords) && keywords.length > 0) {
          return <div>
            {keywords.map((item, index) => {
              if (item) {
                return (
                  <ListItem key={index} sx={{ p: 0, m: 0, pb: 1.5 }}>
                    <Chip
                      sx={{
                        maxWidth: params.colDef.computedWidth - 30
                      }}
                      size='small'
                      variant="contained"
                      label={<Typography variant='body2' style={{ whiteSpace: 'pre-wrap', margin: 3 }}>{item}</Typography>}
                      style={{ height: "100%" }}
                      onDelete={() => props.removeKeyword(params.row.id, item)}
                    />
                  </ListItem>
                );
              }
            })}
          </div>
        } else return <div></div>

      },
    },
    {
      field: 'uncertainty',
      flex: 0.2,
      headerName: 'Certainty',
      description: "A score to indicate your certainty to your given code (1-5), 1 represents “Very uncertain”, 3 represents “Neutral”, 5 represents “Very certain”.",
      type: 'singleSelect',
      valueOptions: [1, 2, 3, 4, 5],
      editable: true,
      disableExport: false,
      cellClassName: (params) => {
        if (params.value == null) {
          return '';
        }
        return clsx('uncertainty-color', {
          one: params.value == 1,
          two: params.value == 2,
          three: params.value == 3,
          four: params.value == 4,
          five: params.value == 5,
        });
      },
      preProcessEditCellProps: (params) => {
        const newUncer = params.props.value
        const rowId = params.row.id
        updateUncertainty(newUncer, rowId)
      },
    },

  ];

  return (
    <Box
      sx={{
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
        '& .one': {
          backgroundColor: '#EFF2FA',
          color: 'text.primary',
        },
        '& .two': {
          backgroundColor: '#E0E4F5',
          color: 'text.primary',
        },
        '& .three': {
          backgroundColor: '#D0D7F0',
          color: 'text.primary',
        },
        '& .four': {
          backgroundColor: '#C0C9EB',
          color: 'text.primary',
        },
        '& .five': {
          backgroundColor: '#B1BCE7',
          color: 'text.primary',
        },
        '& .six': {
          backgroundColor: '#A1AEE2',
          color: 'text.primary',
        },
        '& .seven': {
          backgroundColor: '#91A1DD',
          color: 'text.primary',
        },
      }}
    >
      <DataGrid
        sx={{
          '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': {
            py: '5px',
          },
          '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
            py: '10px',
          },
          '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
            py: '20px',
          },
        }}
        rows={rows}
        columns={columns}
        pageSize={10}
        autoHeight
        disableSelectionOnClick
        getRowHeight={() => 'auto'}
        hideFooterSelectedRowCount
        components={{
          Toolbar: EditToolbar,
        }}
        experimentalFeatures={{ newEditingApi: true }}
        onCellKeyDown={(params, event) => {
          event.stopPropagation()
        }}
      />
    </Box>
  );
}
