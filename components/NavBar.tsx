import React, { FunctionComponent } from 'react';
import { Box, AppBar, Typography, Toolbar } from '@material-ui/core';

type NavBarProps = {
  classes: Record<string, string>;
};

const NavBar: FunctionComponent<NavBarProps> = ({ classes }) => {
  return (
    <Box p={3}>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h5" className={classes.title}>
            Brain Exercise Initiative Packet Generator
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
