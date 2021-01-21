import React, { FunctionComponent } from 'react';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Mark,
  Slider,
  TextField,
  Typography,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { MathProblem, operation } from 'client/math/math-logic';
import AppContext from './AppContext';

type MathOptionsProps = {
  disabled: boolean;
  expanded: boolean;
  changeExpanded: (value: React.SetStateAction<boolean>) => void;
};

const marks: Mark[] = [];
for (let i = 9; i < 60; i = i + 12) {
  marks.push({ value: i, label: `${i}` });
}

const MathOptions: FunctionComponent<MathOptionsProps> = ({ disabled, expanded, changeExpanded }) => {
  // Global State
  const { docs, classes } = React.useContext(AppContext);

  // States for math options
  const [maxNumError, setMaxNumErr] = React.useState<boolean>(false);
  const [maxNumberMath, setMaxNumberMath] = React.useState<number>(5);
  const [numMathQues, setNumMathQues] = React.useState<number>(15);
  const [mathOperations, setMathOperatons] = React.useState<operation[]>(['+', '-']);

  // State for displaying problems
  const [mathProblems, setMathProblems] = React.useState<MathProblem[]>([]);
  const regenMath = () => {
    setMathProblems(docs.genMathQuestions());
  };

  React.useEffect(() => {
    docs.setMathOptions({
      maxNumber: maxNumberMath,
      numberofQuestions: numMathQues,
      operations: mathOperations,
    });
    regenMath();
  }, []);

  return (
    <Accordion disabled={disabled} expanded={expanded}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel2c-content"
        id="panel2a-header"
        onClick={() => {
          changeExpanded(!expanded);
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
                  value={maxNumberMath === 0 ? '' : maxNumberMath}
                  id="maxNumber"
                  onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                    if (event.target.value == null || Number(event.target.value) <= 0) {
                      setMaxNumErr(true);
                      setMaxNumberMath(Number(event.target.value));
                      return;
                    }
                    setMaxNumErr(false);
                    setMaxNumberMath(Number(event.target.value));
                    docs.setMathOptions({
                      ...docs.getMathOptions(),
                      maxNumber: Number(event.target.value),
                    });
                  }}
                  label="Max Number"
                  type="number"
                />
              </Grid>
              <Grid item sm={5}>
                <Typography>Number of Questions</Typography>
                <Slider
                  defaultValue={numMathQues}
                  onChange={(event: React.ChangeEvent<unknown>, newValue: number | number[]) => {
                    setNumMathQues(newValue as number);
                    docs.setMathOptions({
                      ...docs.getMathOptions(),
                      numberofQuestions: newValue as number,
                    });
                  }}
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
                      checked={mathOperations.includes('+')}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const prevOpts = docs.getMathOptions();

                        if (event.target.checked && !mathOperations.includes('+')) {
                          setMathOperatons([...mathOperations, '+']);
                          docs.setMathOptions({ ...prevOpts, operations: [...prevOpts.operations, '+'] });
                        } else if (!event.target.checked && mathOperations.includes('+')) {
                          const items = Array.from(mathOperations);
                          items.splice(items.indexOf('+'), 1);
                          setMathOperatons(items);
                          docs.setMathOptions({ ...prevOpts, operations: items });
                        }
                        console.log(docs.getMathOptions());
                      }}
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
                      checked={mathOperations.includes('-')}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const prevOpts = docs.getMathOptions();

                        if (event.target.checked && !mathOperations.includes('-')) {
                          setMathOperatons([...mathOperations, '-']);
                          docs.setMathOptions({ ...prevOpts, operations: [...prevOpts.operations, '-'] });
                        } else if (!event.target.checked && mathOperations.includes('-')) {
                          const items = Array.from(mathOperations);
                          items.splice(items.indexOf('-'), 1);
                          setMathOperatons(items);
                          docs.setMathOptions({ ...prevOpts, operations: items });
                        }
                        console.log(docs.getMathOptions());
                      }}
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
                      checked={mathOperations.includes('*')}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const prevOpts = docs.getMathOptions();

                        if (event.target.checked && !mathOperations.includes('*')) {
                          setMathOperatons([...mathOperations, '*']);
                          docs.setMathOptions({ ...prevOpts, operations: [...prevOpts.operations, '*'] });
                        } else if (!event.target.checked && mathOperations.includes('*')) {
                          const items = Array.from(mathOperations);
                          items.splice(items.indexOf('*'), 1);
                          setMathOperatons(items);
                          docs.setMathOptions({ ...prevOpts, operations: items });
                        }
                        console.log(docs.getMathOptions());
                      }}
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
                      checked={mathOperations.includes('/')}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const prevOpts = docs.getMathOptions();

                        if (event.target.checked && !mathOperations.includes('/')) {
                          setMathOperatons([...mathOperations, '/']);
                          docs.setMathOptions({ ...prevOpts, operations: [...prevOpts.operations, '/'] });
                        } else if (!event.target.checked && mathOperations.includes('/')) {
                          const items = Array.from(mathOperations);
                          items.splice(items.indexOf('/'), 1);
                          setMathOperatons(items);
                          docs.setMathOptions({ ...prevOpts, operations: items });
                        }
                        console.log(docs.getMathOptions());
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
        <Button
          variant="contained"
          size="small"
          color="primary"
          disabled={maxNumError || !mathOperations.length}
          onClick={regenMath}>
          Regenerate
        </Button>
      </AccordionActions>
    </Accordion>
  );
};

export default MathOptions;
