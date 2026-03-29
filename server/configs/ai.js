import OpenAI from "openai";
import "dotenv/config";

const ai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export default ai;