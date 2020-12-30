import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { GenerateDocx } from '../client/trivia/document';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <button onClick={GenerateDocx}>Download</button>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
