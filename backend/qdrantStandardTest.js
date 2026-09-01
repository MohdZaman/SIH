import "dotenv/config";
import connectDB from "./src/config/db.js";
import { indexAllStandards } from "./src/services/qdrantStandardServices.js";

const test = async () => {

    try {
        await connectDB();
        await indexAllStandards();

        console.log("Standard indexing completed");

    } catch (error) {

        console.error("Qdrant indexing error:", error);

    }
};

test();