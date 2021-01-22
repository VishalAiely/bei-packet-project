import React, { FunctionComponent } from 'react';
import { Box, AppBar, Typography, Toolbar } from '@material-ui/core';
import AppContext from 'components/AppContext';

const NavBar: FunctionComponent = () => {
  const { classes } = React.useContext(AppContext);

  return (
    <Box p={3}>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <Typography variant="h5" className={classes?.title}>
            Brain Exercise Initiative Packet Generator
          </Typography>
          <Typography variant="h6">
            By{' '}
            <a
              href="https://github.com/VishalAiely"
              style={{ color: '#fff', textDecoration: 'none' }}
              target="_blank"
              rel="noreferrer">
              Vishal Aiely
            </a>
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
