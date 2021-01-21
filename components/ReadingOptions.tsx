import React, { FunctionComponent } from 'react';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import AppContext from './AppContext';
import { Story } from 'server/Story';
import urls from 'utils/urls';
import { Autocomplete } from '@material-ui/lab';

type ReadingOptionsProps = {
  disabled: boolean;
  expanded: boolean;
  changeExpanded: (value: React.SetStateAction<boolean>) => void;
};

const ReadingOptions: FunctionComponent<ReadingOptionsProps> = ({ disabled, expanded, changeExpanded }) => {
  // Global State
  const { docs, classes } = React.useContext(AppContext);

  // Options State
  const [category, setCategory] = React.useState<string>('');
  const [allCategories] = React.useState<string[]>(['Greatest', 'Children']);

  const [storyName, setStoryName] = React.useState('');
  const [allStoryNames, setAllStoryNames] = React.useState<string[]>([]);

  // Story State
  const [storyData, setStoryData] = React.useState<Story>({
    title: 'Title',
    author: 'Author',
    image: '',
    story: [],
    category: '',
    link: '',
  });
  React.useEffect(() => {
    const gatherInfo = async () => {
      const allNames = await fetch(urls.api.allStoryNames);
      setAllStoryNames((await allNames.json()) as string[]);

      setStoryData(await docs.genReading());
    };
    void gatherInfo();
  }, []);

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
            <Grid container item spacing={2} sm={4}>
              <Grid item sm={12}>
                <Typography variant="h6">Options</Typography>
                <Box paddingTop={2}>
                  <Divider />
                </Box>
              </Grid>
              <Grid item sm={12}>
                <Autocomplete
                  id="categoryautoStory"
                  value={category}
                  onChange={async (event: any, newValue: string | null) => {
                    setCategory(newValue ?? '');
                    docs.setReadingCategory(newValue ?? '');

                    const storiesResp = await fetch(urls.api.storyNamesInCategory, {
                      method: 'POST',
                      body: newValue,
                    });
                    const storyNamesInCategory = (await storiesResp.json()) as string[];
                    setAllStoryNames(storyNamesInCategory);
                  }}
                  options={allCategories}
                  renderInput={params => <TextField {...params} label="Category" variant="outlined" />}
                />
              </Grid>
              <Grid item sm={12}>
                <Autocomplete
                  id="storyName"
                  value={storyName}
                  onChange={(event: any, newValue: string | null) => {
                    docs.setStoryName(newValue ?? '');
                    setStoryName(newValue ?? '');
                  }}
                  options={allStoryNames}
                  renderInput={params => <TextField {...params} label="Story Name" variant="outlined" />}
                />
              </Grid>
            </Grid>
            <Box p={3}>
              <Divider orientation="vertical" />
            </Box>
            <Grid container item spacing={2} sm={7} justify="center">
              <Grid item sm={12}>
                <Typography variant="h6">Reading Passage</Typography>
                <Box paddingTop={2}>
                  <Divider />
                </Box>
              </Grid>
              <Grid item sm={12}>
                <a
                  href={storyData.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'inherit', textDecoration: 'none' }}>
                  <Typography variant="h5">{storyData.title}</Typography>
                </a>
              </Grid>
              {storyData.author !== '' && (
                <Grid item sm={12}>
                  <Typography variant="subtitle1">{`by ${storyData.author}`}</Typography>
                </Grid>
              )}
              <Grid item sm={12}>
                <img src={storyData.image} alt="Story" width={225}></img>
              </Grid>
              <Grid item sm={12}>
                <Typography variant="subtitle2">{`Paragraphs: ${storyData.story.length}`}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Box>
      <Divider />
      <AccordionActions>
        <Button
          variant="outlined"
          size="small"
          color="inherit"
          onClick={async () => {
            setStoryData(await docs.genReading());
          }}>
          Regenerate
        </Button>
      </AccordionActions>
    </Accordion>
  );
};

export default ReadingOptions;
