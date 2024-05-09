import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Stack, Grid, Divider } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import backendRoutes from "../backendRoutes";
import { useNavigate, useParams } from "react-router-dom";
import { createEditUrl } from "../frontendRoutes";
import axios from "axios";
import NoAccess from "../login/NoAccess";
import useUserStore from "../stores/useUserStore";
import FileInput from '../ui-component/input/FileInput'
import useAddProject from "../api/projects/useAddProject";
import useGetProjects from "../api/projects/useGetProjects";
import useGetAllUsers from "../api/projects/useGetAllUsers";
import myAlert from "../ui-component/Alert";


function createProjectObj(name, owner, text, file_names, codingLevel, codersNames) {
    let coders = codersNames.map(name => (
        { name: name }
    ))
    coders.unshift({ name: owner })
    const timeOptions = {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit"
    }
    const currentTime = new Date().toLocaleDateString("en-US", timeOptions);
    return {
        name: name,
        owner: owner,
        create_time: currentTime,
        last_edit: currentTime,
        coding_level: codingLevel,
        input_docs: text,
        file_names: file_names,
        coders: coders
    }
}

const checkNoSameNameExist = async (tempProjName, userName) => {
    // const PROJECTS_URL = backendRoutes.PROJECTS_URL + userName + "/"
    // const result = await axios(PROJECTS_URL);
    // console.log(result)
    try {
        const { status, data } = await useGetProjects(userName)
        if (status) {
            if (data.map(p => p.name).includes(tempProjName)) {
                return false
            } else {
                return true
            }
        } else {
            throw new Error("failed to get projects")
        }
    } catch (err) {
        console.error(err);
    }

}



export default function AddNewProjectPage() {
    const userName = useUserStore((state) => state.name)

    const navigate = useNavigate();
    const [projectName, setProjectName] = useState("");
    const [coderValue, setCoderValue] = useState([]);
    const [codingLevel, setCodingLevel] = useState("Sentence");
    const [projectNameError, setProjectNameError] = useState(false);
    const [files, setFiles] = useState([]);



    const [allUsers, setAllUsers] = React.useState([])

    useEffect(() => {
        const fetchData = async () => {
            // try {
            //     const result = await axios(backendRoutes.USERS_URL);
            //     setAllUsers(result.data.filter((user) => (user.user_name != userName))) // remove myself
            // } catch (err) {
            //     alert(err)
            // }
            try {
                const { status, data } = await useGetAllUsers()
                if (status) {
                    setAllUsers(data.filter((user) => (user.user_name != userName)))
                } else {
                    setAllUsers(data.filter((user) => (user.user_name != userName)))
                    throw new Error("failed to get all users")
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData()
    }, []);

    const handleCodingLevelChange = (event) => {
        setCodingLevel(event.target.value);
    };

    const handleFileChange = (files) => {
        // if (event.target.files) {
        //     const filesArray = Array.from(event.target.files)
        //     let numOfFiles = event.target.files.length
        //     localStorage.setItem("file_names", filesArray.map(f => f.name))
        //     localStorage.setItem("num_of_files", numOfFiles)

        //     filesArray.forEach((file, fileIndex) => {
        //         const reader = new FileReader()
        //         reader.onload = async (e) => {
        //             localStorage.setItem(`file${fileIndex}`, e.target.result)
        //         };
        //         reader.readAsText(file, 'utf-8')
        //     });
        // }
        setFiles(files)
    };


    const handleConfirm = async () => {



        // concat all file text
        if (files.length > 0) {
            let text = ""
            const file_names = files[0].name
            // let numOfFiles = localStorage.getItem("num_of_files")
            // for (let i = 0; i < files.length; i++) {
            //     // text += localStorage.getItem(`file${i}`).toString()
            //     const reader = new FileReader()
            //     reader.onload = async (e) => {
            //         text += await e.target.result.toString()
            //     }
            //     reader.readAsText(files[i], 'utf-8')
            // }
            const readFileAsText = (file) => {
                return new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = () => resolve(reader.result);
                  reader.onerror = () => reject(reader.error);
                  reader.readAsText(file, 'utf-8');
                });
              };

            const readFile = async ()=>{
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    text += await readFileAsText(file);
                }
            }

            await readFile()

            // send project object
            let projectObj = createProjectObj(
                projectName,
                userName,
                text,
                // localStorage.getItem("file_names"),
                file_names,
                codingLevel,
                coderValue.map((coder) => coder.user_name)
            )
            // axios({
            //     method: 'post',
            //     url: backendRoutes.ADD_PROJECT_URL,
            //     data: projectObj
            // })
            //     .then(
            //         navigate(createEditUrl(userName, projectName, userName))
            //     )
            //     .catch(console.log);
            

            // console.log(projectObj);
            const result = await useAddProject(projectObj)
            if (result) {
                navigate(createEditUrl(userName, projectName, userName))
            } else {
                console.log("failed create project");
            }
        } else {
            myAlert('Error', 'please at least upload one file', 'error', 3000)
        }
    };


    return (
        <Box sx={{ margin: { xs: 2.5, md: 3 } }}>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box sx={{ mb: 2 }}>
                        <Stack sx={{ width: 800 }} direction="column" alignItems="left" justifyContent="space-between" spacing={2}>
                            <Typography variant="h2" gutterBottom>
                                Create a new project
                            </Typography>

                            <Typography variant="h3" gutterBottom>
                                Project Name
                            </Typography>
                            <TextField
                                id="name-input"
                                variant="outlined"
                                error={projectNameError}
                                onBlur={async (event) => {
                                    if (await checkNoSameNameExist(event.target.value, userName)) {
                                        setProjectName(event.target.value)
                                        setProjectNameError(false)
                                    }
                                    else { setProjectNameError(true); }
                                }} />
                            <Divider />

                            <Typography variant="h3" gutterBottom>
                                Add documents
                            </Typography>

                            <Typography variant="h5" gutterBottom>
                                Only .csv and .txt files are allowed.
                            </Typography>

                            {/* <input accept=".txt" multiple={true} type="file" onChange={handleFileChange} /> */}
                            <FileInput accept=".txt .csv" onChange={handleFileChange} ></FileInput>
                            <Divider />

                            <Typography variant="h3" gutterBottom>
                                Level of coding
                            </Typography>

                            <FormControl>
                                <RadioGroup
                                    aria-labelledby="level-of-coding"
                                    name="level-of-coding-radio-buttons-group"
                                    value={codingLevel}
                                    onChange={handleCodingLevelChange}
                                >
                                    <FormControlLabel value={"Sentence"} control={<Radio />} label="Sentence" />
                                    <FormControlLabel value={"Paragraph"} control={<Radio />} label="Paragraph" />
                                </RadioGroup>
                            </FormControl>

                            <Typography variant="h3" gutterBottom>
                                Add collaborators
                            </Typography>
                            <Autocomplete
                                value={coderValue}
                                onChange={(_event, newValue) => {
                                    setCoderValue(newValue);
                                }}
                                disablePortal
                                multiple
                                id="add-collaborators"
                                options={allUsers}
                                getOptionLabel={(option) => option.user_name}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                        {option.user_name} ({option.email})
                                    </Box>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Email/Username"
                                        InputProps={{
                                            ...params.InputProps,
                                            type: 'search',
                                        }}
                                    />
                                )}
                            />
                            <Divider />

                            <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                onClick={handleConfirm}
                            >
                                Create project
                            </Button>
                        </Stack>
                    </Box>
                </Grid>
            </Grid>

        </Box >
    )

}
