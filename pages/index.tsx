/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Head from 'next/head';
import DocumentGen, { sections } from 'client/document';
import React from 'react';
import { Difficulty, TriviaOptions } from 'utils/types/Trivia';
import {
  Container,
  AppBar,
  Toolbar,
  Box,
  Paper,
  Chip,
  Button,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Typography,
  Divider,
  TextField,
  Slider,
} from '@material-ui/core';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DroppableProvided,
  DropResult,
  resetServerContext,
} from 'react-beautiful-dnd';
import 'fontsource-roboto';
import { ExpandMore } from '@material-ui/icons';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(4),
    },
    downloadButton: {
      margin: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    chipBox: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      listStyle: 'none',
      minHeight: 50,
      padding: theme.spacing(0.5),
      margin: 0,
    },
    chip: {
      margin: theme.spacing(0.5),
    },
    paper: {
      paddingTop: theme.spacing(3),
      padding: theme.spacing(2),
    },
    formControl: {
      marginBottom: theme.spacing(2),
      minWidth: 130,
    },
    heading: {
      fontSize: theme.typography.pxToRem(18),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
  })
);

export default function Home(): JSX.Element {
  const gen = async () => {
    const triviaOps: TriviaOptions = {
      Difficulty: Difficulty.Easy,
      NumberofQuestions: 5,
      Categories: [],
      StrictCategory: false,
    };

    const docs = new DocumentGen(triviaOps);
    const sectionOrder: sections[] = sectionData;
    await docs.genTriviaQuestions();
    docs.genMathQuestions();
    await docs.genReading();
    docs.makeDoc(sectionOrder);
    await docs.downloadDoc();
  };

  const classes = useStyles();
  const allAvailableSections: sections[] = ['Trivia', 'Math', 'Reading'];

  const [sectionData, setSectionData] = React.useState<sections[]>([]);
  const [sectiontoAdd, setAddingSection] = React.useState<sections>('');

  const [tExp, setTExp] = React.useState<boolean>(false);
  const [mExp, setMExp] = React.useState<boolean>(false);
  const [rExp, setRExp] = React.useState<boolean>(false);

  const handleDelete = (index: number) => () => {
    setSectionData(sections => sections.filter((section, ind) => ind !== index));
  };

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    if (event.target.value) setAddingSection(event.target.value as sections);
  };

  const whenDrag = (result: DropResult) => {
    if (!result?.destination) return;

    const items = Array.from(sectionData);
    const [newOrderitem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, newOrderitem);

    setSectionData(items);
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  resetServerContext();

  return (
    <React.Fragment>
      <Head>
        <title>BEI Packet Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxWidth="xl">
        <Box p={3}>
          <AppBar position="static" color="default">
            <Toolbar>
              <Typography variant="h5" className={classes.title}>
                Brain Exercise Initiative Packet Generator
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>

        <Box p={3}>
          <Container maxWidth="md">
            <Typography className={classes.formControl} variant="h4">
              Sections
            </Typography>
            <Paper className={classes.paper}>
              <Grid container spacing={3}>
                <Grid item sm={8}>
                  <DragDropContext onDragEnd={whenDrag}>
                    <Droppable droppableId="sections" direction="horizontal">
                      {(provided: DroppableProvided) => (
                        <Paper
                          component="ul"
                          elevation={3}
                          className={classes.chipBox}
                          ref={provided.innerRef}
                          {...provided.droppableProps}>
                          {sectionData.map((data, ind) => {
                            return (
                              <Draggable key={`${data}${ind}`} draggableId={`${data}${ind}`} index={ind}>
                                {provided => (
                                  <li
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}>
                                    <Chip
                                      color="primary"
                                      label={data}
                                      onDelete={handleDelete(ind)}
                                      className={classes.chip}
                                    />
                                  </li>
                                )}
                              </Draggable>
                            );
                          })}
                          {
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                            provided.placeholder
                          }
                        </Paper>
                      )}
                    </Droppable>
                  </DragDropContext>
                </Grid>
                <Grid item sm={2}>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">Section to Add</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      disabled={sectionData.length === allAvailableSections.length}
                      onChange={handleChange}>
                      {allAvailableSections
                        .filter(val => !sectionData.includes(val))
                        .map((val, ind) => (
                          <MenuItem key={ind} value={val}>
                            {val}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item sm={2}>
                  <Button
                    className={classes.menuButton}
                    variant="contained"
                    color="primary"
                    disabled={sectionData.length === allAvailableSections.length}
                    onClick={() => {
                      if (sectiontoAdd !== '') setSectionData([...sectionData, sectiontoAdd]);
                      switch (sectiontoAdd) {
                        case 'Trivia':
                          setTExp(true);
                          break;
                        case 'Math':
                          setMExp(true);
                          break;
                        case 'Reading':
                          setRExp(true);
                          break;
                        default:
                          break;
                      }
                    }}>
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Container>
        </Box>

        <Box p={6}>
          <Container maxWidth="md">
            <Typography className={classes.formControl} variant="h4">
              Options
            </Typography>
            {/*//! Trivia Options */}
            <Accordion disabled={!sectionData.includes('Trivia')} expanded={sectionData.includes('Trivia') && tExp}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel3c-content"
                id="panel1a-header"
                onClick={() => {
                  setTExp(!tExp);
                }}>
                <Typography className={classes.heading}>Trivia</Typography>
                <Typography className={classes.secondaryHeading}>View Questions and Adjust Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet
                  blandit leo lobortis eget.
                </Typography>
              </AccordionDetails>
            </Accordion>
            {/*//~ Math Options */}
            <Accordion disabled={!sectionData.includes('Math')} expanded={sectionData.includes('Math') && mExp}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel2c-content"
                id="panel2a-header"
                onClick={() => {
                  setMExp(!mExp);
                }}>
                <Typography className={classes.heading}>Math</Typography>
                <Typography className={classes.secondaryHeading}>View Problems and Adjust Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box p={1}>
                  <Grid container spacing={3}>
                    <Grid item sm={7}>
                      <Typography variant="h6">Options</Typography>
                      <br />
                      <TextField id="maxNumber" label="Max Number" color="primary" />
                      <Slider
                        defaultValue={15}
                        aria-labelledby="discrete-slider"
                        valueLabelDisplay="auto"
                        step={3}
                        marks
                        min={9}
                        max={60}
                      />
                    </Grid>
                    <Divider orientation="vertical" flexItem />
                    <Grid item sm={4}>
                      <Typography variant="h6">Some Questions</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </AccordionDetails>
              <Divider />
              <AccordionActions>
                <Button variant="contained" size="small" color="primary">
                  Regenerate
                </Button>
              </AccordionActions>
            </Accordion>
            {/*//? Reading Options */}
            <Accordion disabled={!sectionData.includes('Reading')} expanded={sectionData.includes('Reading') && rExp}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel3c-content"
                id="panel3a-header"
                onClick={() => {
                  setRExp(!rExp);
                }}>
                <Typography className={classes.heading}>Reading</Typography>
                <Typography className={classes.secondaryHeading}>View Reading Passage and Adjust Settings</Typography>
              </AccordionSummary>
            </Accordion>
          </Container>
        </Box>

        <Box p={6}>
          <Container maxWidth="xs">
            <Typography className={classes.formControl} variant="h6">
              Download
            </Typography>
            <Paper>
              <Grid container justify="center" spacing={4}>
                <Grid item sm={5}>
                  <Button variant="contained" color="primary" className={classes.downloadButton} onClick={gen}>
                    Packet
                  </Button>
                </Grid>
                <Grid item sm={5}>
                  <Button variant="contained" color="primary" className={classes.downloadButton} onClick={gen}>
                    Answers
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Container>
        </Box>
      </Container>
    </React.Fragment>
  );
}
