/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Head from 'next/head';
import DocumentGen, { sections } from 'client/document';
import React from 'react';
import { Difficulty, Question, TriviaOptions } from 'utils/types/Trivia';
import {
  Container,
  AppBar,
  Toolbar,
  Box,
  Paper,
  Chip,
  Checkbox,
  Button,
  Grid,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Typography,
  Tooltip,
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
import Autocomplete from '@material-ui/lab/Autocomplete';
import { ExpandMore } from '@material-ui/icons';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { MathOptions, MathProblem, operation } from 'client/math/math-logic';
import urls from 'utils/urls';

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
    mathOptions: {
      minWidth: 200,
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
  const docs = new DocumentGen();

  const gen = async () => {
    const triviaOps: TriviaOptions = {
      Difficulty: Difficulty.Easy,
      NumberofQuestions: 5,
      Categories: [],
      StrictCategory: false,
    };

    const sectionOrder: sections[] = sectionData;
    docs.setTriviaOptions(triviaOps);
    await docs.genTriviaQuestions();
    docs.genMathQuestions();
    await docs.genReading();
    docs.makeDoc(sectionOrder);
    await docs.downloadDoc();
  };

  const getAllCategories = async (): Promise<string[]> => {
    const resp = await fetch(urls.api.triviaCategories);
    const categories = (await resp.json()) as string[];
    return categories;
  };

  const regenTrivia = async () => {
    if (
      numberofTriviaQuestions.current == null ||
      Number(numberofTriviaQuestions.current.value) <= 0 ||
      keptQuestions.size >= Number(numberofTriviaQuestions.current.value)
    ) {
      return;
    }

    const newTriviaOptions: TriviaOptions = {
      Difficulty: diff,
      Categories: categories,
      NumberofQuestions: Number(numberofTriviaQuestions.current.value) - keptQuestions.size,
      StrictCategory: strictCats,
    };

    docs.setTriviaOptions(newTriviaOptions);

    const gotQuestions = await docs.genTriviaQuestions();
    let newQuestionIndex = 0;
    const newQuestions: Question[] = [];

    for (let i = 0; i < Number(numberofTriviaQuestions.current.value); i++) {
      if (i >= gotQuestions.length + keptQuestions.size) break;

      if (keptQuestions.has(i)) newQuestions.push(triviaQuestions[i]);
      else {
        newQuestions.push(gotQuestions[newQuestionIndex]);
        newQuestionIndex++;
      }
    }

    setTriviaQuestions(newQuestions);
  };

  const regenMath = () => {
    if (maxNumberMath.current == null || Number(maxNumberMath.current.value) <= 0) {
      setmaxNumErr(true);
      return;
    }
    setmaxNumErr(false);
    const operators: operation[] = [];

    if (operations.checkedplus) operators.push('+');
    if (operations.checkedminus) operators.push('-');
    if (operations.checkedmulti) operators.push('*');
    if (operations.checkeddiv) operators.push('/');

    const newMathOptions: MathOptions = {
      maxNumber: Number(maxNumberMath.current.value),
      numberofQuestions: numberofMathQuestions,
      operations: operators,
    };

    docs.setMathOptions(newMathOptions);

    setMathProblems(docs.genMathQuestions());
  };

  const classes = useStyles();
  const allAvailableSections: sections[] = ['Trivia', 'Math', 'Reading'];

  const [sectionData, setSectionData] = React.useState<sections[]>([]);
  const [sectiontoAdd, setAddingSection] = React.useState<sections>('');

  const [diff, setDiff] = React.useState<Difficulty>(Difficulty.Easy);
  const numberofTriviaQuestions = React.useRef<HTMLInputElement>(null);
  const [categories, setCategories] = React.useState<string[]>([]);
  const categoryToAdd = React.useRef<HTMLInputElement>(null);
  const [allCategories, setAllCategories] = React.useState<string[]>([]);
  const [strictCats, setStrictCats] = React.useState<boolean>(false);

  const [triviaQuestions, setTriviaQuestions] = React.useState<Question[]>([]);
  const [keptQuestions] = React.useState<Set<number>>(new Set<number>());

  const maxNumberMath = React.useRef<HTMLInputElement>(null);
  const [maxNumError, setmaxNumErr] = React.useState<boolean>(false);
  const [numberofMathQuestions, setNumMathQues] = React.useState<number>(15);

  const [mathProblems, setMathProblems] = React.useState<MathProblem[]>([]);

  const [operations, setOperations] = React.useState({
    checkedplus: true,
    checkedminus: true,
    checkedmulti: true,
    checkeddiv: true,
  });

  const [tExp, setTExp] = React.useState<boolean>(false);
  const [mExp, setMExp] = React.useState<boolean>(false);
  const [rExp, setRExp] = React.useState<boolean>(false);

  const handleDelete = (index: number) => () => {
    setSectionData(sections => sections.filter((section, ind) => ind !== index));
  };

  const handleDeleteCategory = (index: number) => {
    setCategories(cats => cats.filter((cat, ind) => ind !== index));
  };

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    if (event.target.value) setAddingSection(event.target.value as sections);
  };

  const handleSliderChange = (event: React.ChangeEvent<unknown>, newValue: number | number[]) => {
    setNumMathQues(newValue as number);
  };

  const updateOper = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOperations({ ...operations, [event.target.name]: event.target.checked });
  };

  const whenDrag = (result: DropResult) => {
    if (!result?.destination) return;

    const items = Array.from(sectionData);
    const [newOrderitem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, newOrderitem);

    setSectionData(items);
  };

  const marks = [];
  for (let i = 9; i < 60; i = i + 12) {
    marks.push({ value: i, label: `${i}` });
  }

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
                                    <Tooltip title="Move to change position in document" placement="top">
                                      <Chip
                                        color="primary"
                                        label={data}
                                        onDelete={handleDelete(ind)}
                                        className={classes.chip}
                                      />
                                    </Tooltip>
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
                      defaultValue=""
                      value={sectiontoAdd}
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
                    onClick={async () => {
                      if (sectiontoAdd !== '') setSectionData([...sectionData, sectiontoAdd]);
                      switch (sectiontoAdd) {
                        case 'Trivia':
                          setTExp(true);
                          if (triviaQuestions.length === 0) await regenTrivia();
                          setAllCategories(await getAllCategories());
                          break;
                        case 'Math':
                          setMExp(true);
                          if (mathProblems.length === 0) regenMath();
                          break;
                        case 'Reading':
                          setRExp(true);
                          await docs.genReading();
                          break;
                        default:
                          break;
                      }
                      if (allAvailableSections.filter(val => !sectionData.includes(val)).length !== 0)
                        setAddingSection(allAvailableSections.filter(val => !sectionData.includes(val))[0]);
                      else setAddingSection('');
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
              <Box p={2}>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid container item spacing={2} sm={5}>
                      <Grid item sm={12}>
                        <Typography variant="h6">Options</Typography>
                      </Grid>
                      <Grid item sm={12} md={6}>
                        <FormControl className={classes.formControl}>
                          <InputLabel id="select-label">Difficulty</InputLabel>
                          <Select
                            labelId="diff-label"
                            value={diff}
                            id="diff-select"
                            onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                              if (event.target.value) setDiff(event.target.value as Difficulty);
                            }}>
                            <MenuItem value={Difficulty.Very_Easy}>Very Easy</MenuItem>
                            <MenuItem value={Difficulty.Easy}>Easy</MenuItem>
                            <MenuItem value={Difficulty.Medium}>Medium</MenuItem>
                            <MenuItem value={Difficulty.Hard}>Hard</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item sm={12} md={6}>
                        <TextField
                          defaultValue={5}
                          id="numberOfTrivia"
                          inputRef={numberofTriviaQuestions}
                          label="Question Count"
                          type="number"
                        />
                      </Grid>
                      <Grid item sm={12}>
                        <Typography variant="subtitle2">Categories</Typography>
                      </Grid>
                      <Grid item sm={12}>
                        <Paper component="ul" className={classes.chipBox}>
                          {categories.map((cat, index) => {
                            return (
                              <li key={index}>
                                <Chip
                                  label={cat}
                                  className={classes.chip}
                                  onDelete={() => handleDeleteCategory(index)}
                                />
                              </li>
                            );
                          })}
                        </Paper>
                      </Grid>
                      <Grid item sm={6}>
                        <Autocomplete
                          id="categoryAuto"
                          options={allCategories}
                          getOptionLabel={opt => {
                            const opti = opt as string;
                            return opti.replace(/\b\w/g, l => l.toUpperCase());
                          }}
                          renderInput={params => (
                            <TextField {...params} label="New Category" variant="outlined" inputRef={categoryToAdd} />
                          )}
                        />
                      </Grid>
                      <Grid item sm={6}>
                        <Button
                          className={classes.downloadButton}
                          variant="contained"
                          color="default"
                          onClick={() => {
                            if (categoryToAdd.current?.value)
                              setCategories([...categories, categoryToAdd.current.value]);
                          }}>
                          Add
                        </Button>
                      </Grid>
                      <Grid item sm={12}>
                        <FormControlLabel
                          labelPlacement="end"
                          label="From Categories Only"
                          control={
                            <Checkbox
                              name="strictCats"
                              checked={strictCats}
                              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setStrictCats(event.target.checked);
                              }}
                              color="default"
                              inputProps={{ 'aria-label': 'checkbox' }}
                            />
                          }
                        />
                      </Grid>
                    </Grid>
                    <Box p={3}>
                      <Divider orientation="vertical" />
                    </Box>
                    <Grid container item sm={6} spacing={2}>
                      <Grid item sm={12}>
                        <Typography variant="h6">Questions</Typography>
                      </Grid>
                      <Grid container item sm={12} style={{ height: 350, overflowY: 'scroll' }} spacing={2}>
                        {triviaQuestions.map((question, index) => {
                          return (
                            <Grid key={`${question.Id}-${index}`} item sm={12}>
                              <FormControlLabel
                                labelPlacement="end"
                                label={question.Question}
                                control={
                                  <Tooltip title="Keep?" placement="top">
                                    <Checkbox
                                      id={String(index)}
                                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        if (event.target.checked) keptQuestions.add(Number(event.target.id));
                                        else keptQuestions.delete(Number(event.target.id));
                                        console.log(keptQuestions);
                                      }}
                                      color="default"
                                      inputProps={{ 'aria-label': 'checkbox' }}
                                    />
                                  </Tooltip>
                                }
                              />
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Box>
              <Divider />
              <AccordionActions>
                <Button variant="contained" size="small" color="primary" onClick={regenTrivia}>
                  Regenerate
                </Button>
              </AccordionActions>
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
              <Box p={2}>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid container item spacing={2} sm={7}>
                      <Grid item sm={12}>
                        <Typography variant="h6">Options</Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <TextField
                          error={maxNumError}
                          defaultValue={9}
                          id="maxNumber"
                          inputRef={maxNumberMath}
                          label="Max Number"
                          type="number"
                        />
                      </Grid>
                      <Grid item sm={5}>
                        <Typography>Number of Questions</Typography>
                        <Slider
                          defaultValue={15}
                          onChange={handleSliderChange}
                          aria-labelledby="discrete-slider"
                          valueLabelDisplay="auto"
                          step={3}
                          marks={marks}
                          min={9}
                          max={60}
                        />
                      </Grid>
                      <Grid item sm={11}>
                        <Typography>Operations</Typography>
                        <FormControlLabel
                          labelPlacement="end"
                          label="+"
                          control={
                            <Checkbox
                              name="checkedplus"
                              checked={operations.checkedplus}
                              onChange={updateOper}
                              color="default"
                              inputProps={{ 'aria-label': 'checkbox' }}
                            />
                          }
                        />
                        <FormControlLabel
                          labelPlacement="end"
                          label="-"
                          control={
                            <Checkbox
                              name="checkedminus"
                              checked={operations.checkedminus}
                              onChange={updateOper}
                              color="default"
                              inputProps={{ 'aria-label': 'checkbox' }}
                            />
                          }
                        />
                        <FormControlLabel
                          labelPlacement="end"
                          label="*"
                          control={
                            <Checkbox
                              name="checkedmulti"
                              checked={operations.checkedmulti}
                              onChange={updateOper}
                              color="default"
                              inputProps={{ 'aria-label': 'checkbox' }}
                            />
                          }
                        />
                        <FormControlLabel
                          labelPlacement="end"
                          label="/"
                          control={
                            <Checkbox
                              name="checkeddiv"
                              checked={operations.checkeddiv}
                              onChange={updateOper}
                              color="default"
                              inputProps={{ 'aria-label': 'checkbox' }}
                            />
                          }
                        />
                      </Grid>
                    </Grid>
                    <Box p={3}>
                      <Divider orientation="vertical" />
                    </Box>
                    <Grid container item spacing={2} sm={4} justify="center">
                      <Grid item sm={10}>
                        <Typography variant="h6">Questions</Typography>
                      </Grid>
                      {mathProblems.map((question, index) => {
                        return (
                          <Grid
                            key={index}
                            item
                            sm={4}>{`${question.firstOperand} ${question.operation} ${question.secondOperand}`}</Grid>
                        );
                      })}
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Box>

              <Divider />
              <AccordionActions>
                <Button variant="contained" size="small" color="primary" onClick={regenMath}>
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
