import { NextApiRequest, NextApiResponse } from "next";
import { createFortuneCookieNoost } from "@/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, content } = req.body;

  switch (req.method) {
    case "POST":
      try {
        const event = createFortuneCookieNoost({
          userPubkey: userId as string,
          content: content as string,
          fortuneCookiePubkey: process.env
            .NEXT_PUBLIC_FORTUNE_COOKIE_PUBLIC_KEY as string,
          fortuneCookiePrivkey: process.env
            .FORTUNE_COOKIE_NOSTR_PRIVATE_KEY as string,
        });

        res.status(201).json(event);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Something went wrong :(";

        res.status(500).json({
          message: errorMessage,
          event: JSON.stringify(event),
        });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
