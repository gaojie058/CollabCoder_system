import * as React from 'react';
import { createCodebookUrl, createEditUrl, createTeamUrl } from '../frontendRoutes';
import { Card, CardActions, CardContent, Button, Typography, IconButton, Tooltip } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import EditIcon from '@mui/icons-material/Edit';
import BookIcon from '@mui/icons-material/Book';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import backendRoutes from '../backendRoutes';

export default function ProjectCard(props) {
    let project = props.project
    let userName = props.user
    let setProjects = props.setProjects //function
    let projects = props.projects
    const navigate = useNavigate()

    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [removeDocName, setRemoveDocName] = React.useState("");

    const handleRemoveProject = async (project) => {
        const res = await axios.delete(backendRoutes.PROJECT_URL + project.owner + "/" + project.name + "/")
        if (res.data.deletedCount == 1) {
            alert("Successfully removed project!")
            let newProjects = projects.slice(0)
            newProjects.splice(projects.indexOf(project), 1)
            setProjects(newProjects)
        } else {
            alert("Failed removing project!")
        }

    };

    const handleDialogOpen = (project) => {
        setDialogOpen(true);
        setRemoveDocName(project);
    };

    const handleDialogClose = (remove, project) => {
        setDialogOpen(false);
        if (remove && userName == project.owner) {
            handleRemoveProject(project)
        } else if (userName != project.owner) {
            alert(`Only project owner ${project.owner}can remove this project.`)
        }
    };

    return (
        <Card sx={{ minWidth: 250, minHeight: 200 }}>
            <CardContent>
                <Tooltip title={project.name}>
                    <Typography variant="h3" component="div" noWrap>
                        {project.name}
                    </Typography>
                </Tooltip>

                <Typography variant="body1" sx={{ mb: 1.5, mt: 1 }} color="text.secondary">
                    Owner: {project.owner}
                </Typography>
                <Typography variant="body1">
                    Created: {project.create_time}
                </Typography>
                <Typography variant="body1">
                    {project.coding_level}
                </Typography>

            </CardContent>
            <CardActions disableSpacing>
                <Tooltip title="Edit">
                    <IconButton aria-label="edit" onClick={() => { navigate(createEditUrl(project.owner, project.name, userName)) }}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Compare">
                    <IconButton aria-label="compare" onClick={() => { navigate(createTeamUrl(project.owner, project.name, userName)) }}>
                        <CompareArrowsIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Codebook">
                    <IconButton aria-label="codebook" onClick={() => { navigate(createCodebookUrl(project.owner, project.name, userName)) }}>
                        <BookIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton aria-label="delete" onClick={() => handleDialogOpen(project.name)} >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </CardActions>

            <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {`Remove ${removeDocName}?`}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This will remove all contentes of this project.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleDialogClose(false, undefined)}>Cancel</Button>
                    <Button onClick={() => handleDialogClose(true, project)} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Card >
    );
}
