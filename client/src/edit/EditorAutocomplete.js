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


export default function EditorAutocomplete(props) {
  const [value, setValue] = React.useState(props.value);
  const [inputValue, setInputValue] = React.useState(props.inputValue);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  if (props.value != value) {
    setValue(props.value)
  }

  const sen_idx = props.id
  let options = props.options.filter(op => op.id == sen_idx)

  // since only ai and 1 iser, we use this
  const sortedOptions = [
    ...options.filter(({ author }) => author == Constants.OPEN_AI_MODEL),
    ...options.filter(({ author }) => author == props.userName),
    ...options.filter(({ author }) => author != Constants.OPEN_AI_MODEL && author != props.userName) // in case something else?
  ];


  //This variable hasAiSum can be used later in the component 
  //to determine whether there are options with an author property 
  //equal to Constants.OPEN_AI_MODEL and an id property equal to 
  //sen_idx.
  const hasAiSum = options.filter(op1 => op1.author == Constants.OPEN_AI_MODEL).length > 0
  const currentCodesList = props.currentCodesList.map(op => op.code);


  //return AI's results
  const summarizeSentence = async () => {
    console.log("summarizeSentence called")
    try {
      setLoading(true)
      const { data } = await axios({
        method: 'post',
        url: backendRoutes.SUMMARY_URL,
        data: {
          sen_idx: sen_idx,
          owner: props.owner,
          project_name: props.project_name,
          userName: props.userName,
          sentence: props.rows[sen_idx].interview_data,
          currentCodesList: currentCodesList
        }
      })
      let index = data.index
      let generatedCodes = data.response

      let newOptions = []
      newOptions.push(generatedCodes.gptsummary.map(code => (
        {
          id: index,
          code: code,
          author: Constants.OPEN_AI_MODEL
        }
      )))
      newOptions.push(generatedCodes.similarCodes.map(code => (
        {
          id: index,
          code: code,
          author: "Similar Codes from " + props.userName
        }
      )))

      props.updateOptions(newOptions.flat())

      setLoading(false)
    } catch (err) {
      setLoading(false)
      console.log(err)
    }
  };



  return (
    <Autocomplete
      value={value}
      inputValue={inputValue}

      onChange={(_event, newValue) => {

        let toChange

        if (newValue && newValue.inputValue) {
          toChange = newValue.inputValue
        } else if (newValue?.author) {
          toChange = newValue
          toChange.selectedFromAuthor = newValue.author
        } else {
          toChange = newValue
        }

        setValue(toChange);
        props.onChange(toChange);
      }}

      onInputChange={(_event, newInputValue) => {
        setInputValue(newInputValue);
      }}


      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.code);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            inputValue,
            code: `Add "${inputValue}"`,
          });
        }
        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      fullWidth
      handleHomeEndKeys
      id={props.id + ""}
      options={sortedOptions}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') return option;
        // Add "xxx" option created dynamically
        if (option.inputValue) return option.inputValue;
        // Regular option
        return option.code;
      }}
      renderOption={(props, option) =>
        // <li {...props} onClick={(event) => handleOptionClick(event, option)}>
        <li {...props}>
          <Typography variant="caption">
            {option.code}
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

        if (!hasAiSum) {
          summarizeSentence(value)
        }
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      loading={loading}

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