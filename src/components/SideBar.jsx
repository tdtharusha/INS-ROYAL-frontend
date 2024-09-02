import React, { useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemIcon,
  Box,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Home, People, ShoppingCart, Inventory } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 160;
const miniDrawerWidth = 40;

const SideBar = ({ hideSidebar }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const drawerContent = (
    <List>
      <LinkContainer to='/summary'>
        <ListItem button>
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          {open && !isSmallScreen && <ListItemText primary='Summary' />}
        </ListItem>
      </LinkContainer>
      <LinkContainer to='/users-list'>
        <ListItem button>
          <ListItemIcon>
            <People />
          </ListItemIcon>
          {open && !isSmallScreen && <ListItemText primary='Users' />}
        </ListItem>
      </LinkContainer>
      <LinkContainer to='/brands'>
        <ListItem button>
          <ListItemIcon>
            <Inventory />
          </ListItemIcon>
          {open && !isSmallScreen && <ListItemText primary='Brands' />}
        </ListItem>
      </LinkContainer>
      <LinkContainer to='/products-list'>
        <ListItem button>
          <ListItemIcon>
            <ShoppingCart />
          </ListItemIcon>
          {open && !isSmallScreen && <ListItemText primary='Products' />}
        </ListItem>
      </LinkContainer>
      <LinkContainer to='/orders'>
        <ListItem button>
          <ListItemIcon>
            <Inventory />
          </ListItemIcon>
          {open && !isSmallScreen && <ListItemText primary='Orders' />}
        </ListItem>
      </LinkContainer>
      <LinkContainer to='/suppliers'>
        <ListItem button>
          <ListItemIcon>
            <People />
          </ListItemIcon>
          {open && !isSmallScreen && <ListItemText primary='Suppliers' />}
        </ListItem>
      </LinkContainer>
      <LinkContainer to='/grns'>
        <ListItem button>
          <ListItemIcon>
            <ShoppingCart />
          </ListItemIcon>
          {open && !isSmallScreen && <ListItemText primary='GRN' />}
        </ListItem>
      </LinkContainer>
      <LinkContainer to='/pre-made-foods-inventory'>
        <ListItem button>
          <ListItemIcon>
            <Inventory />
          </ListItemIcon>
          {open && !isSmallScreen && (
            <ListItemText primary='Pre-made-foods-inventory' />
          )}
        </ListItem>
      </LinkContainer>
      <LinkContainer to='/materials'>
        <ListItem button>
          <ListItemIcon>
            <Inventory />
          </ListItemIcon>
          {open && !isSmallScreen && <ListItemText primary='Materials' />}
        </ListItem>
      </LinkContainer>
      <LinkContainer to='/in-house-foods-inventory'>
        <ListItem button>
          <ListItemIcon>
            <Inventory />
          </ListItemIcon>
          {open && !isSmallScreen && (
            <ListItemText primary='In-house-foods-inventory' />
          )}
        </ListItem>
      </LinkContainer>
      <LinkContainer to='/recipes'>
        <ListItem button>
          <ListItemIcon>
            <ShoppingCart />
          </ListItemIcon>
          {open && !isSmallScreen && <ListItemText primary='Food Recipes' />}
        </ListItem>
      </LinkContainer>
      <LinkContainer to='/dailyProducts'>
        <ListItem button>
          <ListItemIcon>
            <Inventory />
          </ListItemIcon>
          {open && !isSmallScreen && (
            <ListItemText primary='Daily Available Products' />
          )}
        </ListItem>
      </LinkContainer>
      <LinkContainer to='/reports'>
        <ListItem button>
          <ListItemIcon>
            <Inventory />
          </ListItemIcon>
          {open && !isSmallScreen && <ListItemText primary='Reports' />}
        </ListItem>
      </LinkContainer>
      <LinkContainer to='/notifications'>
        <ListItem button>
          <ListItemIcon>
            <People />
          </ListItemIcon>
          {open && !isSmallScreen && <ListItemText primary='Notifications' />}
        </ListItem>
      </LinkContainer>
    </List>
  );

  return (
    <Box sx={{ display: hideSidebar && isSmallScreen ? 'none' : 'flex' }}>
      <IconButton
        onClick={toggleDrawer}
        sx={{
          position: 'fixed',
          zIndex: 1400,
          top: '60px',
          left: open ? `${drawerWidth - 30}px` : `${miniDrawerWidth - 30}px`,
          transition: 'left 0.3s',
        }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        variant={isSmallScreen ? 'temporary' : 'permanent'}
        anchor='left'
        open={open}
        onClose={toggleDrawer}
        sx={{
          width: open ? drawerWidth : miniDrawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : miniDrawerWidth,
            boxSizing: 'border-box',
            transition: 'width 0.3s',
            overflowX: 'hidden',
            top: '70px',
            height: 'calc(100vh - 70px)',
          },
        }}
      >
        <Toolbar />
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default SideBar;
