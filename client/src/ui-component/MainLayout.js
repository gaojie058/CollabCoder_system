import * as React from 'react';
import { Box, CssBaseline, Stack } from '@mui/material';
import AicoderAppBar from './AppBar';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = (props) => {
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Stack style={{ width: "100%" }}>
                <AicoderAppBar />
                {props.content}
            </Stack>

        </Box>
    );
};

export default MainLayout;
