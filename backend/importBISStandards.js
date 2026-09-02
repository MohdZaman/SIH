import "dotenv/config";
import XLSX from "xlsx";

import connectDB from "./src/config/db.js";
import Standard from "./src/models/standardModel.js";


const importBISStandards = async () => {

    try {

        // Connect to MongoDB
        await connectDB();

        // Read Excel file
        const workbook = XLSX.readFile(
            "./data/BIS_Standards_Master_Cleaned.xlsx"
        );

        // Get Standards_Master sheet
        const worksheet = workbook.Sheets["Standards_Master"];

        if (!worksheet) {
            throw new Error("Standards_Master sheet not found");
        }

        // Convert Excel rows to JavaScript objects
        const rows = XLSX.utils.sheet_to_json(worksheet);

        console.log(`Found ${rows.length} BIS standards`);


       const standards = rows.map((row) => {

    const code = String(row["IS Code"] || "").trim();
    const title = String(row["Title"] || "").trim();
    const category = String(row["Category"] || "").trim();
    const subcategory = String(row["Subcategory"] || "").trim();
    const scope = String(row["Scope"] || "").trim();
    const source = String(row["Source"] || "").trim();

    // Extract version/year from the IS code
    // Examples:
    // IS 1786:2008              → family: IS 1786, version: 2008
    // IS 432 (Part 1):1982     → family: IS 432 (Part 1), version: 1982
    // IS 1786                  → family: IS 1786, version: null

    const versionMatch = code.match(/:(\d{4})$/);

    const version = versionMatch
        ? versionMatch[1]
        : null;

    const standardFamily = versionMatch
        ? code.replace(/:\d{4}$/, "").trim()
        : code;


    // Create cleaner searchable keywords
    const keywords = [
        code,
        title,
        category,
        subcategory
    ]
        .filter(Boolean)
        .join(" ")
        .split(/\s+/)
        .map(word => word.replace(/[—,:;()]/g, "").trim())
        .filter(word => word.length > 2)
        .filter(word => ![
            "and",
            "for",
            "the",
            "of",
            "in",
            "to",
            "with",
            "used"
        ].includes(word.toLowerCase()));


    return {
        code,
        title,

        standardFamily,
        version,

        category,
        subcategory,

        // Excel Scope → MongoDB description
        description: scope,

        source,

        keywords,

        status: "ACTIVE"
    };
});


        // Insert / update standards
        for (const standard of standards) {

            await Standard.findOneAndUpdate(
                { code: standard.code },
                standard,
              {
    upsert: true,
    returnDocument: "after",
    setDefaultsOnInsert: true
}
            );

        }


        console.log(
            `${standards.length} BIS standards imported successfully`
        );

        process.exit(0);

    } catch (error) {

        console.error(
            "BIS import error:",
            error
        );

        process.exit(1);
    }
};


importBISStandards();