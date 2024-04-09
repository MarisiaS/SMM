import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import {Link, useLocation} from 'react-router-dom'
const drawerWidth = 240;

export default function NavBar(props) {
  const {content} = props
  const location = useLocation()
  const path = location.pathname
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Swim Meet Manager
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', backgroundColor: 'ghostwhite'},
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto'}}>
          <List>
              <ListItem key={1} disablePadding>
                <ListItemButton component = {Link} to ="/home" selected={"/home" === path}>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Home"} />
                </ListItemButton>
              </ListItem>

              <ListItem key={2} disablePadding>
                <ListItemButton component = {Link} to ="/athlete" selected={"/athlete" === path}>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Athlete"} />
                </ListItemButton>
              </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
           {content}
      </Box>
    </Box>
  );
}
