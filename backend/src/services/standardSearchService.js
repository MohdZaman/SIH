import Standard from "../models/standardModel.js";
import { searchSimilarStandards } from "./qdrantStandardServices.js";

const searchStandards = async (query, limit = 10) => {
    if (!query || !query.trim()) {
        return [];
    }

    const results = await searchSimilarStandards(
        query.trim(),
        limit
    );

    const standards = [];

    for (const result of results.points || []) {
        if (!result.payload?.standardId) continue;

        const standard = await Standard.findById(
            result.payload.standardId
        );

        if (!standard) continue;

        standards.push({
            _id: standard._id,
            code: standard.code,
            title: standard.title,
            standardFamily: standard.standardFamily,
            version: standard.version,
            category: standard.category,
            subcategory: standard.subcategory,
            description: standard.description,
            source: standard.source,
            status: standard.status,
            latestVersion: standard.latestVersion,
            similarityScore: result.score
        });
    }

    return standards;
};

export { searchStandards };