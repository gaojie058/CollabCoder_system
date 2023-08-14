import React from "react";
import { Box, Grid, CircularProgress } from '@mui/material';

export default function Loading() {
    return (
        <Box sx={{ margin: { xs: 2.5, md: 30 }, }}>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box sx={{ mb: 2 }}>
                        <CircularProgress disableShrink />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}
