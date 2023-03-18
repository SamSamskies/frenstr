import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      try {
        const response = await fetch(
          `https://www.nostrstuff.com/api/users/${req.query.userId}/relays`
        );

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
