import { Stack } from "@mui/material";
import React from "react";
import logo_white from '../assets/images/logo-white.svg';
import text_white from '../assets/images/DiffCoder-white.svg';
import logo_blue from '../assets/images/logo-blue.svg';
import text_blue from '../assets/images/DiffCoder-blue.svg';
// ==============================|| LOGO SVG ||============================== //

const Logo = (props) => {

    let src_logo
    let src_text

    if (props.variant == "white") {
        src_logo = logo_white
        src_text = text_white
    } else if (props.variant == "blue") {
        src_logo = logo_blue
        src_text = text_blue
    } else {
        src_logo = logo_blue
        src_text = text_blue
    }

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{ mr: 1 }}
            component="a"
            href="/" >
            <img src={src_logo} alt="Logo" width="32" />
            <img src={src_text} alt="Logo" width="70" />
        </Stack>
    );
};

export default Logo;
