import React, { useState } from 'react';
import { Box, Button, CircularProgress, Typography, Tooltip, Grid, ListItem, Chip } from '@mui/material';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport
} from '@mui/x-data-grid';
import DecisionAutocomplete from './DecisionAutocomplete';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import backendRoutes from '../backendRoutes';
import CalculateIcon from '@mui/icons-material/Calculate';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { Stack } from '@mui/system';
import UndoIcon from '@mui/icons-material/Undo';

const DECISION_COL_WIDTH = 320

function CustomToolbar(props) {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarExport />
      <Tooltip title="Calculate simialrities and Cohen Kappa for the chosen coders' codes.">
        <Button
          startIcon={props.simiLoading ? <CircularProgress disableShrink size={15} /> : <CalculateIcon />}
          onClick={() => { props.calcStats() }}
          disabled={props.simiLoading}
        >
          Calculate
        </Button>
      </Tooltip>
      <Tooltip title="Replace all of the chosen coders' codes with the decision made.">
        <Button
          startIcon={<PublishedWithChangesIcon />}
          onClick={() => { props.replaceAll() }}
          disabled={props.simiLoading}
        >
          Replace all
        </Button>
      </Tooltip>
      <Tooltip title="Undo Replace all.">
        <Button
          startIcon={<UndoIcon />}
          onClick={() => { props.undoReplaceAll() }}
          disabled={props.simiLoading}
        >
          Undo All
        </Button>
      </Tooltip>
    </GridToolbarContainer>
  );
}


const undoReplaceOneRow = async (sen_idx, codeHistory, setCodeHistory, owner, project_name, refresh, checkedCoders) => {
  let temp = codeHistory.slice()
  let undoIndex = temp.findIndex(history => history.id == sen_idx)
  if (undoIndex != -1) {
    temp.splice(undoIndex, 1)[0]
    setCodeHistory(temp)
    let res = await axios({
      method: "put",
      url: backendRoutes.DECISION_URL + "undoone",
      data: {
        owner: owner,
        project_name: project_name,
        sen_idx: sen_idx,
        coders: checkedCoders
      }
    })
    if (res.status == 200) {
      refresh()
    }
  } else {
    console.log("No history available")
  }

}

const undoReplaceAll = async (rows, codeHistory, setCodeHistory, owner, project_name, refresh, checkedCoders) => {
  // undo all replacement
  rows.forEach((row) => {
    undoReplaceOneRow(row.id, codeHistory, setCodeHistory, owner, project_name, refresh, checkedCoders)
  })
  alert(`Successfully undoed!`)
}


const replaceOneRow = async (row, owner, project_name, refresh, checkedCoders) => {
  const sen_idx = row.id
  const decision = row.decision.decision
  const backup_codes = row.codes.filter(obj => checkedCoders.includes(obj.author))
  if (decision) {
    let res = await axios({
      method: "put",
      url: backendRoutes.DECISION_URL + "replaceone",
      data: {
        owner: owner,
        project_name: project_name,
        sen_idx: sen_idx,
        coders: checkedCoders,
        decision: decision,
        time: new Date().toLocaleString('en-GB'),
        backup_codes: backup_codes
      }
    })
    if (res.status == 200) {
      refresh()
    }
  } else {
    alert(`Decision is ${decision}`)
  }
}

const replaceAll = async (rows, owner, project_name, refresh, checkedCoders) => {
  // replace all with saved decision, else do nothing
  var count = 0
  rows.filter(r => r.decision).forEach((row) => {
    replaceOneRow(row, owner, project_name, refresh, checkedCoders)
    count++
  })
  alert(`Successfully replaced ${count} rows!`)
}

const processCodeHistoryInit = (segmented_data) => {
  return segmented_data
    .filter(sen => sen.decision)
    .filter(sen => sen.decision.backup_codes && sen.decision.backup_codes.length > 0)
    .map(sen => ({
      id: sen.id,
      codes: sen.decision.backup_codes,
      decision: {
        author: sen.decision.author,
        decision: sen.decision.decision
      },
    }))

}

export default function CompareTable(props) {

  let checks = props.checks
  const similarities = props.similarities
  const segmented_data = props.segmented_data
  let coders = props.coders
  const options = props.options
  const { owner, project, userName } = useParams()

  // save decision history for undo
  const [codeHistory, setCodeHistory] = useState(processCodeHistoryInit(segmented_data))

  const updateUserDecision = (newValue) => {
    axios({
      method: "put",
      url: backendRoutes.DECISION_URL + "user",
      data: {
        owner: owner,
        project_name: project,
        userName: userName,
        newDecision: newValue
      }
    })
      .then(res => {
        if (res.status == 200) {
          console.log("Successfully update decision")
          props.refresh()
        }
      })
      .catch(err => {
        console.log(err)
      });


  }

  let checkedCoders = []
  if (checks.filter(v => v == true).length == 2) {
    checkedCoders = coders.filter((_coder, index) => checks[index] == true)
  }

  let rows = []
  if (Array.isArray(segmented_data) && segmented_data.length > 0) {
    rows = segmented_data.map((value) => {
      var res = {
        id: value.id,
        interview_data: value.interview_data,
        codes: value.codes,
        decision: value.decision ? value.decision : ""
      }
      value.codes.forEach((element) => {
        res[element.author] = element.code
      })
      return res
    })
  }

  let columns = [
    {
      field: 'id',
      width: 30,
      headerName: 'ID',
      editable: false
    },
    {
      field: 'interview_data',
      width: 300,
      headerName: 'Raw Data',
      editable: false
    }
  ];

  coders.forEach((value, index) => {
    columns = columns.concat([{
      field: value,
      width: 180,
      headerName: value,
      description: "uncertainty and code",
      editable: false,
      hide: !checks[index],
      renderCell: (params) => {
        let keywords = segmented_data[params.row.id].keywords.filter(e => e.author == value).map(e => e.keywords)[0]
        let uncertainty = params.row.codes.find(obj => obj.author == value).uncertainty
        return (
          <Grid container spacing={1} >
            <Grid item xs={2}>
              <Box
                textAlign='center'
                sx={{ bgcolor: "secondary.main" }}
              >
                <Typography
                  variant="body"
                  style={{ color: 'white' }}
                >
                  {uncertainty && params.formattedValue ? uncertainty : ""}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="body" >
                {params.formattedValue}
              </Typography>
            </Grid>
            {keywords.length > 0 && <Box
              sx={{
                display: 'flex',
                justifyContent: 'left',
                flexWrap: 'wrap',
                listStyle: 'none',
                p: 0,
                m: 0,
                width: 1
              }}
              component="ul"
            >
              {keywords.map((item, index) => {
                return (
                  <ListItem key={index}>
                    <Chip
                      size='small'
                      variant="contained"
                      label={<Typography variant='body2' style={{ whiteSpace: 'pre-wrap', margin: 3 }}>{item}</Typography>}
                      style={{ height: "100%" }}
                    />
                  </ListItem>
                );
              })}
            </Box>}

          </Grid>
        )
      },
    }])
  });

  columns = columns.concat([{
    field: 'similarity',
    width: 120,
    headerName: "Similarity",
    editable: false,
    type: "number",
    valueGetter: ((params) => {
      if (checkedCoders.length == 2) {
        return similarities[params.row.id];
      } else return ""

    }),
  }])
    .concat([{
      field: 'decision',
      width: DECISION_COL_WIDTH,
      headerName: "Decision",
      type: 'actions',
      disableExport: false,
      getActions: (r) => {
        var rowOptions = props.options.find(op => op.id == r.id)
        if (rowOptions && Object.keys(rowOptions).includes("decisions")) {
          rowOptions = rowOptions.decisions
        } else {
          rowOptions = null
        }
        let disableReplace = checkedCoders.length != 2
        let disableUndo = codeHistory.filter(h => h.id == r.id).length == 0 || checkedCoders.length != 2

        return [
          <Stack direction='row'>
            <DecisionAutocomplete
              id={r.id}
              options={options}
              value={rows.find(row => row.id == r.id).decision.decision}
              inputValue={rows.find(row => row.id == r.id).decision.decision}
              onChange={(newValue) => {
                updateUserDecision(newValue)
              }}
              width={DECISION_COL_WIDTH - 70}
              userName={userName}
              updateOptions={props.updateOptions}
              row={r}
              checkedCoders={checkedCoders}
              projectName={project}
            />
            <Stack direction='column' sx={{ width: 50 }}>
              <span disabled={disableReplace}>
                <Tooltip title="Replace the chosen coders' codes with the decision.">
                  <Button
                    onClick={() => {
                      if (checkedCoders.length == 2) {
                        replaceOneRow(r.row, owner, project, props.refresh, checkedCoders)
                        setCodeHistory([r.row, ...codeHistory.filter(h => h.id != r.row.id)])
                      } else {
                        alert("Please select 2 coders for decision replacement.")
                      }
                    }}
                    sx={{ width: 50 }}
                    disabled={disableReplace}
                    onKeyDown={(event) => {
                      if (event.key === ' ') {
                        // Prevent key navigation when focus is on button
                        event.stopPropagation();
                      }
                    }}
                  >
                    Replace
                  </Button>
                </Tooltip>
              </span>

              <span disabled={disableUndo}>
                <Tooltip title="Undo replace decision.">
                  <Button
                    size='small'
                    onClick={() => {
                      if (checkedCoders.length == 2) {
                        undoReplaceOneRow(r.id, codeHistory, setCodeHistory, owner, project, props.refresh, checkedCoders)
                      } else {
                        alert("Please select 2 coders for decision undo.")
                      }
                    }}
                    disabled={disableUndo}
                  >
                    <UndoIcon />
                  </Button>
                </Tooltip>
              </span>
            </Stack>
          </Stack>
        ];
      }
    }])


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
      }}
    >
      <DataGrid
        sx={{
          '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': {
            py: 1,
          },
          '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
            py: '15px',
          },
          '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
            py: '22px',
          },
        }}
        rows={rows}
        columns={columns}
        pageSize={10}
        autoHeight
        disableColumnMenu
        getRowHeight={() => 'auto'}
        hideFooterSelectedRowCount
        components={{
          Toolbar: CustomToolbar,
        }}
        componentsProps={{
          toolbar: {
            calcStats: props.calcStats,
            simiLoading: props.simiLoading,
            replaceAll: () => {
              if (checkedCoders.length > 0) {
                replaceAll(rows, owner, project, props.refresh, checkedCoders)
              } else {
                alert("Please select 2 coders for decision replacement.")
              }
            },
            undoReplaceAll: () => {
              if (checkedCoders.length > 0) {
                undoReplaceAll(rows, codeHistory, setCodeHistory, owner, project, props.refresh, checkedCoders)
              } else {
                alert("Please select 2 coders for decision replacement.")
              }
            }
          },
        }}
        experimentalFeatures={{ newEditingApi: true }}
        onCellKeyDown={(_params, event) => {
          event.stopPropagation()
        }}
      />
    </Box>
  );
}
