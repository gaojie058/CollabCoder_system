import React from "react";
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
    let msg = ''
    if (localStorage.getItem('token')) {
        msg = "You have successfully logged out."
    } else {
        msg = "You have not logged in yet."
    }
    localStorage.clear()
    const navigate = useNavigate()
    return (
        <Box
            sx={{
                maxWidth: { xs: 500, lg: 600 },
                margin: { xs: 2.5, md: 3 },
                '& > *': {
                    flexGrow: 1,
                    flexBasis: '50%'
                }
            }}>
            <Typography variant="body1" gutterBottom>
                {msg}
            </Typography>
            <Button variant='contained' onClick={() => { navigate('/login') }}>
                Login
            </Button>


        </Box>
    )
}
