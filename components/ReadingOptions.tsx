import React, { FunctionComponent } from 'react';
import DocumentGen from 'client/document';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Grid,
  Typography,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';

type ReadingOptionsProps = {
  classes: Record<string, string>;
  docs: DocumentGen;
  disabled: boolean;
  expanded: boolean;
  changeExpanded: (value: React.SetStateAction<boolean>) => void;
};

const ReadingOptions: FunctionComponent<ReadingOptionsProps> = ({
  classes,
  docs,
  disabled,
  expanded,
  changeExpanded,
}) => {
  return (
    <Accordion disabled={disabled} expanded={expanded}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel3c-content"
        id="panel3a-header"
        onClick={() => {
          changeExpanded(!expanded);
        }}>
        <Typography className={classes.heading}>Reading</Typography>
        <Typography className={classes.secondaryHeading}>View Reading Passage and Adjust Settings</Typography>
      </AccordionSummary>
      <Box p={2}>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid container item spacing={2} sm={7}>
              <Grid item sm={12}>
                <Typography variant="h6">Options</Typography>
              </Grid>
            </Grid>
            <Box p={3}>
              <Divider orientation="vertical" />
            </Box>
            <Grid container item spacing={2} sm={4}>
              <Grid item sm={10}>
                <Typography variant="h6">Reading Passage</Typography>
              </Grid>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Box>
      <Divider />
      <AccordionActions>
        <Button variant="contained" size="small" color="primary">
          Regenerate
        </Button>
      </AccordionActions>
    </Accordion>
  );
};

export default ReadingOptions;
