import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


export const generateResponse = async (message) => {

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: message
    });

    return response.text;
};


export const extractRequirements = async (text) => {

    const prompt = `
You are a technical procurement requirement extraction assistant.

Analyze the procurement description below.

Extract ONLY information that is explicitly present
or strongly implied by the provided description.

Return ONLY valid JSON.
Do not add markdown.
Do not add explanations.

Use exactly this structure:

{
    "product": "string",
    "application": "string or null",
    "technicalParameters": {},
    "keywords": []
}

Procurement description:
${text}
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt
    });

    const textResponse = response.text.trim();

    return JSON.parse(textResponse);
};

export const generateEmbedding = async(text)=>{
    const response = await ai.models.embedContent({
        model:"gemini-embedding-001",
        contents:text
    })
    return response.embeddings[0].values
}