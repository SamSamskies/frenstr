import Head from "next/head";
import styles from "@/styles/Home.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>frenstr</title>
        <meta name="description" content="Make new frens on nostr." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div style={{ textAlign: "center" }}>
          <h1>wen frenstr?</h1>
          <p>soon™</p>
        </div>
      </main>
    </>
  );
}
