import React, { useState, useEffect } from "react";
import { Box, Stack, Grid, Fab, Tooltip, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ProjectCard from "./ProjectCard";
import axios from 'axios';
import backendRoutes from "../backendRoutes";
import { useParams, useNavigate } from "react-router-dom";
import { createAddProjectUrl, createEditUrl } from "../frontendRoutes";
import NoAccess from "../login/NoAccess";
import Loading from "../ui-component/Loading";

const addExample = (userName, navigate) => {
    let projectName = "ExampleProject-" + userName
    axios({
        method: 'post',
        url: backendRoutes.ADD_PROJECT_URL + "example",
        data: {
            userName: userName,
            projectName: projectName
        }
    })
        .then(result => {
            if (result.status == 200) {
                navigate(createEditUrl(userName, projectName, userName))
            } else {
                console.log(result)
            }
        })
        .catch(console.log);
}
export default function ProjectsPage() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const { userName } = useParams()
    let user = userName

    if (token || (token == userName)) {
        if (!userName) {
            user = token
        }
        const PROJECTS_URL = backendRoutes.PROJECTS_URL + user + "/"

        const [loading, setLoading] = useState(true);
        const [projects, setProjects] = useState([]);

        useEffect(() => {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const result = await axios(PROJECTS_URL,);
                    setProjects(result.data.sort((a, b) => (a.create_time > b.create_time) ? 1 : -1));
                    setLoading(false);
                } catch (err) {
                    setLoading(false);
                    alert(err)
                }
            };
            fetchData();
        }, []);

        return (
            <div>
                {loading && <Loading />}
                {!loading &&
                    <Box
                        sx={{ width: 1, p: 7 }}
                    >
                        <Stack direction="column" alignItems="left" justifyContent="space-between" spacing={2}>
                            {
                                !projects.map(p => p.name).includes(`ExampleProject-${userName}`) &&
                                <Button variant="outlined" onClick={() => addExample(userName, navigate)}>
                                    Add an exmaple project?
                                </Button>
                            }

                            <Grid container direction="row" spacing={2}>
                                {Array.isArray(projects) && projects.length > 0 && projects.map((project, index) => (
                                    <Grid item xs={3} key={index}>
                                        <ProjectCard
                                            project={project}
                                            user={user}
                                            key={project.id}
                                            setProjects={setProjects}
                                            projects={projects}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                            <Tooltip title="Create New Project">
                                <Fab
                                    color="secondary"
                                    aria-label="add"
                                    onClick={() => { navigate(createAddProjectUrl(user)) }}
                                    sx={{
                                        borderRadius: 0,
                                        borderTopLeftRadius: '50%',
                                        borderBottomLeftRadius: '50%',
                                        borderTopRightRadius: '50%',
                                        borderBottomRightRadius: '50%',
                                        position: 'fixed',
                                        right: 10,
                                        bottom: 10
                                    }}
                                >
                                    <AddIcon />
                                </Fab>
                            </Tooltip>
                        </Stack >
                    </Box>}
            </div>)
    } else { return <NoAccess /> }
}
