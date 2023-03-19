import Head from "next/head";
import styles from "@/styles/Home.module.css";
import React, { FormEvent, useState } from "react";
import { nip05, nip19 } from "nostr-tools";
import { Loading } from "@/components/Loading";
import { makeUrlWithParams } from "@/utils";

const DEFAULT_RELAYS = [
  "wss://relay.damus.io",
  "wss://relay.snort.social",
  "wss://nostr.wine",
  "wss://eden.nostr.land",
  "wss://relay.orangepill.dev",
  "wss://nostr.fmt.wiz.biz",
  "wss://nostr.milou.lol",
];

const isNpub = (value: string) =>
  /npub1[acdefghjklmnpqrstuvwxyz023456789]{58}/.test(value);

const getPubkeyAndRelays = async (value: string) => {
  try {
    if (isNpub(value)) {
      const pubkey = nip19.decode(value).data as string;
      const relays: { relay: string; read: boolean; write: boolean }[] =
        await fetch(`/api/users/${pubkey}/relays`).then((res) => res.json());
      const readRelays = relays
        .filter(({ read }) => read)
        .map(({ relay }) => relay);

      return { pubkey, relays: readRelays ?? DEFAULT_RELAYS };
    }

    const res = await nip05.queryProfile(value);

    if (!res?.pubkey) {
      throw new Error("No pubkey found for this nip-05");
    }

    return { pubkey: res.pubkey, relays: res?.relays ?? DEFAULT_RELAYS };
  } catch (error) {
    alert(error instanceof Error ? error.message : "something went wrong :(");
  }
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
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

      const url = makeUrlWithParams(
        `${window.location.href}api/users/${pubkey}/events`,
        {
          relays: relays ? relays.join(",") : undefined,
        }
      );
      const events = await fetch(url).then((res) => res.json());
      console.log({ events });
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
          {isLoading && <Loading />}
        </div>
      </main>
    </>
  );
}
