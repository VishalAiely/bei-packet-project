import React, { FunctionComponent } from 'react';
import { AppBar, Typography, Toolbar } from '@material-ui/core';
import AppContext from 'components/AppContext';

const NavBar: FunctionComponent = () => {
  const { classes } = React.useContext(AppContext);

  return (
    <AppBar position="static" color="transparent" style={{ marginTop: 20 }}>
      <Toolbar>
        <Typography variant="body2" className={classes?.title} style={{ marginLeft: 100 }}>
          Partnered with Selena Xue from BEI UTK
        </Typography>
        <Typography variant="body2" className={classes?.title} style={{ textAlign: 'right', marginRight: 100 }}>
          <a href="mailto:vaiely@vols.utk.edu" style={{ color: '#fff', textDecoration: 'none' }}>
            Contact Me
          </a>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
