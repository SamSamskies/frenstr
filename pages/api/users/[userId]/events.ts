import { NextApiRequest, NextApiResponse } from "next";
import { makeUrlWithParams } from "@/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, relays, limit } = req.query;

  switch (req.method) {
    case "GET":
      try {
        const url = makeUrlWithParams(
          `https://www.nostrstuff.com/api/users/${userId}/events`,
          { relays: relays as string, limit: (limit as string) ?? "20" }
        );
        const response = await fetch(url);

        if (response.ok) {
          res.status(response.status).json(await response.json());
        } else {
          res.status(response.status).end(`Error: ${response.statusText}`);
        }
      } catch (error) {
        res.status(500).end("Something went wrong :(");
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
