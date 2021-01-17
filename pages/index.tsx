import Head from 'next/head';
import styles from '../styles/Home.module.css';
import DocumentGen, { sections } from 'client/document';
import { useRef } from 'react';
import { Difficulty, TriviaOptions } from 'utils/types/Trivia';

export default function Home() {
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

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h2>Trivia</h2>
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

      <main className={styles.main}>
        <button onClick={gen}>Download</button>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
