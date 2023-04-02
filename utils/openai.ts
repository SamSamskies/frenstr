import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const createUserDescription = async (
  pubkey: string,
  content: string
) => {
  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content }],
    user: pubkey,
  });

  return res.data.choices[0].message?.content;
};
