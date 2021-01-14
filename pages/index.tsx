import Head from 'next/head';
import styles from '../styles/Home.module.css';
import DocumentGen, { sections } from 'client/document';

export default function Home() {
  const docs = new DocumentGen();

  const gen = async () => {
    const sectionOrder: sections[] = ['Trivia', 'Math', 'Reading'];
    await docs.genTriviaQuestions();
    docs.genMathQuestions();
    await docs.genReading();
    docs.makeDoc(sectionOrder);
    await docs.downloadDoc();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <button onClick={gen}>Download</button>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
