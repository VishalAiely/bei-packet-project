/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Head from 'next/head';
import DocumentGen, { sections } from 'client/document';
import React, { useRef } from 'react';
import { Difficulty, TriviaOptions } from 'utils/types/Trivia';
import { Container, AppBar, Toolbar, Box, Paper, Chip, Button } from '@material-ui/core';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DroppableProvided,
  DropResult,
  resetServerContext,
} from 'react-beautiful-dnd';
import 'fontsource-roboto';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    chipBox: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      listStyle: 'none',
      padding: theme.spacing(0.5),
      margin: 0,
    },
    chip: {
      margin: theme.spacing(0.5),
    },
  })
);

export default function Home(): JSX.Element {
  const diff = useRef<HTMLSelectElement>(null);
  const triviaNums = useRef<HTMLInputElement>(null);

  const gen = async () => {
    const triviaOps: TriviaOptions = {
      Difficulty: (diff.current?.value as unknown) as Difficulty,
      NumberofQuestions: (triviaNums.current?.value || 5) as number,
      Categories: [],
      StrictCategory: false,
    };

    const docs = new DocumentGen(triviaOps);
    const sectionOrder: sections[] = ['Trivia', 'Math', 'Reading'];
    await docs.genTriviaQuestions();
    docs.genMathQuestions();
    await docs.genReading();
    docs.makeDoc(sectionOrder);
    await docs.downloadDoc();
  };

  const classes = useStyles();

  const [sectionData, setSectionData] = React.useState<sections[]>(['Trivia', 'Math', 'Reading']);

  const handleDelete = (sectionToDelete: sections) => () => {
    setSectionData(sections => sections.filter(section => section !== sectionToDelete));
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

        <Container maxWidth="md">
          <DragDropContext onDragEnd={whenDrag}>
            <Droppable droppableId="sections" direction="horizontal">
              {(provided: DroppableProvided) => (
                <Paper component="ul" className={classes.chipBox} ref={provided.innerRef} {...provided.droppableProps}>
                  {sectionData.map((data, ind) => {
                    return (
                      <Draggable key={data} draggableId={data} index={ind}>
                        {provided => (
                          <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <Chip label={data} onDelete={handleDelete(data)} className={classes.chip} />
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
          <Button
            onClick={() => {
              console.log(sectionData);
            }}>
            Check
          </Button>
        </Container>

        {/* <Typography variant="h2">Trivia</Typography>
        <div>
          <p>
            Difficulty:
            <select ref={diff}>
              <option value={Difficulty.Very_Easy}>Very Easy</option>
              <option value={Difficulty.Easy}>Easy</option>
              <option value={Difficulty.Medium}>Medium</option>
              <option value={Difficulty.Hard}>Hard</option>
            </select>
          </p>
        </div>

        <div>
          <p>
            Number of Questions: <input ref={triviaNums}></input>
          </p>
        </div>

        <main>
          <button onClick={gen}>Download</button>
        </main> */}
      </Container>
    </React.Fragment>
  );
}
