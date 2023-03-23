import "websocket-polyfill";
import {
  nip05,
  nip19,
  getEventHash,
  signEvent,
  type Event,
  relayInit,
} from "nostr-tools";

export const DEFAULT_RELAYS = [
  "wss://relay.damus.io",
  "wss://relay.snort.social",
  "wss://nostr.wine",
  "wss://eden.nostr.land",
  "wss://relay.orangepill.dev",
  "wss://nostr.fmt.wiz.biz",
  "wss://nostr.milou.lol",
];

export const CONTENT_PREFIX = "Description generated by ChatGPT for #[0]:";

export const isNpub = (value: string) =>
  /npub1[acdefghjklmnpqrstuvwxyz023456789]{58}/.test(value);

export const getPubkeyAndRelays = async (value: string) => {
  try {
    if (isNpub(value)) {
      const pubkey = nip19.decode(value).data as string;
      const relays: { relay: string; read: boolean; write: boolean }[] =
        await fetch(`/api/users/${pubkey}/relays`).then((res) => res.json());
      const readRelays = relays
        ? relays.filter(({ read }) => read).map(({ relay }) => relay)
        : DEFAULT_RELAYS;

      return { pubkey, relays: readRelays };
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

interface DescriptionNoost {
  userPubkey: string; // hex
  frenstrPubkey: string; // hex
  frenstrPrivkey: string; // hex
  content: string;
}

export const createDescriptionNoost = ({
  userPubkey,
  frenstrPubkey,
  frenstrPrivkey,
  content,
}: DescriptionNoost) => {
  const baseEvent = {
    kind: 1,
    pubkey: frenstrPubkey,
    created_at: Math.floor(Date.now() / 1000),
    tags: [["p", userPubkey]],
    content: `${CONTENT_PREFIX}${content}`,
  };
  const eventWithId = { ...baseEvent, id: getEventHash(baseEvent) };

  return { ...eventWithId, sig: signEvent(eventWithId, frenstrPrivkey) };
};

interface FortuneCookieNoost {
  userPubkey: string; // hex
  fortuneCookiePubkey: string; // hex
  fortuneCookiePrivkey: string; // hex
  content: string;
}

export const createFortuneCookieNoost = ({
  userPubkey,
  fortuneCookiePubkey,
  fortuneCookiePrivkey,
  content,
}: FortuneCookieNoost) => {
  const baseEvent = {
    kind: 1,
    pubkey: fortuneCookiePubkey,
    created_at: Math.floor(Date.now() / 1000),
    tags: [
      ["p", userPubkey],
      ["t", "fortunecookie"],
    ],
    content: `#[0] #FortuneCookie 🥠\n\n${content}`,
  };
  const eventWithId = { ...baseEvent, id: getEventHash(baseEvent) };

  return { ...eventWithId, sig: signEvent(eventWithId, fortuneCookiePrivkey) };
};

export const publishNoost = async (event: Event) => {
  const relay = relayInit("wss://nostr.mutinywallet.com");

  try {
    relay.on("connect", () => {
      console.log(`connected`);
    });
    relay.on("error", () => {
      console.log(`failed`);
    });

    await relay.connect();

    let pub = relay.publish(event);
    return await new Promise((resolve, reject) => {
      pub.on("ok", () => {
        console.log(`${relay.url} has accepted our event`);
        resolve(true);
      });
      pub.on("failed", (reason: string) => {
        console.log(`failed to publish to ${relay.url}: ${reason}`);
        reject();
      });
    });
  } catch (error) {
    return false;
  } finally {
    if (relay) {
      try {
        relay.close();
      } catch {
        // fail silently for errors that happen when closing the pool
      }
    }
  }
};

export const getExistingDescriptionEvent = async (pubkey: string) => {
  const frenstrEventsUrl = `${window.location.href}api/users/${process.env.NEXT_PUBLIC_FRENSTR_NOSTR_PUBLIC_KEY}/events?limit=100`;
  const frenstrEvents: Event[] = await fetch(frenstrEventsUrl).then((res) =>
    res.json()
  );
  return frenstrEvents.find(({ tags }) => tags[0][1] === pubkey);
};

export const getExistingFortuneCookieEvent = async (pubkey: string) => {
  const fortuneCookieEventsUrl = `${window.location.origin}/api/users/${process.env.NEXT_PUBLIC_FORTUNE_COOKIE_PUBLIC_KEY}/events?limit=100`;
  const fortuneCookieEvents: Event[] = await fetch(fortuneCookieEventsUrl).then(
    (res) => res.json()
  );
  return fortuneCookieEvents.find(({ tags }) => tags[0][1] === pubkey);
};
