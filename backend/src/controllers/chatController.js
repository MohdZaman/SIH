import { generateResponse } from "../services/geminiServices.js";

export const chat = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        const response = await generateResponse(message);

        res.status(200).json({
            success: true,
            answer: response
        });

    } catch (error) {
        console.error("Chat error:", error);

        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};