import { NextApiRequest, NextApiResponse } from "next";
import { createUserDescription } from "@/utils/openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, content } = req.body;
  const isHostWhitelisted = () => {
    for (const host of ["frenstr.com", "www.frenstr.com", "localhost:3000"]) {
      if (
        req.headers.host === host ||
        req.headers.host?.endsWith("-samsamskies.vercel.app")
      ) {
        return true;
      }
    }

    return false;
  };

  // TODO: implement a better way to lock this endpoint down
  if (!isHostWhitelisted()) {
    return res.status(403).end("Forbidden");
  }

  switch (req.method) {
    case "POST":
      try {
        const description = await createUserDescription(
          userId as string,
          content as string
        );

        res.status(200).json(description ?? null);
      } catch (error) {
        res.status(500).end("Something went wrong :(");
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
