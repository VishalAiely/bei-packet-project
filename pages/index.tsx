import Head from 'next/head';
import DocumentGen, { sections } from 'client/document';
import React from 'react';
import NavBar from 'components/NavBar';
import Exercises from 'components/ExerciseSelection';
import Options from 'components/Options';
import TriviaOptions from 'components/TriviaOptions';
import MathOptions from 'components/MathOptions';
import ReadingOptions from 'components/ReadingOptions';
import Download from 'components/Download';
import { Container } from '@material-ui/core';
import 'fontsource-roboto';
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
  const [docs] = React.useState(new DocumentGen());

  const classes = useStyles();

  const [sectionData, setSectionData] = React.useState<sections[]>([]);

  const [tExp, setTExp] = React.useState<boolean>(false);
  const [mExp, setMExp] = React.useState<boolean>(false);
  const [rExp, setRExp] = React.useState<boolean>(false);

  return (
    <React.Fragment>
      <Head>
        <title>BEI Packet Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxWidth="xl">
        <NavBar classes={classes} />

        <Exercises
          classes={classes}
          docs={docs}
          sectionData={sectionData}
          setSectionData={setSectionData}
          setTExp={setTExp}
          setMExp={setMExp}
          setRExp={setRExp}
        />

        <Options classes={classes}>
          <TriviaOptions
            classes={classes}
            docs={docs}
            disabled={!sectionData.includes('Trivia')}
            expanded={sectionData.includes('Trivia') && tExp}
            changeExpanded={setTExp}
          />
          <MathOptions
            classes={classes}
            docs={docs}
            disabled={!sectionData.includes('Math')}
            expanded={sectionData.includes('Math') && mExp}
            changeExpanded={setMExp}
          />
          <ReadingOptions
            classes={classes}
            docs={docs}
            disabled={!sectionData.includes('Reading')}
            expanded={sectionData.includes('Reading') && rExp}
            changeExpanded={setRExp}
          />
        </Options>

        <Download classes={classes} docs={docs} sectionOrder={sectionData} />
      </Container>
    </React.Fragment>
  );
}
