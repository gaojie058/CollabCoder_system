import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from '@mui/material';
import { Stack } from "@mui/system";
import axios from 'axios';
import backendRoutes from "../backendRoutes";
import { useParams } from "react-router-dom";
import NoAccess from "../login/NoAccess";
import Loading from "../ui-component/Loading";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ProfilePage() {

    const token = localStorage.getItem('token').replace("\"", "").replace("\"", "");
    const { userName } = useParams()
    const [dialogOpen, setDialogOpen] = useState(false)
    const navigate = useNavigate()

    if (token && (token == userName)) {
        const PROFILE_URL = backendRoutes.PROFILE_URL + userName + "/"

        const [loading, setLoading] = useState(true);
        const [userEmail, setUserEmail] = React.useState("")

        useEffect(() => {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const result = await axios(PROFILE_URL);
                    setUserEmail(result.data.email)
                    setLoading(false);
                } catch (err) {
                    setLoading(false);
                    alert(err)
                }
            };
            fetchData()
        }, []);

        const handleDelete = () => {
            setDialogOpen(false)
            axios({
                method: 'delete',
                url: backendRoutes.REGISTER_URL,
                data: {
                    user_name: userName
                }
            })
                .then(res => {
                    if (res.status == 200) {
                        localStorage.clear()
                        navigate('/')
                    }
                })
                .catch(console.log)
        }

        return (
            <div>
                {loading && <Loading />}
                {!loading &&
                    <Box sx={{ margin: { xs: 2.5, md: 3 }, }}>
                        <Stack maxWidth={400} spacing={2}>
                            <Typography variant="h1" gutterBottom>
                                {userName}
                            </Typography>

                            <Typography variant="body1" gutterBottom>
                                Email: {userEmail}
                            </Typography>
                            <Button
                                variant="contained"
                                sx={{ maxWidth: 200 }}
                                onClick={() => { setDialogOpen(true) }}
                            >
                                Delete this account
                            </Button>
                        </Stack>
                        <Dialog
                            open={dialogOpen}
                            onClose={() => { setDialogOpen(false) }}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title" >
                                <Typography variant="h4">
                                    Are you sure you want to delete this account?
                                </Typography>
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    All your data will be removed from our database.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => { setDialogOpen(false) }}>Cancel</Button>
                                <Button onClick={handleDelete} autoFocus>
                                    Delete
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box >}
            </div>
        )
    } else { return <NoAccess /> }


}


