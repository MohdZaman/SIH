import "dotenv/config";
import xlsx from "xlsx";
import mongoose from "mongoose";

import connectDB from "./src/config/db.js";
import Standard from "./src/models/standardModel.js";
import StandardRelation from "./src/models/standardRelationshipModel.js";

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

const FILE_PATH = "./data/BIS_Standards_Master_Cleaned.xlsx";

let workbook;

// Supported relationship types from StandardRelation schema
const VALID_RELATION_TYPES = [
    "NORMATIVE_REFERENCE",
    "TEST_METHOD",
    "TERMINOLOGY",
    "SAFETY",
    "INSTALLATION",
    "RELATED"
];

// -----------------------------------------------------------------------------
// Utility Functions
// -----------------------------------------------------------------------------

const normalizeCode = (code) => {
    if (code === undefined || code === null) {
        return "";
    }

    return String(code)
        .toUpperCase()
        .replace(/\s+/g, " ")
        .trim();
};


const escapeRegex = (text) => {
    return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};


const safeNumber = (value) => {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return null;
    }

    const number = Number(value);

    return Number.isNaN(number)
        ? null
        : number;
};


// -----------------------------------------------------------------------------
// Find Standard
// -----------------------------------------------------------------------------

const findStandard = async (code) => {

    if (!code) {
        return null;
    }

    const normalizedCode = normalizeCode(code);

    if (!normalizedCode) {
        return null;
    }

    const escapedCode = escapeRegex(normalizedCode);

    // -------------------------------------------------------------------------
    // 1. Try exact standard code
    // -------------------------------------------------------------------------

    let standard = await Standard.findOne({
        code: {
            $regex: `^${escapedCode}$`,
            $options: "i"
        }
    });

    if (standard) {
        return standard;
    }

    // -------------------------------------------------------------------------
    // 2. Try standard family
    // -------------------------------------------------------------------------

    standard = await Standard.findOne({
        standardFamily: {
            $regex: `^${escapedCode}$`,
            $options: "i"
        }
    });

    if (standard) {
        return standard;
    }

    return null;
};


// -----------------------------------------------------------------------------
// Extract explicit IS references from Standard_Content
// -----------------------------------------------------------------------------

const extractStandardReferences = (text) => {

    if (!text) {
        return [];
    }

    /*
        Examples detected:

        IS 14543
        IS 14543:2024
        IS 16102 (Part 1)
        IS 1234
        IS 10322 (Part 5/Sec 3)
    */

    const regex =
        /\bIS\s+\d+(?:\s*\([^)]*\))?(?:\s*:\s*\d{4})?/gi;

    const matches =
        String(text).match(regex) || [];

    return [
        ...new Set(
            matches.map(normalizeCode)
        )
    ];
};


// -----------------------------------------------------------------------------
// Check for Existing Relation
// -----------------------------------------------------------------------------

const relationExists = async ({
    sourceStandard,
    targetStandard,
    relationType
}) => {

    return await StandardRelation.findOne({
        sourceStandard,
        targetStandard,
        relationType
    });
};


// -----------------------------------------------------------------------------
// Import Relations Discovered from Standard_Content
// -----------------------------------------------------------------------------

const importContentRelations = async () => {

    const sheet =
        workbook.Sheets["Standard_Content"];

    if (!sheet) {

        console.log(
            "Standard_Content sheet not found."
        );

        return {
            created: 0,
            skipped: 0
        };
    }

    const rows =
        xlsx.utils.sheet_to_json(sheet);

    console.log(
        `Found ${rows.length} content records`
    );

    let created = 0;
    let skipped = 0;

    // -------------------------------------------------------------------------
    // Process every content row
    // -------------------------------------------------------------------------

    for (const row of rows) {

        const sourceCode =
            normalizeCode(row["IS Code"]);

        const content =
            row["Content"];

        const clause =
            row["Clause"];

        const page =
            row["Page"];

        const source =
            row["Source"];

        // ---------------------------------------------------------------------
        // Validate row
        // ---------------------------------------------------------------------

        if (!sourceCode || !content) {

            skipped++;

            continue;
        }

        // ---------------------------------------------------------------------
        // Find source standard
        // ---------------------------------------------------------------------

        const sourceStandard =
            await findStandard(sourceCode);

        if (!sourceStandard) {

            console.log(
                `Source standard not found: ${sourceCode}`
            );

            skipped++;

            continue;
        }

        // ---------------------------------------------------------------------
        // Extract explicit standard references
        // ---------------------------------------------------------------------

        const references =
            extractStandardReferences(content);

        if (references.length === 0) {
            continue;
        }

        // ---------------------------------------------------------------------
        // Create relations
        // ---------------------------------------------------------------------

        for (const referenceCode of references) {

            // Prevent self-referencing edge
            if (
                referenceCode === sourceCode
            ) {
                continue;
            }

            // -----------------------------------------------------------------
            // Find target standard
            // -----------------------------------------------------------------

            const targetStandard =
                await findStandard(referenceCode);

            if (!targetStandard) {

                console.log(
                    `Target standard not found: ${referenceCode}`
                );

                skipped++;

                continue;
            }

            // -----------------------------------------------------------------
            // Check duplicate
            // -----------------------------------------------------------------

            const existing =
                await relationExists({
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

            // -----------------------------------------------------------------
            // Create relation
            // -----------------------------------------------------------------

            await StandardRelation.create({

                sourceStandard:
                    sourceStandard._id,

                targetStandard:
                    targetStandard._id,

                relationType:
                    "NORMATIVE_REFERENCE",

                evidenceText:
                    String(content),

                source:
                    source || null,

                sourceUrl:
                    null,

                clause:
                    clause !== undefined &&
                    clause !== null &&
                    clause !== ""
                        ? String(clause)
                        : null,

                page:
                    safeNumber(page),

                confidence:
                    0.90
            });

            created++;

            console.log(
                `Created normative relation: ${sourceCode} → ${referenceCode}`
            );
        }
    }

    return {
        created,
        skipped
    };
};


// -----------------------------------------------------------------------------
// Import Relations from Standard_Relations Sheet
// -----------------------------------------------------------------------------

const importGraphRelations = async () => {

    const sheet =
        workbook.Sheets["Standard_Relations"];

    if (!sheet) {

        console.log(
            "Standard_Relations sheet not found."
        );

        return {
            created: 0,
            skipped: 0
        };
    }

    const rows =
        xlsx.utils.sheet_to_json(sheet);

    console.log(
        `Found ${rows.length} graph relation records`
    );

    let created = 0;
    let skipped = 0;

    // -------------------------------------------------------------------------
    // Process every graph relation
    // -------------------------------------------------------------------------

    for (const row of rows) {

        const sourceCode =
            normalizeCode(
                row["Source IS Code"]
            );

        const targetCode =
            normalizeCode(
                row["Target IS Code"]
            );

        const relationType =
            normalizeCode(
                row["Relation Type"]
            );

        // ---------------------------------------------------------------------
        // Ignore empty rows
        // ---------------------------------------------------------------------

        if (
            !sourceCode ||
            !targetCode ||
            !relationType
        ) {
            continue;
        }

        // ---------------------------------------------------------------------
        // Validate relation type
        // ---------------------------------------------------------------------

        if (
            !VALID_RELATION_TYPES.includes(
                relationType
            )
        ) {

            console.log(
                `Skipping invalid relation type: ${relationType}`
            );

            skipped++;

            continue;
        }

        // ---------------------------------------------------------------------
        // Prevent self-referencing edges
        // ---------------------------------------------------------------------

        if (
            sourceCode === targetCode
        ) {

            console.log(
                `Skipping self relation: ${sourceCode}`
            );

            skipped++;

            continue;
        }

        // ---------------------------------------------------------------------
        // Find source standard
        // ---------------------------------------------------------------------

        const sourceStandard =
            await findStandard(sourceCode);

        if (!sourceStandard) {

            console.log(
                `Source standard not found: ${sourceCode}`
            );

            skipped++;

            continue;
        }

        // ---------------------------------------------------------------------
        // Find target standard
        // ---------------------------------------------------------------------

        const targetStandard =
            await findStandard(targetCode);

        if (!targetStandard) {

            console.log(
                `Target standard not found: ${targetCode}`
            );

            skipped++;

            continue;
        }

        // ---------------------------------------------------------------------
        // Check duplicate
        // ---------------------------------------------------------------------

        const existing =
            await relationExists({
                sourceStandard:
                    sourceStandard._id,

                targetStandard:
                    targetStandard._id,

                relationType
            });

        if (existing) {

            console.log(
                `Relation already exists: ${sourceCode} → ${targetCode} [${relationType}]`
            );

            continue;
        }

        // ---------------------------------------------------------------------
        // Prepare evidence
        // ---------------------------------------------------------------------

        const evidenceText =
            row["Evidence Text"]
                ? String(row["Evidence Text"])
                : null;

        const source =
            row["Source"]
                ? String(row["Source"])
                : null;

        const sourceUrl =
            row["Source URL"]
                ? String(row["Source URL"])
                : null;

        const clause =
            row["Clause"] !== undefined &&
            row["Clause"] !== null &&
            row["Clause"] !== ""
                ? String(row["Clause"])
                : null;

        const page =
            safeNumber(row["Page"]);

        const confidence =
            safeNumber(row["Confidence"]);

        // ---------------------------------------------------------------------
        // Create graph relation
        // ---------------------------------------------------------------------

        await StandardRelation.create({

            sourceStandard:
                sourceStandard._id,

            targetStandard:
                targetStandard._id,

            relationType,

            evidenceText,

            source,

            sourceUrl,

            clause,

            page,

            confidence
        });

        created++;

        console.log(
            `Created graph relation: ${sourceCode} → ${targetCode} [${relationType}]`
        );
    }

    return {
        created,
        skipped
    };
};


// -----------------------------------------------------------------------------
// Main Import Function
// -----------------------------------------------------------------------------

const importRelations = async () => {

    try {

        // ---------------------------------------------------------------------
        // Connect MongoDB
        // ---------------------------------------------------------------------

        await connectDB();

        console.log(
            "MongoDB connected."
        );

        // ---------------------------------------------------------------------
        // Read Excel workbook
        // ---------------------------------------------------------------------

        console.log(
            "Reading BIS workbook..."
        );

        workbook =
            xlsx.readFile(FILE_PATH);

        console.log(
            `Workbook loaded: ${FILE_PATH}`
        );

        // ---------------------------------------------------------------------
        // Show available sheets
        // ---------------------------------------------------------------------

        console.log(
            "Available sheets:"
        );

        console.log(
            workbook.SheetNames
        );

        // ---------------------------------------------------------------------
        // Import explicit content references
        // ---------------------------------------------------------------------

        console.log(
            "\n========================================"
        );

        console.log(
            "IMPORTING STANDARD CONTENT REFERENCES"
        );

        console.log(
            "========================================"
        );

        const contentResult =
            await importContentRelations();

        // ---------------------------------------------------------------------
        // Import graph relations
        // ---------------------------------------------------------------------

        console.log(
            "\n========================================"
        );

        console.log(
            "IMPORTING STANDARD GRAPH RELATIONS"
        );

        console.log(
            "========================================"
        );

        const graphResult =
            await importGraphRelations();

        // ---------------------------------------------------------------------
        // Final summary
        // ---------------------------------------------------------------------

        console.log(
            "\n========================================"
        );

        console.log(
            "RELATION IMPORT COMPLETED"
        );

        console.log(
            "========================================"
        );

        console.log(
            `Content relations created : ${contentResult.created}`
        );

        console.log(
            `Content relations skipped : ${contentResult.skipped}`
        );

        console.log(
            `Graph relations created   : ${graphResult.created}`
        );

        console.log(
            `Graph relations skipped   : ${graphResult.skipped}`
        );

        console.log(
            `Total relations created   : ${
                contentResult.created +
                graphResult.created
            }`
        );

        console.log(
            "========================================"
        );

    } catch (error) {

        console.error(
            "\nRelation import error:"
        );

        console.error(error);

        process.exitCode = 1;

    } finally {

        // ---------------------------------------------------------------------
        // Close MongoDB connection
        // ---------------------------------------------------------------------

        if (
            mongoose.connection.readyState !== 0
        ) {

            await mongoose.connection.close();

            console.log(
                "MongoDB connection closed."
            );
        }
    }
};


// -----------------------------------------------------------------------------
// Run importer
// -----------------------------------------------------------------------------

importRelations();