import Head from 'next/head';
import DocumentGen, { sections } from 'client/document';
import React from 'react';
import AppContext from 'components/AppContext';
import NavBar from 'components/NavBar';
import Exercises from 'components/ExerciseSelection';
import Options from 'components/Options';
import TriviaOptions from 'components/TriviaOptions';
import MathOptions from 'components/MathOptions';
import ReadingOptions from 'components/ReadingOptions';
import Download from 'components/Download';
import Footer from 'components/Footer';
import { Container } from '@material-ui/core';
import 'fontsource-roboto';
import { useStyles } from 'utils/hooks';

export default function Home(): JSX.Element {
  const [docs] = React.useState(new DocumentGen());

  const classes = useStyles();

  const sharedState = {
    docs: docs,
    classes: { ...classes },
  };

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
      <AppContext.Provider value={sharedState}>
        <Container maxWidth="xl" style={{ paddingTop: 70 }}>
          <NavBar />

          <Exercises
            sectionData={sectionData}
            setSectionData={setSectionData}
            setTExp={setTExp}
            setMExp={setMExp}
            setRExp={setRExp}
          />

          <Options classes={classes}>
            <TriviaOptions
              disabled={!sectionData.includes('Trivia')}
              expanded={sectionData.includes('Trivia') && tExp}
              changeExpanded={setTExp}
            />
            <MathOptions
              disabled={!sectionData.includes('Math')}
              expanded={sectionData.includes('Math') && mExp}
              changeExpanded={setMExp}
            />
            <ReadingOptions
              disabled={!sectionData.includes('Reading')}
              expanded={sectionData.includes('Reading') && rExp}
              changeExpanded={setRExp}
            />
          </Options>

          <Download sectionOrder={sectionData} />
        </Container>
        <Footer />
      </AppContext.Provider>
    </React.Fragment>
  );
}
