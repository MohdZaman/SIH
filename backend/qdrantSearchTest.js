import "dotenv/config";
import { searchSimilarStandards } from "./src/services/qdrantStandardServices.js";

const test = async () => {

    try {

        const query = `
        Supply of corrosion resistant TMT reinforcement bars
        for bridge construction
        `;

        const results = await searchSimilarStandards(query, 5);

        console.log("Search results:");

        console.dir(results, { depth: null });

    } catch (error) {

        console.error("Qdrant search error:", error);

    }
};

test();