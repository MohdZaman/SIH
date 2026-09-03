import "dotenv/config";

import connectDB from "./src/config/db.js";
import Requirement from "./src/models/requirementModel.js";
import Standard from "./src/models/standardModel.js";
import { evaluateStandard } from "./src/services/standardEvaluationService.js";

const test = async () => {
    try {
        await connectDB();

        const requirement = await Requirement.findOne();

        const standard = await Standard.findOne({
            code: "IS 1786"
        });

        if (!requirement) {
            throw new Error("Requirement not found");
        }

        if (!standard) {
            throw new Error("Standard not found");
        }

        const result = await evaluateStandard(
            requirement,
            standard
        );

        console.log("Evaluation result:");
        console.dir(result, { depth: null });

        process.exit(0);

    } catch (error) {
        console.error("Standard evaluation error:", error);
        process.exit(1);
    }
};

test();