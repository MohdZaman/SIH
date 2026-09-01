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

            const code = row["IS Code"];
            const title = row["Title"];
            const category = row["Category"];
            const subcategory = row["Subcategory"];
            const scope = row["Scope"];
            const source = row["Source"];


            // Create searchable keywords
            const keywords = [
                code,
                title,
                category,
                subcategory
            ]
                .filter(Boolean)
                .join(" ")
                .split(/\s+/)
                .filter(Boolean);


            return {
                code,
                title,
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
                    new: true,
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