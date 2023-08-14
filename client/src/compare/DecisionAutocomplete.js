import React, { } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import backendRoutes from "../backendRoutes";
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { styled, lighten, darken } from '@mui/system';
import { Typography } from "@mui/material";
import { Constants } from "../Constant";

const filter = createFilterOptions();

const GroupHeader = styled('div')(({ theme }) => ({
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: theme.palette.primary.main,
    backgroundColor:
        theme.palette.mode === 'light'
            ? lighten(theme.palette.primary.light, 0.85)
            : darken(theme.palette.primary.main, 0.8),
}));

const GroupItems = styled('ul')({
    padding: 0,
});

const callGPT3 = async (code1, code2, interview_data) => {
    console.log(`Making decision for "${code1}" and "${code2}" of "${interview_data}"...`)

    const decision = await axios({
        method: 'post',
        url: backendRoutes.DECISION_URL,
        data: {
            code1: code1,
            code2: code2,
            interview_data: interview_data
        },
    })

    return decision.data.response.map(it => it.replaceAll("\"", ""))
}

export default function DecisionAutocomplete(props) {
    const sen_idx = props.id
    const [value, setValue] = React.useState(props.value);
    const [inputValue, setInputValue] = React.useState(props.inputValue);
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [options, setOptions] = React.useState([]);

    //return AI's results
    const generateDecision = async () => {
        console.log("Generating decisions...")
        //if we only input the project name and segmented_data id?
        const row = props.row.row
        const interview_data = row.interview_data
        const code1 = row.codes[0].code
        const code2 = row.codes[1].code
        setLoading(true)
        let decisions = await callGPT3(code1, code2, interview_data)
        let newDecisions = decisions.map(d => ({
            id: row.id,
            author: Constants.OPEN_AI_MODEL,
            decision: d
        }))
        props.updateOptions(newDecisions)
        setOptions(newDecisions)
        setLoading(false)
        setOpen(true)
    }

    return (
        <Autocomplete
            disabled={props.checkedCoders.length != 2}
            value={value}
            onChange={(event, newValue) => {
                let toChange

                if (newValue && newValue.inputValue) {
                    toChange = {
                        id: sen_idx,
                        author: Constants.OPEN_AI_MODEL,
                        decision: newValue.inputValue
                    }
                } else if (newValue && newValue.decision) {
                    toChange = newValue
                } else {
                    toChange = {
                        id: sen_idx,
                        author: Constants.OPEN_AI_MODEL,
                        decision: ""
                    }
                }

                setValue(toChange);
                props.onChange(toChange);
                setOptions(options.filter(option => option.id != sen_idx)) //remove the latest generated
            }}
            inputValue={inputValue}
            onInputChange={(_event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);
                const { inputValue } = params;
                // Suggest the creation of a new value
                const isExisting = options.some((option) => inputValue === option.decision);
                if (inputValue !== '' && !isExisting) {
                    filtered.push({
                        inputValue,
                        decision: `Add "${inputValue}"`,
                    });
                }
                return filtered;
            }}
            clearOnBlur
            fullWidth
            handleHomeEndKeys
            id={props.id + ""}
            options={options.filter(op => op.id == sen_idx)}
            getOptionLabel={(option) => {
                // Value selected with enter, right from the input
                if (typeof option === 'string') return option;
                // Add "xxx" option created dynamically
                if (option.inputValue) return option.inputValue;
                // Regular option
                return option.decision;
            }}
            renderOption={(props, option) =>
                <li {...props}>
                    <Typography variant="caption">
                        {option.decision}
                    </Typography>

                </li>}

            sx={{ width: props.width }}
            size="small"
            freeSolo

            groupBy={(option) => option.author}
            renderGroup={(params) => {
                return (
                    <li key={params.key}>
                        <GroupHeader>{params.group}</GroupHeader>
                        <GroupItems>{params.children}</GroupItems>
                    </li>
                )
            }}

            open={open}
            onOpen={() => {
                if (props.checkedCoders.length == 2) {
                    generateDecision()
                } else {
                    alert("Please choose exactly 2 coders to generate a decision.")
                }
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}

            renderInput={(params) => (
                <TextField
                    {...params}
                    sx={{
                        '& .MuiInputBase-input': {
                            fontSize: 15,
                        },
                    }}
                    multiline
                    maxRows={4}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
    );
}
