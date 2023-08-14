import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { createProfileUrl, createProjectsUrl, frontendRoutes } from '../frontendRoutes';
import { Stack } from '@mui/system';
import Logo from './Logo';
import { useNavigate } from "react-router-dom";
import stringAvatar from './StringAvatar'


function AicoderAppBar() {
  const token = localStorage.getItem('token')

  let settings
  let userName
  let pages = []

  if (token) {
    userName = token.replace("\"", "").replace("\"", "")
    pages = [
      { title: 'Projects', url: createProjectsUrl(userName) },
      { title: 'Profile', url: createProfileUrl(userName) },
    ]
    settings = [
      { title: 'Logout', url: frontendRoutes.LOGOUT_URL }
    ]
  }

  const navigate = useNavigate()
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);


  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" color="secondary" >
      <Container maxWidth="l">
        <Toolbar disableGutters variant='regular'>
          <Logo variant={"white"} />
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="Medium"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.title} onClick={() => {
                  handleCloseNavMenu()
                  navigate(page.url)
                }}>
                  <Typography textAlign="center" >{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                onClick={() => {
                  handleCloseNavMenu()
                  navigate(page.url)
                }}
                sx={{ my: 1, color: 'white', display: 'block' }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          {token && <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar {...stringAvatar(userName)} />
            </IconButton>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.title} onClick={() => {
                  handleCloseUserMenu()
                  navigate(setting.url)
                }}>
                  <Typography textAlign="center">{setting.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>}
          {!token && <Box sx={{ flexGrow: 0 }}>
            <Stack direction="row">
              <Button color='background' component='a' href={frontendRoutes.LOGIN_URL}>
                Login
              </Button>
              <Button color='background' component='a' href={frontendRoutes.REGISTER_URL}>
                Register
              </Button>
            </Stack>
          </Box>}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default AicoderAppBar;
