import "dotenv/config";
import { generateEmbedding } from "./src/services/geminiServices.js";

const test = async () => {

    const text =
        "High strength TMT reinforcement bars for bridge construction";

    const embedding = await generateEmbedding(text);

    console.log("Embedding length:", embedding.length);
    console.log("First 10 values:", embedding.slice(0, 10));
};

test();