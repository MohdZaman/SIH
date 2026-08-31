import Standard from "../models/standardModel.js";

const searchStandards = async (query) => {
    if (!query || !query.trim()) {
        return [];
    }

    const words = query
        .toLowerCase()
        .trim()
        .split(/\s+/);

    const regexQueries = words.map(word => new RegExp(word, "i"));

    const standards = await Standard.find({
        $or: regexQueries.flatMap(regex => [
            { code: regex },
            { title: regex },
            { description: regex },
            { category: regex },
            { keywords: regex }
        ])
    }).limit(20);

    return standards;
};

export { searchStandards };