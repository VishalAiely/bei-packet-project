import React, { FunctionComponent } from 'react';
import { AppBar, Typography, Toolbar } from '@material-ui/core';
import AppContext from 'components/AppContext';

const NavBar: FunctionComponent = () => {
  const { classes } = React.useContext(AppContext);

  return (
    <AppBar position="static" color="transparent" style={{ marginTop: 70, paddingBottom: 20 }}>
      <Toolbar>
        <Typography variant="body2" className={classes?.title} style={{ marginLeft: 50 }}>
          Partnered with{' '}
          <a
            href="https://www.linkedin.com/in/selenaxue/"
            style={{ color: '#fff', textDecoration: 'none' }}
            target="_blank"
            rel="noreferrer">
            Selena Xue
          </a>{' '}
          from BEI UTK
        </Typography>
        <Typography variant="body2" className={classes?.title} style={{ textAlign: 'right', marginRight: 50 }}>
          <a
            href="mailto:vaiely@vols.utk.edu"
            style={{ color: '#fff', textDecoration: 'none' }}
            target="_blank"
            rel="noreferrer">
            Contact Me
          </a>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
