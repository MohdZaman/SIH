import "dotenv/config";
import xlsx from "xlsx";
import mongoose from "mongoose";

import connectDB from "./src/config/db.js";
import Standard from "./src/models/standardModel.js";
import StandardRelation from "./src/models/standardRelationshipModel.js";

const FILE_PATH =
    "./data/BIS_Standards_Master_Cleaned.xlsx";


const normalizeCode = (code) => {

    return code
        .toUpperCase()
        .replace(/\s+/g, " ")
        .trim();

};


const extractStandardReferences = (text) => {

    if (!text) {
        return [];
    }

    /*
        Examples we want to detect:

        IS 14543
        IS 14543:2024
        IS 16102 (Part 1)
        IS 1234
    */

    const regex =
        /\bIS\s+\d+(?:\s*\([^)]*\))?(?:\s*:\s*\d{4})?/gi;

    const matches =
        text.match(regex) || [];

    return [
        ...new Set(
            matches.map(normalizeCode)
        )
    ];

};


const escapeRegex = (text) => {
    return text.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );
};


const findStandard = async (code) => {

    if (!code) {
        return null;
    }

    const escapedCode =
        escapeRegex(code);

    /*
        Exact, case-insensitive match
    */

    let standard =
        await Standard.findOne({
            code: {
                $regex: `^${escapedCode}$`,
                $options: "i"
            }
        });

    if (standard) {
        return standard;
    }

    /*
        Try standardFamily as fallback
    */

    standard =
        await Standard.findOne({
            standardFamily: {
                $regex: `^${escapedCode}$`,
                $options: "i"
            }
        });

    return standard;
};
const importRelations = async () => {

    try {

        await connectDB();

        console.log(
            "Reading BIS workbook..."
        );

        const workbook =
            xlsx.readFile(FILE_PATH);

        const sheet =
            workbook.Sheets[
                "Standard_Content"
            ];

        if (!sheet) {

            throw new Error(
                "Standard_Content sheet not found"
            );

        }

        const rows =
            xlsx.utils.sheet_to_json(
                sheet
            );

        console.log(
            `Found ${rows.length} content records`
        );


        let created = 0;
        let skipped = 0;


        for (const row of rows) {

            const sourceCode =
                normalizeCode(
                    row["IS Code"]
                );

            const content =
                row["Content"];

            const clause =
                row["Clause"];

            const page =
                row["Page"];

            const source =
                row["Source"];


            if (!sourceCode || !content) {

                skipped++;

                continue;

            }


            /*
                Find the standard
                that owns this clause.
            */

            const sourceStandard =
                await findStandard(
                    sourceCode
                );


            if (!sourceStandard) {

                console.log(
                    `Source standard not found: ${sourceCode}`
                );

                skipped++;

                continue;

            }


            /*
                Find explicit references
                inside the clause.
            */

            const references =
                extractStandardReferences(
                    content
                );


            for (
                const referenceCode
                of references
            ) {

                /*
                    Don't create:
                    IS 1234 → IS 1234
                */

                if (
                    referenceCode ===
                    sourceCode
                ) {

                    continue;

                }


                const targetStandard =
                    await findStandard(
                        referenceCode
                    );


                /*
                    We only create an edge
                    when the referenced
                    standard exists in MongoDB.
                */

                if (!targetStandard) {

                    console.log(
                        `Target standard not found: ${referenceCode}`
                    );

                    skipped++;

                    continue;

                }


                const existing =
                    await StandardRelation.findOne({
                        sourceStandard:
                            sourceStandard._id,

                        targetStandard:
                            targetStandard._id,

                        relationType:
                            "NORMATIVE_REFERENCE"
                    });


                if (existing) {

                    continue;

                }


                await StandardRelation.create({

                    sourceStandard:
                        sourceStandard._id,

                    targetStandard:
                        targetStandard._id,

                    relationType:
                        "NORMATIVE_REFERENCE",

                    evidenceText:
                        content,

                    source,

                    clause:
                        clause
                            ? String(clause)
                            : null,

                    page:
                        page || null,

                    confidence: 0.9

                });


                created++;

                console.log(
                    `Created relation: ${sourceCode} → ${referenceCode}`
                );

            }

        }


        console.log(
            "\n--------------------------------"
        );

        console.log(
            "Relation import completed"
        );

        console.log(
            `Created: ${created}`
        );

        console.log(
            `Skipped: ${skipped}`
        );

        console.log(
            "--------------------------------"
        );


    } catch (error) {

        console.error(
            "Relation import error:",
            error
        );

    } finally {

        await mongoose.connection.close();

    }

};


importRelations();