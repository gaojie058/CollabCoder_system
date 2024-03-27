import * as React from 'react';
import { Box, CssBaseline, Stack } from '@mui/material';
import AicoderAppBar from './AppBar';
import useUserStore from '../stores/useUserStore';
import Loading from './Loading';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = (props) => {
    const status = useUserStore((state) => state.status)


    if (status) {
        return (
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Stack style={{ width: "100%" }}>
                    <AicoderAppBar />
                    {props.content}
                </Stack>
            </Box>
        );
    } else {
        return (
            <Loading />
        )
    }
};

export default MainLayout;
