import React, { FunctionComponent } from 'react';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { Difficulty, Question } from 'utils/types/Trivia';
import urls from 'utils/urls';
import AppContext from './AppContext';

// gets all valid categories from API
const getAllCategories = async (): Promise<string[]> => {
  const resp = await fetch(urls.api.triviaCategories);
  const categories = (await resp.json()) as string[];
  return categories;
};

type OptionProps = {
  disabled: boolean;
  expanded: boolean;
  changeExpanded: (value: React.SetStateAction<boolean>) => void;
};

const Option: FunctionComponent<OptionProps> = ({ disabled, expanded, changeExpanded }) => {
  // Global State
  const { docs, classes } = React.useContext(AppContext);

  // States to manage for options
  const [diff, setDiff] = React.useState<Difficulty>(Difficulty.Easy);
  const [numberofTriviaQuestions, setNumberofTriviaQuestions] = React.useState<number>(5);
  const [strictCats, setStrictCats] = React.useState<boolean>(false);
  const [verbal, setVerbal] = React.useState<boolean>(false);

  // Manage Chip system to add categories
  const [categories, setCategories] = React.useState<string[]>([]);
  const categoryToAdd = React.useRef<HTMLInputElement>(null);

  // Trivia Question State
  const [triviaNumErr, setTriviaNumErr] = React.useState<boolean>(false);
  const [triviaQuestions, setTriviaQuestions] = React.useState<Question[]>([]);
  const [keptQuestions] = React.useState<Set<number>>(new Set<number>());
  const regenTrivia = async () => {
    const gotQuestions = await docs.genTriviaQuestions();
    let newQuestionIndex = 0;
    const newQuestions: Question[] = [];

    for (let i = 0; i < numberofTriviaQuestions; i++) {
      if (i >= gotQuestions.length + keptQuestions.size) break;

      if (keptQuestions.has(i)) newQuestions.push(triviaQuestions[i]);
      else {
        newQuestions.push(gotQuestions[newQuestionIndex]);
        newQuestionIndex++;
      }
    }

    docs.triviaQuestions = newQuestions;
    setTriviaQuestions(newQuestions);
  };

  // Inital Info
  const [allCategories, setAllCategories] = React.useState<string[]>([]);
  React.useEffect(() => {
    const gatherInfo = async () => {
      setAllCategories(await getAllCategories());
      docs.setTriviaOptions({
        Categories: categories,
        Difficulty: diff,
        NumberofQuestions: numberofTriviaQuestions,
        StrictCategory: strictCats,
        triviaVerbal: verbal,
      });
      await regenTrivia();
    };
    void gatherInfo();
  }, []);

  return (
    <Accordion disabled={disabled} expanded={expanded}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel3c-content"
        id="panel1a-header"
        onClick={() => {
          changeExpanded(!expanded);
        }}>
        <Typography className={classes.heading}>Trivia</Typography>
        <Typography className={classes.secondaryHeading}>View Questions and Adjust Settings</Typography>
      </AccordionSummary>
      <Box p={2}>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid container item spacing={2} sm={12} md={6}>
              <Grid item xs={12} sm={12}>
                <Typography variant="h6">Options</Typography>
                <Box paddingTop={2}>
                  <Divider />
                </Box>
              </Grid>
              <Grid item xs={6} sm={6} md={6}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="select-label">Difficulty</InputLabel>
                  <Select
                    labelId="diff-label"
                    value={diff}
                    id="reading-cagegory-select"
                    onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                      if (event.target.value) {
                        setDiff(event.target.value as Difficulty);
                        docs.setTriviaOptions({
                          ...docs.getTriviaOptions(),
                          Difficulty: event.target.value as Difficulty,
                        });
                      }
                    }}>
                    <MenuItem value={Difficulty.Very_Easy}>Very Easy</MenuItem>
                    <MenuItem value={Difficulty.Easy}>Easy</MenuItem>
                    <MenuItem value={Difficulty.Medium}>Medium</MenuItem>
                    <MenuItem value={Difficulty.Hard}>Hard</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={6} md={6}>
                <TextField
                  id="triviaNUms"
                  error={triviaNumErr}
                  value={numberofTriviaQuestions === 0 ? '' : numberofTriviaQuestions}
                  onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                    if (
                      event.target.value == null ||
                      Number(event.target.value) <= 0 ||
                      keptQuestions.size >= Number(event.target.value)
                    ) {
                      setTriviaNumErr(true);
                      setNumberofTriviaQuestions(Number(event.target.value));
                      return;
                    }
                    setTriviaNumErr(false);
                    setNumberofTriviaQuestions(Number(event.target.value));
                    docs.setTriviaOptions({
                      ...docs.getTriviaOptions(),
                      NumberofQuestions: Number(event.target.value),
                    });
                  }}
                  label="Question Count"
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Typography variant="subtitle2">Categories</Typography>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Paper component="ul" className={classes.chipBox}>
                  {categories.map((cat, index) => {
                    return (
                      <li key={index}>
                        <Chip
                          label={cat}
                          className={classes.chip}
                          onDelete={() => {
                            setCategories(cats => cats.filter((cat, ind) => ind !== index));
                            const prevOptions = docs.getTriviaOptions();
                            docs.setTriviaOptions({
                              ...prevOptions,
                              Categories: prevOptions.Categories.filter((cat, ind) => ind !== index),
                            });
                          }}
                        />
                      </li>
                    );
                  })}
                </Paper>
              </Grid>
              <Grid item xs={8} sm={6}>
                <Autocomplete
                  id="categoryAuto"
                  options={allCategories}
                  getOptionLabel={opt => opt.replace(/\b\w/g, l => l.toUpperCase())}
                  renderInput={params => (
                    <TextField {...params} label="New Category" variant="outlined" inputRef={categoryToAdd} />
                  )}
                />
              </Grid>
              <Grid item xs={4} sm={6}>
                <Button
                  className={classes.downloadButton}
                  variant="contained"
                  color="default"
                  onClick={() => {
                    if (categoryToAdd.current?.value) {
                      setCategories([...categories, categoryToAdd.current.value]);
                      const prevOptions = docs.getTriviaOptions();
                      docs.setTriviaOptions({
                        ...prevOptions,
                        Categories: [...prevOptions.Categories, categoryToAdd.current.value],
                      });
                    }
                  }}>
                  Add
                </Button>
              </Grid>
              <Grid item sm={6}>
                <FormControlLabel
                  labelPlacement="end"
                  label="From Categories Only"
                  control={
                    <Checkbox
                      name="strictCats"
                      checked={strictCats}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setStrictCats(event.target.checked);
                        docs.setTriviaOptions({
                          ...docs.getTriviaOptions(),
                          StrictCategory: event.target.checked,
                        });
                      }}
                      color="default"
                      inputProps={{ 'aria-label': 'checkbox' }}
                    />
                  }
                />
              </Grid>
              <Grid item sm={6}>
                <FormControlLabel
                  labelPlacement="end"
                  label="Verbal Trivia (no lines)"
                  control={
                    <Checkbox
                      name="verbal"
                      checked={verbal}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setVerbal(event.target.checked);
                        docs.setTriviaOptions({
                          ...docs.getTriviaOptions(),
                          triviaVerbal: event.target.checked,
                        });
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
            <Grid container item sm={12} md={5} spacing={2}>
              <Grid item xs={12} sm={12}>
                <Typography variant="h6">Questions</Typography>
                <Box paddingTop={2}>
                  <Divider />
                </Box>
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
        <Button variant="outlined" size="small" disabled={triviaNumErr} color="inherit" onClick={regenTrivia}>
          Regenerate
        </Button>
      </AccordionActions>
    </Accordion>
  );
};

export default Option;
