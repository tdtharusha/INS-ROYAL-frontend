import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import SideBar from './SideBar';

const SidebarLayout = () => {
  const [headerDrawerOpen, setHeaderDrawerOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const drawerWidth = 160;
  const miniDrawerWidth = 40;

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <SideBar hideSidebar={headerDrawerOpen && isSmallScreen} />
        <Box
          component='main'
          sx={{
            flexGrow: 1,
            marginLeft: isSmallScreen ? 0 : `${miniDrawerWidth}px`,
            transition: 'margin-left 0.3s',
            width: `calc(100% - ${isSmallScreen ? 0 : miniDrawerWidth}px)`,
          }}
        >
          <Toolbar />
          <Container className='my-2'>
            <Outlet />
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default SidebarLayout;
