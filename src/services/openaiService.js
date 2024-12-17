// src/services/openaiService.js
import OpenAI from "openai";

import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, // Use your environment variable
  dangerouslyAllowBrowser: true, // Required for client-side use
});

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
      temperature: 0.7,
    });
    console.log("VARIATION resp: ", response.choices[0]?.message?.content);

    return response.choices[0]?.message?.content || "No Title found.";
  } catch (error) {
    console.error("Error generating title framework:", error);
    throw new Error("Failed to generate title framework.");
  }
};

// Generate title frameworks (4 variations)

// Define the Zod schema for the structured response
const TitleFrameworkSchema = z.object({
  title_frameworks: z.array(
    z.object({
      title: z.string(),
      topic: z.string(),
      niche: z.string(),
    })
  ),
});

export const generateTitleFrameworks = async (title) => {
  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates reusable YouTube video titles in random topics form random niches.",
        },
        {
          role: "user",
          content: `Generate 4 variations of youtube titles in random niches based on this title: "${title}" `,
        },
      ],
      response_format: zodResponseFormat(
        TitleFrameworkSchema,
        "title_frameworks"
      ),
    });

    const parsedResponse = completion.choices[0].message.parsed;
    console.log("Parsed Response:", parsedResponse);
    return parsedResponse.title_frameworks;
  } catch (error) {
    console.error("Error generating title frameworks:", error);
    throw new Error("Failed to generate title frameworks.");
  }
};

// Generate titles from user input
export const generateTitlesFromFramework = async (framework, idea) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a YouTube video title generator that follows a specific framework to create engaging titles.",
        },
        {
          role: "user",
          content: `Using this framework: "${framework}", generate 3 engaging YouTube video titles for the following video idea: "${idea}"`,
        },
      ],
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content.split("\n").filter(Boolean);
  } catch (error) {
    console.error("Error generating titles:", error);
    throw new Error("Failed to generate titles.");
  }
};
