import Standard from "../models/standardModel.js";

const searchStandards = async (query) => {

    if (!query || !query.trim()) {
        return [];
    }

    const keywords = query
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);

    const standards = await Standard.find({
        $or: keywords.flatMap(keyword => [
            { code: { $regex: keyword, $options: "i" } },
            { title: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
            { category: { $regex: keyword, $options: "i" } },
            { subcategory: { $regex: keyword, $options: "i" } },
            { keywords: { $regex: keyword, $options: "i" } }
        ])
    });

    return standards;
};

export { searchStandards };