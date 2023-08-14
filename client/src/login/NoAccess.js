import React from "react";
import { Box, Typography } from '@mui/material';

export default function NoAccess() {
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
            <Typography variant="h6" component="h1" gutterBottom>
                You do not have access to this page. Please log in.
            </Typography>

        </Box>
    )
}