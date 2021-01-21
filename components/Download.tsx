import React, { FunctionComponent } from 'react';
import DocumentGen, { sections } from 'client/document';
import { Box, Button, Container, Grid, Paper, Typography } from '@material-ui/core';

type DownloadProps = {
  classes: Record<string, string>;
  docs: DocumentGen;
  sectionOrder: sections[];
};

const Download: FunctionComponent<DownloadProps> = ({ classes, docs, sectionOrder }) => {
  return (
    <Box p={6}>
      <Container maxWidth="xs">
        <Typography className={classes.formControl} variant="h6">
          Download
        </Typography>
        <Paper>
          <Grid container justify="center" spacing={4}>
            <Grid item sm={5}>
              <Button
                variant="contained"
                color="primary"
                className={classes.downloadButton}
                onClick={async () => {
                  docs.makeDoc(sectionOrder);
                  await docs.downloadDoc();
                }}>
                Packet
              </Button>
            </Grid>
            <Grid item sm={5}>
              <Button
                variant="contained"
                color="primary"
                className={classes.downloadButton}
                onClick={async () => {
                  docs.makeDoc(sectionOrder);
                  await docs.downloadDoc();
                }}>
                Answers
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Download;
