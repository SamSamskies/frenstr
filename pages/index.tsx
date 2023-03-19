import Head from "next/head";
import styles from "@/styles/Home.module.css";
import React, { FormEvent, useState } from "react";
import { Loading } from "@/components/Loading";
import { getPubkeyAndRelays, makeUrlWithParams } from "@/utils";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();

    // @ts-ignore
    const value = event.target[0].value;

    try {
      const { pubkey, relays } = (await getPubkeyAndRelays(value)) ?? {};

      if (!pubkey) {
        return;
      }

      const baseUrl = `${window.location.href}api/users/${pubkey}`;
      const eventsUrl = makeUrlWithParams(`${baseUrl}/events`, {
        relays: relays ? relays.join(",") : undefined,
      });
      const events: { content: string; [key: string]: any }[] = await fetch(
        eventsUrl
      ).then((res) => res.json());

      const notes = events.map(({ content }) => content);
      const content = `Could you describe the user that wrote these notes? ${JSON.stringify(
        notes
      )}`;
      // TODO: look for frenstr kind 1 event that mentions the user before creating a new one
      const description = await fetch(`${baseUrl}/description`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: pubkey, content }),
      }).then((res) => res.json());
      setDescription(description);
      // TODO:
      // - Generate event to broadcast
      // - Broadcast event using Blastr and nostr.wine
    } finally {
      setIsLoading(false);
    }
  };

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
          <form onSubmit={handleSubmit}>
            <input autoFocus placeholder="Enter npub or nip-05" />
            <button type="submit" disabled={isLoading}>
              Go
            </button>
          </form>
          {isLoading && <Loading>Generating description...</Loading>}
          {description && <p>{description}</p>}
        </div>
      </main>
    </>
  );
}
