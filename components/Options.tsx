import { Box, Container, Typography } from '@material-ui/core';
import React, { FunctionComponent } from 'react';

type OptionsProps = {
  classes: Record<string, string>;
};

const Options: FunctionComponent<OptionsProps> = ({ classes, children }) => {
  return (
    <Box p={6}>
      <Container maxWidth="md">
        <Typography className={classes.formControl} variant="h4">
          Options
        </Typography>
        {children}
      </Container>
    </Box>
  );
};

export default Options;
