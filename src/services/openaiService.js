// src/services/openaiService.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, // Use your environment variable
  dangerouslyAllowBrowser: true, // Required for client-side use
});

console.log("api key: ", process.env.REACT_APP_OPENAI_API_KEY);

export const generateTitleFramework = async (title) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that only creates reusable YouTube video title frameworks. Create a title framework that can be used in different niches based on the provided title.",
        },
        {
          role: "user",
          content: `Generate a reusable title framework based on this title: "${title}"`,
        },
      ],
      max_tokens: 100,
      temperature: 0.7,
    });
    console.log("OPENAI RESP: ", response);
    return response.choices[0]?.message?.content || "No framework found.";
  } catch (error) {
    console.error("Error generating title framework:", error);
    throw new Error("Failed to generate title framework.");
  }
};
