import React from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import sha256 from 'crypto-js/sha256';

// project imports
import useScriptRef from '../../hooks/useScriptRef';
import AnimateButton from '../../ui-component/extended/AnimateButton';
import backendRoutes from '../../backendRoutes';
import useToken from '../../hooks/useToekn';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { createProjectsUrl } from '../../frontendRoutes';

function hash(pw) {
    const nonce = ""
    return sha256(nonce + pw).toString()
}

// ============================|| LOGIN ||============================ //

const AuthenticateLogin = ({ ...others }) => {

    const theme = useTheme();
    const scriptedRef = useScriptRef();

    const navigate = useNavigate()

    const savedToken = localStorage.getItem('token');
    if (savedToken) {
        navigate(createProjectsUrl(savedToken))
    } //todo: to check

    const { token, setToken } = useToken();

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSignIn = (values) => {
        axios({
            method: 'post',
            url: backendRoutes.LOGIN_URL,
            data: {
                email: values.email,
                password: hash(values.password)
            }
        })
            .then(res => {
                if (res.data.message == "Success") {
                    let userName = res.data.user
                    setToken(res.data.user)
                    navigate(createProjectsUrl(userName))
                } else {
                    alert(res.data.message)
                } 
            })
            .catch(err => {
                console.log(err)
            });
    };

    return (
        <>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Sign in with Email address</Typography>
                    </Box>
                </Grid>
            </Grid>

            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    password: Yup.string().max(255).required('Password is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        if (scriptedRef.current) {
                            handleSignIn(values)
                            setStatus({ success: true });
                            setSubmitting(false);
                        }
                    } catch (err) {
                        alert(err)
                        if (scriptedRef.current) {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
                        }
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <Stack spacing={2}>
                            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                                <InputLabel htmlFor="outlined-adornment-email-login">Email Address</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-email-login"
                                    autoComplete="username"
                                    type="email"
                                    value={values.email}
                                    name="email"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    label="Email Address / Username"
                                    inputProps={{}}
                                />
                                {touched.email && errors.email && (
                                    <FormHelperText error id="standard-weight-helper-text-email-login">
                                        {errors.email}
                                    </FormHelperText>
                                )}
                            </FormControl>

                            <FormControl
                                fullWidth
                                error={Boolean(touched.password && errors.password)}
                                sx={{ ...theme.typography.customInput }}
                            >
                                <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password-login"
                                    autoComplete="current-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={values.password}
                                    name="password"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                size="large"
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"
                                    inputProps={{}}
                                />
                                {touched.password && errors.password && (
                                    <FormHelperText error id="standard-weight-helper-text-password-login">
                                        {errors.password}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Stack>

                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                >
                                    Log in
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default AuthenticateLogin;
