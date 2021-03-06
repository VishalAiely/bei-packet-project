/* eslint-disable @typescript-eslint/unbound-method */
import React, { FunctionComponent } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Tooltip,
  Chip,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@material-ui/core';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DroppableProvided,
  DropResult,
  resetServerContext,
} from 'react-beautiful-dnd';
import { sections } from 'client/document';
import AppContext from 'components/AppContext';

type SectionOptionsProps = {
  // Main Sections
  sectionData: sections[];
  setSectionData: React.Dispatch<React.SetStateAction<sections[]>>;

  // Change Expanded Sections
  setTExp: React.Dispatch<React.SetStateAction<boolean>>;
  setMExp: React.Dispatch<React.SetStateAction<boolean>>;
  setRExp: React.Dispatch<React.SetStateAction<boolean>>;
};

const SectionOptions: FunctionComponent<SectionOptionsProps> = ({
  sectionData,
  setSectionData,
  setTExp,
  setMExp,
  setRExp,
}) => {
  const { classes, docs } = React.useContext(AppContext);

  const allAvailableSections: sections[] = ['Trivia', 'Math', 'Reading', 'Writing'];
  const [sectiontoAdd, setAddingSection] = React.useState<sections>('');

  const whenDrag = (result: DropResult) => {
    if (!result?.destination) return;

    const items = Array.from(sectionData);
    const [newOrderitem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, newOrderitem);

    setSectionData(items);
  };

  const handleDelete = (index: number) => () => {
    setSectionData(sections => sections.filter((section, ind) => ind !== index));
  };

  const handleChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
    if (event.target.value) {
      setSectionData([...sectionData, event.target.value as sections]);
      switch (event.target.value as sections) {
        case 'Trivia':
          setTExp(true);
          break;
        case 'Math':
          setMExp(true);
          break;
        case 'Reading':
          setRExp(true);
          await docs.genReading();
          break;
        default:
          break;
      }
      setAddingSection('');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  resetServerContext();

  return (
    <Box p={3}>
      <Container maxWidth="md">
        <Typography className={classes.formControl} variant="h4">
          Exercises
        </Typography>
        <Paper className={classes.paper}>
          <Grid container spacing={3}>
            {/* <Grid item sm={1}>
              <Box paddingTop={1}>
                <Typography variant="h6">Order:</Typography>
              </Box>
            </Grid> */}
            <Grid item xs={12} sm={12} md={9}>
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
                              <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
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

            <Grid container item justify="center" sm={12} md={3}>
              <FormControl className={classes.formControl} style={{ marginTop: -5 }}>
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
            {/* <Grid item sm={2}>
              <Button
                className={classes.menuButton}
                variant="outlined"
                color="inherit"
                disabled={sectionData.length === allAvailableSections.length}
                onClick={async () => {
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
                      await docs.genReading();
                      break;
                    default:
                      break;
                  }
                  setAddingSection('');
                }}>
                Add
              </Button>
            </Grid> */}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default SectionOptions;
