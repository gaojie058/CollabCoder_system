import React from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Typography} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios'

// project imports
import useScriptRef from '../../hooks/useScriptRef';
import AnimateButton from '../../ui-component/extended/AnimateButton';
import backendRoutes from '../../backendRoutes';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Stack } from '@mui/system';
import { createProjectsUrl } from '../../frontendRoutes';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const FirebaseRegister = ({ ...others }) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);
    const nameRegex = /^[A-Za-z0-9]+$/;

    const handleRegister = (values) => {
        axios({
            method: 'post',
            url: backendRoutes.REGISTER_URL,
            data: {
                user_name: values.user_name,
                email: values.email,
                password: values.password
            }
        })
            .then(res => {
                if (res.data.status == "error") {
                    alert(res.data.error)
                    localStorage.removeItem("token")
                } else {
                    navigate(createProjectsUrl(values.user_name))
                }
            })
            .catch(err => {
                console.log(err)
            });
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Sign up with Email address</Typography>
                    </Box>
                </Grid>
            </Grid>

            <Formik
                initialValues={{
                    user_name: '',
                    email: '',
                    password: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    user_name: Yup.string().matches(nameRegex, "English letters or digits only").max(255).required('User name is required'),
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    password: Yup.string().max(255).required('Password is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        if (scriptedRef.current) {
                            handleRegister(values)
                            localStorage.setItem("token", values.user_name)
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
                            <FormControl
                                fullWidth
                                error={Boolean(touched.user_name && errors.user_name)}
                                sx={{ ...theme.typography.customInput }}>
                                <InputLabel htmlFor="outlined-adornment-user_name-register">Username</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-user_name-register"
                                    autoComplete="username"
                                    type="text"
                                    value={values.user_name}
                                    name="user_name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    inputProps={{}}
                                />
                                {touched.user_name && errors.user_name && (
                                    <FormHelperText error id="standard-weight-helper-text--register">
                                        {errors.user_name}
                                    </FormHelperText>
                                )}
                            </FormControl>

                            <FormControl
                                fullWidth
                                error={Boolean(touched.email && errors.email)}
                                sx={{ ...theme.typography.customInput }}>
                                <InputLabel htmlFor="outlined-adornment-email-register">Email Address</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-email-register"
                                    autoComplete="email"
                                    type="email"
                                    value={values.email}
                                    name="email"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    inputProps={{}}
                                />
                                {touched.email && errors.email && (
                                    <FormHelperText error id="standard-weight-helper-text--register">
                                        {errors.email}
                                    </FormHelperText>
                                )}
                            </FormControl>

                            <FormControl
                                fullWidth
                                error={Boolean(touched.password && errors.password)}
                                sx={{ ...theme.typography.customInput }}
                            >
                                <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
                                <OutlinedInput
                                    autoComplete="new-password"
                                    id="outlined-adornment-password-register"
                                    type={showPassword ? 'text' : 'password'}
                                    value={values.password}
                                    name="password"
                                    label="Password"
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
                                    inputProps={{}}
                                />
                                {touched.password && errors.password && (
                                    <FormHelperText error id="standard-weight-helper-text-password-register">
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
                                    Register
                                </Button>

                            </AnimateButton>


                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default FirebaseRegister;
