import "dotenv/config";
import connectDB from "./src/config/db.js";
import Standard from "./src/models/standardModel.js";

await connectDB();

const standards = await Standard.find({
    code: /16102/i
}).select(
    "code title standardFamily version"
);

console.log(
    JSON.stringify(standards, null, 2)
);

process.exit();