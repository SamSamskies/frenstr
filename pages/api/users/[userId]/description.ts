import { NextApiRequest, NextApiResponse } from "next";
import { createUserDescription } from "@/utils/openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, content } = req.body;

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
