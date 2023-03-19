import { NextApiRequest, NextApiResponse } from "next";
import { createDescriptionNoost, publishNoost } from "@/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, content } = req.body;

  switch (req.method) {
    case "POST":
      try {
        const event = createDescriptionNoost({
          userPubkey: userId as string,
          content: content as string,
          frenstrPubkey: process.env
            .NEXT_PUBLIC_FRENSTR_NOSTR_PUBLIC_KEY as string,
          frenstrPrivkey: process.env.FRENSTR_NOSTR_PRIVATE_KEY as string,
        });
        const { success, message } = await publishNoost(event);

        if (success) {
          res.status(201).end("ok");
        } else {
          res.status(500).json({
            message,
            event: JSON.stringify(event),
          });
        }
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
