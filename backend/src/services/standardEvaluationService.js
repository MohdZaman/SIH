
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const evaluateStandard = async (requirement, standard) => {

    const prompt = `
You are a BIS standards compliance evaluation assistant.

Evaluate how well the BIS standard matches the procurement requirement.

Procurement Requirement:
Product: ${requirement.product}
Application: ${requirement.application || "Not specified"}
Technical Parameters: ${JSON.stringify(requirement.technicalParameters)}
Keywords: ${(requirement.keywords || []).join(", ")}
Raw Text: ${requirement.rawText}

BIS Standard:
Code: ${standard.code}
Title: ${standard.title}
Description: ${standard.description}
Category: ${standard.category}
Latest Version: ${standard.latestVersion}
Keywords: ${(standard.keywords || []).join(", ")}

Return ONLY valid JSON.

Use exactly this structure:

{
    "relevanceScore": 0,
    "productMatch": false,
    "applicationMatch": false,
    "technicalMatch": false,
    "missingRequirements": [],
    "reason": ""
}

Rules:
- relevanceScore must be between 0 and 100.
- productMatch should be true only when the standard clearly applies to the requested product.
- applicationMatch should be true when the standard is applicable to the stated application.
- technicalMatch should be true only when the available standard information supports the technical requirements.
- Do not invent technical requirements or standard specifications.
- If information is unavailable, mention it in missingRequirements.
- reason should briefly explain the evaluation.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt
    });

    const result = response.text.trim();

    return JSON.parse(result);
};

export { evaluateStandard };

