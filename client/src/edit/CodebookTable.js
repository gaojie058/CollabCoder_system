import * as React from 'react';
import PropTypes from 'prop-types';
import {
    DataGrid,
    GridToolbarFilterButton,
    GridToolbarContainer,
    GridToolbarExport,
} from '@mui/x-data-grid';
import { useParams } from "react-router-dom";
import axios from 'axios';
import backendRoutes from '../backendRoutes';
import { Tooltip, Typography, Box } from '@mui/material';

function EditToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarFilterButton />
            <GridToolbarExport />
        </GridToolbarContainer>
    );
}

CodebookTable.propTypes = {
    options: PropTypes.array.isRequired,
};


export default function CodebookTable(props) {

    const { owner, project, userName } = useParams()

    const codebookUpdateCode = (newValue, oldcode) => {

        var code = null

        if (typeof newValue === 'string') {
            code = newValue
        } else if (newValue === null || newValue == undefined) {
            code = null
        }
        else if (typeof newValue === "object") {
            if (Object.keys(newValue).includes("code")) {
                code = newValue.code
            }
        }

        axios({
            method: 'post',
            url: backendRoutes.EDIT_URL + "/codebook",
            data: {
                owner: owner,
                userName: userName,
                project: project,
                oldCode: oldcode,
                newCode: code,
                time: new Date().toLocaleString('en-GB')
            }
        })
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    props.refresh()
                    console.log("Successfully update code")
                } else {
                    console.log(`modifiedCount = ${res.data.modifiedCount}`)
                }
            })
            .catch(err => {
                console.log(err)
            });
    }

    const codebookColumns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 10
        },
        {
            field: 'code',
            headerName: 'Code',
            width: 200,
            editable: true,
            renderCell: (params) => (
                <Tooltip title={params.formattedValue} >
                    <Typography variant="body" component="div" noWrap>
                        {params.formattedValue}
                    </Typography>
                </Tooltip>
            ),
            preProcessEditCellProps: (params) => {
                const newCode = params.props.value
                const oldCode = params.row.code
                codebookUpdateCode(newCode, oldCode)
            },
        },
        {
            field: 'time',
            headerName: 'Time',
            width: 140,
            renderCell: (params) => (
                <Tooltip title={params.formattedValue} >
                    <Typography variant="body" component="div" noWrap>
                        {params.formattedValue}
                    </Typography>
                </Tooltip>
            ),
        }
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
            }}>
            <DataGrid
                rows={props.options}
                columns={codebookColumns}
                autoHeight
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
                components={{
                    Toolbar: EditToolbar,
                }}
            />
        </Box>
    );
}
