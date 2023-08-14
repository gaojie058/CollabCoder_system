import { createTheme } from '@mui/material/styles';

/* light */
const primary_light = '#4359a9';
const on_primary_light = '#ffffff';
const primary_container_light = '#dce1ff';
const on_primary_container_light = '#001551';
const secondary_light = '#7286d3';
const on_secondary_light = '#ffffff';
const secondary_container_light = '#dee1f9';
const on_secondary_container_light = '#161b2c';
const tertiary_light = '#75546f';
const on_tertiary_light = '#ffffff';
const tertiary_container_light = '#ffd7f5';
const on_tertiary_container_light = '#2c1229';
const error_light = '#ba1a1a';
const error_container_light = '#ffdad6';
const on_error_light = '#ffffff';
const on_error_container_light = '#410002';
const background_light = '#fefbff';
const on_background_light = '#1b1b1f';
const surface_light = '#fefbff';
const on_surface_light = '#1b1b1f';
const surface_variant_light = '#e2e1ec';
const on_surface_variant_light = '#45464f';
const outline_light = '#767680';
const inverse_on_surface_light = '#f2f0f4';
const inverse_surface_light = '#303034';
const inverse_primary_light = '#b6c4ff';
const shadow_light = '#000000';
const surface_tint_light = '#4359a9';
const outline_variant_light = '#c6c5d0';
const scrim_light = '#000000';

/* dark */
const primary_dark = '#b6c4ff';
const on_primary_dark = '#0b2978';
const primary_container_dark = '#294190';
const on_primary_container_dark = '#dce1ff';
const secondary_dark = '#c2c5dd';
const on_secondary_dark = '#2b3042';
const secondary_container_dark = '#424659';
const on_secondary_container_dark = '#dee1f9';
const tertiary_dark = '#e3bada';
const on_tertiary_dark = '#43273f';
const tertiary_container_dark = '#5b3d57';
const on_tertiary_container_dark = '#ffd7f5';
const error_dark = '#ffb4ab';
const error_container_dark = '#93000a';
const on_error_dark = '#690005';
const on_error_container_dark = '#ffdad6';
const background_dark = '#1b1b1f';
const on_background_dark = '#e4e1e6';
const surface_dark = '#1b1b1f';
const on_surface_dark = '#e4e1e6';
const surface_variant_dark = '#45464f';
const on_surface_variant_dark = '#c6c5d0';
const outline_dark = '#90909a';
const inverse_on_surface_dark = '#1b1b1f';
const inverse_surface_dark = '#e4e1e6';
const inverse_primary_dark = '#4359a9';
const shadow_dark = '#000000';
const surface_tint_dark = '#b6c4ff';
const outline_variant_dark = '#45464f';
const scrim_dark = '#000000';


// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: primary_light,
      light: primary_light,
      dark: primary_dark,
    },
    on_primary: {
      main: on_primary_light,
      light: on_primary_light,
      dark: on_primary_dark,
    },
    primary_container: {
      main: primary_container_light,
      light: primary_container_light,
      dark: primary_container_dark,
    },
    on_primary_container: {
      main: on_primary_container_light,
      light: on_primary_container_light,
      dark: on_primary_container_dark,
    },
    secondary: {
      main: secondary_light,
      light: secondary_light,
      dark: secondary_dark,
    },
    on_secondary: {
      main: on_secondary_light,
      light: on_secondary_light,
      dark: on_secondary_dark,
    },
    secondary_container: {
      main: secondary_container_light,
      light: secondary_container_light,
      dark: secondary_container_dark,
    },
    on_secondary_container: {
      main: on_secondary_container_light,
      light: on_secondary_container_light,
      dark: on_secondary_container_dark,
    },
    tertiary: {
      main: tertiary_light,
      light: tertiary_light,
      dark: tertiary_dark,
    },
    on_tertiary: {
      main: on_tertiary_light,
      light: on_tertiary_light,
      dark: on_tertiary_dark,
    },
    tertiary_container: {
      main: tertiary_container_light,
      light: tertiary_container_light,
      dark: tertiary_container_dark,
    },
    on_tertiary_container: {
      main: on_tertiary_container_light,
      light: on_tertiary_container_light,
      dark: on_tertiary_container_dark,
    },
    error: {
      main: error_light,
      light: error_light,
      dark: error_dark,
    },
    on_error: {
      main: on_error_light,
      light: on_error_light,
      dark: on_error_dark,
    },
    error_container: {
      main: error_container_light,
      light: error_container_light,
      dark: error_container_dark,
    },
    on_error_container: {
      main: on_error_container_light,
      light: on_error_container_light,
      dark: on_error_container_dark,
    },
    outline: {
      main: outline_light,
      light: outline_light,
      dark: outline_dark,
    },
    background: {
      main: background_light,
      light: background_light,
      dark: background_dark,
    },
    on_background: {
      main: on_background_light,
      light: on_background_light,
      dark: on_background_dark,
    },
    surface: {
      main: surface_light,
      light: surface_light,
      dark: surface_dark,
    },
    on_surface: {
      main: on_surface_light,
      light: on_surface_light,
      dark: on_surface_dark,
    },
    surface_variant: {
      main: surface_variant_light,
      light: surface_variant_light,
      dark: surface_variant_dark,
    },
    on_surface_variant: {
      main: on_surface_variant_light,
      light: on_surface_variant_light,
      dark: on_surface_variant_dark,
    },
    inverse_surface: {
      main: inverse_surface_light,
      light: inverse_surface_light,
      dark: inverse_surface_dark,
    },
    inverse_on_surface: {
      main: inverse_on_surface_light,
      light: inverse_on_surface_light,
      dark: inverse_on_surface_dark,
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Raleway',
      'Open Sans',
      'Times New Roman',
    ].join(','),
    fontSize: 12,
    h6: {
      fontWeight: 400,
      fontSize: '0.75rem',
      fontFamily: 'Roboto',
    },
    h5: {
      fontSize: '0.875rem',
      fontWeight: 400,
      fontFamily: 'Roboto',
    },
    h4: {
      fontSize: '1rem',
      fontWeight: 450,
      fontFamily: 'Roboto',
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 500,
      fontFamily: 'Roboto',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
      fontFamily: 'Open Sans',
    },
    h1: {
      fontSize: '2.125rem',
      fontWeight: 600,
      fontFamily: 'Raleway',
    },
    subtitle1: {
      fontSize: '0.875rem',
      fontWeight: 500,
      fontFamily: 'Roboto',
    },
    subtitle2: {
      fontSize: '0.75rem',
      fontWeight: 400,
      fontFamily: 'Roboto',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      fontFamily: 'Roboto',
    },
    body1: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: '1.334em',
      fontFamily: 'Roboto',
    },
    body2: {
      letterSpacing: '0em',
      fontWeight: 400,
      lineHeight: '1.5em',
      fontFamily: 'Roboto',
    },
    button: {
      textTransform: 'capitalize',
      fontFamily: 'Roboto',
    },
    caption: {
      fontSize: '0.75rem',
      fontFamily: 'Roboto',
    },
    overline: {
      fontSize: '0.75rem',
      fontFamily: 'Roboto',
    },
  },
});

export default theme;
