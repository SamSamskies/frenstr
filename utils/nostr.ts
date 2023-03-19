import { nip05, nip19 } from "nostr-tools";

const DEFAULT_RELAYS = [
  "wss://relay.damus.io",
  "wss://relay.snort.social",
  "wss://nostr.wine",
  "wss://eden.nostr.land",
  "wss://relay.orangepill.dev",
  "wss://nostr.fmt.wiz.biz",
  "wss://nostr.milou.lol",
];

export const isNpub = (value: string) =>
  /npub1[acdefghjklmnpqrstuvwxyz023456789]{58}/.test(value);

export const getPubkeyAndRelays = async (value: string) => {
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
