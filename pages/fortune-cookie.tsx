import Head from "next/head";
import styles from "@/styles/Home.module.css";
import React, { FormEvent, useState } from "react";
import {
  getExistingFortuneCookieEvent,
  getPubkeyAndRelays,
  makeUrlWithParams,
  publishNoost,
} from "@/utils";
import { Description } from "@/components/Description";
import { type Event } from "nostr-tools";
import { FortuneCookieLoading } from "@/components/FortuneCookieLoading";

export default function FortuneCookie() {
  const [isLoading, setIsLoading] = useState(false);
  const [submittedValue, setSubmittedValue] = useState();
  const [fortune, setFortune] = useState("");
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    setFortune("");
    event.preventDefault();

    // @ts-ignore
    const value = event.target[0].value;

    setSubmittedValue(value);

    try {
      const { pubkey, relays } = (await getPubkeyAndRelays(value)) ?? {};

      if (!pubkey) {
        return;
      }

      const existingFortuneCookieEvent = await getExistingFortuneCookieEvent(
        pubkey
      );

      if (existingFortuneCookieEvent) {
        setFortune(
          existingFortuneCookieEvent.content.replace(
            "#[0] #FortuneCookie 🥠",
            ""
          )
        );
        return;
      }

      const baseUrl = `${window.location.origin}/api/users/${pubkey}`;
      const eventsUrl = makeUrlWithParams(`${baseUrl}/events`, {
        relays: relays ? relays.join(",") : undefined,
        limit: "10",
      });
      const events: Event[] = await fetch(eventsUrl).then((res) => res.json());

      const notes = events.map(({ content }) => content);
      const content = `Can you generate a fortune cookie message for the person that said these things? ${JSON.stringify(
        notes
      )}`;

      if (notes.length < 10) {
        alert(
          "sorry, this user has not written enough notes to generate a fortune"
        );
        return;
      }

      const fortune = await fetch(`${baseUrl}/description`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: pubkey, content }),
      }).then((res) => res.json());
      setFortune(fortune);

      const event = await fetch(`${baseUrl}/fortune-cookie-noost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: pubkey, content: fortune }),
      }).then((res) => res.json());

      // best effort to publish the description to nostr
      publishNoost(event);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>frenstr</title>
        <meta name="fortune" content="Make new frens on nostr." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div style={{ width: 600 }}>
          <h1>Nostr Fortune Cookie</h1>
          <p>Generate a fortune cookie message for any Nostr user.</p>
          <form onSubmit={handleSubmit}>
            <input autoFocus placeholder="Enter npub or nip-05" />
            <button type="submit" disabled={isLoading}>
              Go
            </button>
          </form>
          {isLoading && (
            <FortuneCookieLoading>Generating fortune...</FortuneCookieLoading>
          )}
          {submittedValue && fortune && (
            <Description>
              <p>#FortuneCookie 🥠</p>
              <br />
              <p>{fortune}</p>
            </Description>
          )}
        </div>
      </main>
    </>
  );
}
