import { GoogleGenerativeAI } from '@google/generative-ai';

export const getAIResponse = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ success: false, message: 'Please provide a prompt' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        res.status(200).json({ success: true, answer: responseText });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};