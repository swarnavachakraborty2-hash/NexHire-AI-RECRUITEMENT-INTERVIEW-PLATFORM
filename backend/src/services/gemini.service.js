import { GoogleGenAI } from "@google/genai";
import * as z from "zod";


const interviewQuestionsSchema = z.object({
    questions: z.array(z.object({
        questionNumber: z.number().int(),
        questionText: z.string(),
        type: z.enum(["verbal", "coding", "technical", "behavioral", "System Design"]),
        expectedTopics: z.array(z.string()),
        timeLimit: z.number().int(),
        starterCode: z.string().default(""),
        testCases: z.string().default("")
    }))
});


const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


const generateInterviewQuestions = async ({
    title,          // e.g. "Full Stack MERN Developer" (from interview.title)
    interviewType,  // e.g. "Technical", "Behavioral", "System Design", "Coding"
    difficulty,     // e.g. "Junior", "Mid-Level", "Senior"
    duration,       // e.g. 20 (minutes)
    topics          // e.g. ["React", "Node.js", "MongoDB", "REST APIs"] (optional array)
}) => {
    const count = Math.max(3, Math.min(8, Math.round(duration / 4)));

    const prompt = `
You are an expert technical interviewer conducting a mock interview for the NexHire AI recruitment platform.

Generate exactly ${count} interview questions based on the following specifications:
- Role / Job Title: ${title}
- Interview Category: ${interviewType}
- Target Seniority / Difficulty: ${difficulty}
${topics && topics.length ? `- Core Focus Topics: ${topics.join(", ")}` : ""}
- Total Session Duration: ${duration} minutes

Requirements for the output:
1. Progress logically: Start with a warm-up/conceptual question, move into deeper technical/scenario questions, and finish with a problem-solving question.
2. Return ONLY a valid JSON array of objects. Do not include markdown code fences, backticks, or explanatory text.
3. Each question object in the array MUST contain the following exact keys:
   - "questionNumber": (Integer starting from 1)
   - "questionText": (Clear, professional question directed at the candidate)
   - "type": (One of: "verbal", "technical", "coding", "behavioral")
   - "expectedTopics": (Array of 3-5 key concepts, keywords, or points the candidate should mention in a great answer)
   - "timeLimit": (Integer in seconds allocated for answering, e.g. 120, 180, 240)
   - "starterCode": (String with boilerplate code if type is "coding", otherwise empty string "")
   - "testCases": (String describing example input/output if type is "coding", otherwise empty string "")
`;

    const interaction = await ai.interactions.create({
        model: `${process.env.GEMINI_MODEL}`,
        input: prompt,
        response_format: {
            type: 'text',
            mime_type: 'application/json',
            schema: z.toJSONSchema(interviewQuestionsSchema)
        },
    });

    const parsedData = JSON.parse(interaction.output_text)
    return parsedData.questions
}


export default generateInterviewQuestions