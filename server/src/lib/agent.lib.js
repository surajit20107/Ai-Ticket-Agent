import { GoogleGenerativeAI } from "@google/generative-ai";

export const processTicket = async (ticket) => {
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      throw new Error("❌ Gemini API key is not defined...!!");
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert assistant that processes technical tickets and assigns them to the right moderator based on their role.

You must:
- Analyze the ticket's title and description.
- Determine the skills required to resolve the issue (e.g., javascript, python, react, nodejs).
- Summarize the issue clearly for human moderators.
- Estimate the ticket's priority: "low", "medium", or "high".
- Return helpful notes that can guide moderators in resolving the issue.

❗ Output Rules:
- You must ONLY respond with a valid JSON object.
- Do NOT include markdown, comments, or any text outside the JSON.

Example response format:
{
  "summary": "The user is facing an issue with the login page. The page is not loading and the user is unable to login.",
  "priority": "high",
  "helpfulNotes": "Check if CORS headers are set correctly and ensure you're hitting the correct login endpoint.",
  "relatedSkills": ["javascript", "react", "nodejs"]
}

Process the ticket and generate the following:
- A short summary of the issue
- A priority level: "low", "medium", or "high"
- An array of required skills (e.g., ["javascript", "react", "python"])

Ticket info:
Title: ${ticket.title}
Description: ${ticket.description}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("AI Response:", text);

    // Clean up the response to extract JSON
    let jsonString = text.trim();

    // Remove markdown code blocks if present
    const match = jsonString.match(/```json\s*([\s\S]*?)\s*```/i);
    if (match) {
      jsonString = match[1];
    } else if (jsonString.includes('```')) {
      // Handle other code block formats
      jsonString = jsonString.replace(/```[\s\S]*?\n/g, '').replace(/```/g, '');
    }

    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error processing ticket", error.message);
    // Return a fallback response if AI processing fails
    return {
      summary: `Support ticket: ${ticket.title}`,
      priority: "medium",
      helpfulNotes: "This ticket requires manual review by a moderator.",
      relatedSkills: ["general"]
    };
  }
};