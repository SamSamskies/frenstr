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
        <div>
          <h1>frenstr</h1>
          <p>
            Make new frens on Nostr. Get started by generating a user
            description for yourself or any other Nostr user.
          </p>
          <form>
            <input autoFocus placeholder="Enter npub or nip-05" />
          </form>
        </div>
      </main>
    </>
  );
}
